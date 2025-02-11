import {
  MemoDetailSidebar,
  MemoDetailSidebarDrawer,
} from '@/components/MemoDetailSidebar';
import MemoEditor from '@/components/MemoEditor';
import MemoView from '@/components/MemoView';
import MobileHeader from '@/components/MobileHeader';
import useCurrentUser from '@/hooks/useCurrentUser';
import useNavigateTo from '@/hooks/useNavigateTo';
import useResponsiveWidth from '@/hooks/useResponsiveWidth';
import { useMemoStore, useWorkspaceSettingStore } from '@/store/v1';
import { MemoRelation_Type } from '@/types/proto/api/v1/memo_relation_service';
import type { Memo } from '@/types/proto/api/v1/memo_service';
import {
  WorkspaceMemoRelatedSetting,
  WorkspaceSettingKey,
} from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import { Button } from '@usememos/mui';
import clsx from 'clsx';
import { ArrowUpLeftFromCircleIcon, MessageCircleIcon } from 'lucide-react';
import type { ClientError } from 'nice-grpc-web';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';

const MemoDetail = () => {
  const t = useTranslate();
  const { md } = useResponsiveWidth();
  const params = useParams();
  const navigateTo = useNavigateTo();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const currentUser = useCurrentUser();
  const memoStore = useMemoStore();
  const uid = params.uid;
  const memo = memoStore.getMemoByUid(uid || '');
  const workspaceMemoRelatedSetting = WorkspaceMemoRelatedSetting.fromPartial(
    workspaceSettingStore.getWorkspaceSettingByKey(
      WorkspaceSettingKey.MEMO_RELATED
    )?.memoRelatedSetting || {}
  );
  const [parentMemo, setParentMemo] = useState<Memo | undefined>(undefined);
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const commentRelations =
    memo?.relations.filter(
      (relation) =>
        relation.relatedMemo?.name === memo.name &&
        relation.type === MemoRelation_Type.COMMENT
    ) || [];
  const comments = commentRelations
    .map((relation) => memoStore.getMemoByName(relation.memo?.name))
    .filter((memo) => memo) as any as Memo[];
  const showCreateCommentButton =
    workspaceMemoRelatedSetting.enableComment &&
    currentUser &&
    !showCommentEditor;

  // Prepare memo.
  useEffect(() => {
    if (uid) {
      memoStore.fetchMemoByUid(uid).catch((error: ClientError) => {
        toast.error(error.details);
        navigateTo('/403');
      });
    } else {
      navigateTo('/404');
    }
  }, [uid]);

  // Prepare memo comments.
  useEffect(() => {
    if (!memo) {
      return;
    }

    (async () => {
      if (memo.parent) {
        memoStore.getOrFetchMemoByName(memo.parent).then((memo: Memo) => {
          setParentMemo(memo);
        });
      } else {
        setParentMemo(undefined);
      }
      await Promise.all(
        commentRelations.map((relation) =>
          memoStore.getOrFetchMemoByName(relation.memo?.name)
        )
      );
    })();
  }, [memo]);

  if (!memo) {
    return null;
  }

  const handleShowCommentEditor = () => {
    setShowCommentEditor(true);
  };

  const handleCommentCreated = async (memoCommentName: string) => {
    await memoStore.getOrFetchMemoByName(memoCommentName);
    await memoStore.getOrFetchMemoByName(memo.name, { skipCache: true });
    setShowCommentEditor(false);
  };

  return (
    <section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
      {!md && (
        <MobileHeader>
          <MemoDetailSidebarDrawer memo={memo} />
        </MobileHeader>
      )}
      <div
        className={clsx(
          'flex w-full flex-row items-start justify-start gap-4 px-4 sm:px-6'
        )}
      >
        <div className={clsx(md ? 'w-[calc(100%-15rem)]' : 'w-full')}>
          {parentMemo && (
            <div className="mb-2 inline-block w-auto">
              <Link
                className="flex w-auto max-w-xs flex-row flex-nowrap items-center justify-start rounded-lg border px-3 py-1 text-gray-600 text-sm hover:opacity-80 hover:shadow dark:border-gray-500 dark:text-gray-400"
                to={`/m/${parentMemo.uid}`}
                viewTransition
              >
                <ArrowUpLeftFromCircleIcon className="mr-2 h-auto w-4 shrink-0 opacity-60" />
                <span className="truncate">{parentMemo.content}</span>
              </Link>
            </div>
          )}
          <MemoView
            key={`${memo.name}-${memo.displayTime}`}
            className="shadow transition-all hover:shadow-md"
            memo={memo}
            compact={false}
            showCreator
            showVisibility
            showPinned
          />
          <div className="w-full pt-8 pb-16">
            <h2 id="comments" className="sr-only">
              {t('memo.comment.self')}
            </h2>
            <div className="relative mx-auto flex min-h-full w-full flex-grow flex-col items-start justify-start gap-y-1">
              {comments.length === 0 ? (
                showCreateCommentButton && (
                  <div className="flex w-full flex-row items-center justify-center py-6">
                    <Button
                      variant="plain"
                      color="primary"
                      onClick={handleShowCommentEditor}
                    >
                      <span className="text-gray-500">
                        {t('memo.comment.write-a-comment')}
                      </span>
                      <MessageCircleIcon className="ml-2 h-auto w-5 text-gray-500" />
                    </Button>
                  </div>
                )
              ) : (
                <>
                  <div className="mb-2 flex h-8 w-full flex-row items-center justify-between pl-3">
                    <div className="flex flex-row items-center justify-start">
                      <MessageCircleIcon className="mr-1 h-auto w-5 text-gray-400" />
                      <span className="text-gray-400 text-sm">
                        {t('memo.comment.self')}
                      </span>
                      <span className="ml-1 text-gray-400 text-sm">
                        ({comments.length})
                      </span>
                    </div>
                    {showCreateCommentButton && (
                      <Button
                        variant="plain"
                        color="primary"
                        className="text-gray-500"
                        onClick={handleShowCommentEditor}
                      >
                        {t('memo.comment.write-a-comment')}
                      </Button>
                    )}
                  </div>
                  {comments.map((comment) => (
                    <MemoView
                      key={`${comment.name}-${comment.displayTime}`}
                      memo={comment}
                      showCreator
                      compact
                    />
                  ))}
                </>
              )}
            </div>
            {showCommentEditor && (
              <div className="w-full">
                <MemoEditor
                  cacheKey={`${memo.name}-${memo.updateTime}-comment`}
                  placeholder={t('editor.add-your-comment-here')}
                  parentMemoName={memo.name}
                  autoFocus
                  onConfirm={handleCommentCreated}
                  onCancel={() => setShowCommentEditor(false)}
                />
              </div>
            )}
          </div>
        </div>
        {md && (
          <div className="-mt-6 sticky top-0 left-0 h-full w-56 shrink-0">
            <MemoDetailSidebar className="py-6" memo={memo} />
          </div>
        )}
      </div>
    </section>
  );
};

export default MemoDetail;

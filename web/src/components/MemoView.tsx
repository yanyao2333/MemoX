import useAsyncEffect from '@/hooks/useAsyncEffect';
import useCurrentUser from '@/hooks/useCurrentUser';
import useNavigateTo from '@/hooks/useNavigateTo';
import {
  useMemoStore,
  useUserStore,
  useWorkspaceSettingStore,
} from '@/store/v1';
import { NodeType } from '@/types/proto/api/v1/markdown_service';
import { MemoRelation_Type } from '@/types/proto/api/v1/memo_relation_service';
import { type Memo, Visibility } from '@/types/proto/api/v1/memo_service';
import { WorkspaceMemoRelatedSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import { isSuperUser } from '@/utils/user';
import { Tooltip } from '@mui/joy';
import clsx from 'clsx';
import { BookmarkIcon, MessageCircleMoreIcon } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MemoActionMenu from './MemoActionMenu';
import MemoContent from './MemoContent';
import MemoEditor from './MemoEditor';
import MemoLocationView from './MemoLocationView';
import MemoReactionistView from './MemoReactionListView';
import MemoRelationListView from './MemoRelationListView';
import MemoResourceListView from './MemoResourceListView';
import showPreviewImageDialog from './PreviewImageDialog';
import ReactionSelector from './ReactionSelector';
import UserAvatar from './UserAvatar';
import VisibilityIcon from './VisibilityIcon';

interface Props {
  memo: Memo;
  displayTimeFormat?: 'auto' | 'time';
  compact?: boolean;
  showCreator?: boolean;
  showVisibility?: boolean;
  showPinned?: boolean;
  className?: string;
}

const MemoView: React.FC<Props> = (props: Props) => {
  const { memo, className } = props;
  const t = useTranslate();
  const location = useLocation();
  const navigateTo = useNavigateTo();
  const currentUser = useCurrentUser();
  const userStore = useUserStore();
  const user = useCurrentUser();
  const memoStore = useMemoStore();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [creator, setCreator] = useState(userStore.getUserByName(memo.creator));
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const workspaceMemoRelatedSetting =
    workspaceSettingStore.getWorkspaceSettingByKey(
      WorkspaceSettingKey.MEMO_RELATED
    ).memoRelatedSetting || WorkspaceMemoRelatedSetting.fromPartial({});
  const referencedMemos = memo.relations.filter(
    (relation) => relation.type === MemoRelation_Type.REFERENCE
  );
  const commentAmount = memo.relations.filter(
    (relation) =>
      relation.type === MemoRelation_Type.COMMENT &&
      relation.relatedMemo?.name === memo.name
  ).length;
  const relativeTimeFormat =
    Date.now() - memo.displayTime?.getTime() > 1000 * 60 * 60 * 24
      ? 'datetime'
      : 'auto';
  const readonly = memo.creator !== user?.name && !isSuperUser(user);
  const isInMemoDetailPage = location.pathname.startsWith(`/m/${memo.uid}`);

  // Initial related data: creator.
  useAsyncEffect(async () => {
    const user = await userStore.getOrFetchUserByName(memo.creator);
    setCreator(user);
  }, []);

  const handleGotoMemoDetailPage = useCallback(() => {
    navigateTo(`/m/${memo.uid}`);
  }, [memo.uid]);

  const handleMemoContentClick = useCallback(async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.tagName === 'IMG') {
      const imgUrl = targetEl.getAttribute('src');
      if (imgUrl) {
        showPreviewImageDialog([imgUrl], 0);
      }
    }
  }, []);

  const handleMemoContentDoubleClick = useCallback(
    async (e: React.MouseEvent) => {
      if (readonly) {
        return;
      }

      if (workspaceMemoRelatedSetting.enableDoubleClickEdit) {
        e.preventDefault();
        setShowEditor(true);
      }
    },
    []
  );

  const onPinIconClick = async () => {
    try {
      if (memo.pinned) {
        await memoStore.updateMemo(
          {
            name: memo.name,
            pinned: false,
          },
          ['pinned']
        );
      }
    } catch (_error) {
      // do nth
    }
  };

  const displayTime =
    props.displayTimeFormat === 'time' ? (
      memo.displayTime?.toLocaleTimeString()
    ) : (
      <relative-time
        datetime={memo.displayTime?.toISOString()}
        format={relativeTimeFormat}
      />
    );

  const handleHiddenActions = () => {
    const hiddenActions: (
      | 'edit'
      | 'archive'
      | 'delete'
      | 'share'
      | 'pin'
      | 'remove_completed_task_list'
    )[] = [];
    if (!props.showPinned) {
      hiddenActions.push('pin');
    }
    // check if the content has done tasks
    let hasCompletedTaskList = false;
    const newNodes = JSON.parse(JSON.stringify(memo.nodes));
    for (let i = 0; i < newNodes.length; i++) {
      if (hasCompletedTaskList) {
        break;
      }
      if (
        newNodes[i].type === NodeType.LIST &&
        newNodes[i].listNode?.children?.length > 0
      ) {
        for (let j = 0; j < newNodes[i].listNode.children.length; j++) {
          if (
            newNodes[i].listNode.children[j].type === NodeType.TASK_LIST_ITEM &&
            newNodes[i].listNode.children[j].taskListItemNode?.complete
          ) {
            hasCompletedTaskList = true;
            break;
          }
        }
      }
    }
    if (!hasCompletedTaskList) {
      hiddenActions.push('remove_completed_task_list');
    }
    return hiddenActions;
  };

  return (
    <div
      className={clsx(
        'group relative mb-2 flex w-full flex-col items-start justify-start gap-2 rounded-lg border border-white bg-white px-4 py-3 hover:border-gray-200 dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700',
        props.showPinned &&
          memo.pinned &&
          'border border-gray-200 dark:border-zinc-700',
        className
      )}
      ref={memoContainerRef}
    >
      {showEditor ? (
        <MemoEditor
          autoFocus
          className="!p-0 -mb-2 border-none"
          cacheKey={`inline-memo-editor-${memo.name}`}
          memoName={memo.name}
          onConfirm={() => setShowEditor(false)}
          onCancel={() => setShowEditor(false)}
        />
      ) : (
        <>
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <div className="flex w-auto max-w-[calc(100%-8rem)] grow flex-row items-center justify-start">
              {props.showCreator && creator ? (
                <div className="flex w-full flex-row items-center justify-start">
                  <Link
                    className="w-auto hover:opacity-80"
                    to={`/u/${encodeURIComponent(creator.username)}`}
                    viewTransition
                  >
                    <UserAvatar
                      className="mr-2 shrink-0"
                      avatarUrl={creator.avatarUrl}
                    />
                  </Link>
                  <div className="flex w-full flex-col items-start justify-center">
                    <div className="flex">
                      <Link
                        className="block w-full truncate text-gray-600 leading-tight hover:opacity-80 dark:text-gray-400"
                        to={`/u/${encodeURIComponent(creator.username)}`}
                        viewTransition
                      >
                        {creator.nickname || creator.username}
                      </Link>
                      {memo.visibility !== Visibility.PUBLIC && (
                        <VisibilityIcon
                          visibility={memo.visibility}
                          className="ml-1 h-auto w-4 text-gray-600 dark:text-gray-400"
                        />
                      )}
                    </div>
                    <div
                      className="-mt-0.5 w-auto select-none text-gray-400 text-xs leading-tight dark:text-gray-500"
                      onClick={handleGotoMemoDetailPage}
                    >
                      {displayTime}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex w-full select-none text-gray-400 text-sm leading-tight dark:text-gray-500"
                  onClick={handleGotoMemoDetailPage}
                >
                  {displayTime}
                  {props.showVisibility &&
                    memo.visibility !== Visibility.PUBLIC && (
                      <VisibilityIcon
                        className="ml-2 h-auto w-3 text-gray-400 dark:text-gray-500"
                        visibility={memo.visibility}
                      />
                    )}
                </div>
              )}
            </div>
            <div className="flex shrink-0 select-none flex-row items-center justify-end gap-2">
              <div className="invisible flex w-auto flex-row items-center justify-between gap-2 group-hover:visible">
                {currentUser && (
                  <ReactionSelector
                    className="h-auto w-auto border-none"
                    memo={memo}
                  />
                )}
              </div>
              {!isInMemoDetailPage &&
                (workspaceMemoRelatedSetting.enableComment ||
                  commentAmount > 0) && (
                  <Link
                    className={clsx(
                      'flex flex-row items-center justify-start hover:opacity-70',
                      commentAmount === 0 && 'invisible group-hover:visible'
                    )}
                    to={`/m/${memo.uid}#comments`}
                    viewTransition
                  >
                    <MessageCircleMoreIcon className="mx-auto h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {commentAmount > 0 && (
                      <span className="text-gray-500 text-xs dark:text-gray-400">
                        {commentAmount}
                      </span>
                    )}
                  </Link>
                )}
              {props.showPinned && memo.pinned && (
                <Tooltip title={t('common.unpin')} placement="top">
                  <span className="cursor-pointer">
                    <BookmarkIcon
                      className="h-auto w-4 text-amber-500"
                      onClick={onPinIconClick}
                    />
                  </span>
                </Tooltip>
              )}
              {!readonly && (
                <MemoActionMenu
                  className="-ml-1"
                  memo={memo}
                  hiddenActions={handleHiddenActions()}
                  onEdit={() => setShowEditor(true)}
                />
              )}
            </div>
          </div>
          <MemoContent
            key={`${memo.name}-${memo.updateTime}`}
            memoName={memo.name}
            nodes={memo.nodes}
            readonly={readonly}
            onClick={handleMemoContentClick}
            onDoubleClick={handleMemoContentDoubleClick}
            compact={
              props.compact && workspaceMemoRelatedSetting.enableAutoCompact
            }
          />
          {memo.location && <MemoLocationView location={memo.location} />}
          <MemoResourceListView resources={memo.resources} />
          <MemoRelationListView memo={memo} relations={referencedMemos} />
          <MemoReactionistView memo={memo} reactions={memo.reactions} />
        </>
      )}
    </div>
  );
};

export default memo(MemoView);

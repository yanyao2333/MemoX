import { activityServiceClient } from '@/grpcweb';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import useNavigateTo from '@/hooks/useNavigateTo';
import {
  activityNamePrefix,
  memoNamePrefix,
  useInboxStore,
  useMemoStore,
  useUserStore,
} from '@/store/v1';
import { type Inbox, Inbox_Status } from '@/types/proto/api/v1/inbox_service';
import type { Memo } from '@/types/proto/api/v1/memo_service';
import type { User } from '@/types/proto/api/v1/user_service';
import { useTranslate } from '@/utils/i18n';
import { Tooltip } from '@mui/joy';
import clsx from 'clsx';
import { InboxIcon, LoaderIcon, MessageCircleIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  inbox: Inbox;
}

const MemoCommentMessage = ({ inbox }: Props) => {
  const t = useTranslate();
  const navigateTo = useNavigateTo();
  const inboxStore = useInboxStore();
  const memoStore = useMemoStore();
  const userStore = useUserStore();
  const [relatedMemo, setRelatedMemo] = useState<Memo | undefined>(undefined);
  const [sender, setSender] = useState<User | undefined>(undefined);
  const [initialized, setInitialized] = useState<boolean>(false);

  useAsyncEffect(async () => {
    if (!inbox.activityId) {
      return;
    }

    const activity = await activityServiceClient.getActivity({
      name: `${activityNamePrefix}${inbox.activityId}`,
    });
    if (activity.payload?.memoComment) {
      const memoCommentPayload = activity.payload.memoComment;
      const relatedMemoId = memoCommentPayload.relatedMemoId;
      const memo = await memoStore.getOrFetchMemoByName(
        `${memoNamePrefix}${relatedMemoId}`,
        {
          skipStore: true,
        }
      );
      setRelatedMemo(memo);
      const sender = await userStore.getOrFetchUserByName(inbox.sender);
      setSender(sender);
      setInitialized(true);
    }
  }, [inbox.activityId]);

  const handleNavigateToMemo = async () => {
    if (!relatedMemo) {
      return;
    }

    navigateTo(`/m/${relatedMemo.uid}`);
    if (inbox.status === Inbox_Status.UNREAD) {
      handleArchiveMessage(true);
    }
  };

  const handleArchiveMessage = async (silence = false) => {
    await inboxStore.updateInbox(
      {
        name: inbox.name,
        status: Inbox_Status.ARCHIVED,
      },
      ['status']
    );
    if (!silence) {
      toast.success(t('message.archived-successfully'));
    }
  };

  return (
    <div className="flex w-full flex-row items-start justify-start gap-3">
      <div
        className={clsx(
          'mt-2 shrink-0 rounded-full border p-2',
          inbox.status === Inbox_Status.UNREAD
            ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-zinc-800'
            : 'border-gray-500 bg-gray-50 text-gray-500 dark:bg-zinc-800'
        )}
      >
        <Tooltip title={'Comment'} placement="bottom">
          <MessageCircleIcon className="h-auto w-4 sm:w-5" />
        </Tooltip>
      </div>
      <div
        className={clsx(
          'flex w-full flex-col items-start justify-start gap-1 rounded-lg border p-2 px-3 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-700',
          inbox.status !== Inbox_Status.UNREAD && 'opacity-60'
        )}
      >
        {initialized ? (
          <>
            <div className="flex w-full flex-row items-center justify-between">
              <span className="text-gray-500 text-sm">
                {inbox.createTime?.toLocaleString()}
              </span>
              <div>
                {inbox.status === Inbox_Status.UNREAD && (
                  <Tooltip title={t('common.archive')} placement="top">
                    <InboxIcon
                      className="h-auto w-4 cursor-pointer text-gray-400 hover:text-blue-600"
                      onClick={() => handleArchiveMessage()}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
            <p
              className="cursor-pointer text-base text-gray-500 leading-tight hover:text-blue-600 hover:underline dark:text-gray-400"
              onClick={handleNavigateToMemo}
            >
              {t('inbox.memo-comment', {
                user: sender?.nickname || sender?.username,
                memo: `memos/${relatedMemo?.uid}`,
                interpolation: { escapeValue: false },
              })}
            </p>
          </>
        ) : (
          <div className="my-2 flex w-full flex-row items-center justify-center">
            <LoaderIcon className="animate-spin text-zinc-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoCommentMessage;

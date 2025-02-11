import { activityServiceClient } from '@/grpcweb';
import { activityNamePrefix, useInboxStore } from '@/store/v1';
import type { Activity } from '@/types/proto/api/v1/activity_service';
import { type Inbox, Inbox_Status } from '@/types/proto/api/v1/inbox_service';
import { useTranslate } from '@/utils/i18n';
import { Tooltip } from '@mui/joy';
import clsx from 'clsx';
import { ArrowUpIcon, InboxIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  inbox: Inbox;
}

const VersionUpdateMessage = ({ inbox }: Props) => {
  const t = useTranslate();
  const inboxStore = useInboxStore();
  const [activity, setActivity] = useState<Activity | undefined>(undefined);

  useEffect(() => {
    if (!inbox.activityId) {
      return;
    }

    (async () => {
      const activity = await activityServiceClient.getActivity({
        name: `${activityNamePrefix}${inbox.activityId}`,
      });
      setActivity(activity);
    })();
  }, [inbox.activityId]);

  const handleNavigate = () => {
    if (!activity?.payload?.versionUpdate?.version) {
      return;
    }

    window.open(
      `https://github.com/usememos/memos/releases/tag/v${activity?.payload?.versionUpdate?.version}`
    );
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
        <Tooltip title={'Update'} placement="bottom">
          <ArrowUpIcon className="h-auto w-4 sm:w-5" />
        </Tooltip>
      </div>
      <div
        className={clsx(
          'flex w-full flex-col items-start justify-start gap-1 rounded-lg border p-2 px-3 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-700',
          inbox.status !== Inbox_Status.UNREAD && 'opacity-60'
        )}
      >
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
          onClick={handleNavigate}
        >
          {t('inbox.version-update', {
            version: activity?.payload?.versionUpdate?.version,
          })}
        </p>
      </div>
    </div>
  );
};

export default VersionUpdateMessage;

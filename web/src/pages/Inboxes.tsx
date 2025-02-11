import Empty from '@/components/Empty';
import MemoCommentMessage from '@/components/Inbox/MemoCommentMessage';
import VersionUpdateMessage from '@/components/Inbox/VersionUpdateMessage';
import MobileHeader from '@/components/MobileHeader';
import { useInboxStore } from '@/store/v1';
import { Inbox_Status, Inbox_Type } from '@/types/proto/api/v1/inbox_service';
import { useTranslate } from '@/utils/i18n';
import { BellIcon } from 'lucide-react';
import { useEffect } from 'react';

const Inboxes = () => {
  const t = useTranslate();
  const inboxStore = useInboxStore();
  const inboxes = inboxStore.inboxes.sort((a, b) => {
    if (a.status === b.status) {
      return 0;
    }
    return a.status === Inbox_Status.UNREAD ? -1 : 1;
  });

  useEffect(() => {
    inboxStore.fetchInboxes();
  }, []);

  return (
    <section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
      <MobileHeader />
      <div className="w-full px-4 sm:px-6">
        <div className="flex w-full flex-col items-start justify-start rounded-xl bg-white px-4 py-3 text-black shadow dark:bg-zinc-800 dark:text-gray-300">
          <div className="relative flex w-full flex-row items-center justify-between">
            <p className="flex select-none flex-row items-center justify-start py-1 opacity-80">
              <BellIcon className="mr-1 h-auto w-6 opacity-80" />
              <span className="text-lg">{t('common.inbox')}</span>
            </p>
          </div>
          <div className="flex h-auto w-full flex-col items-start justify-start px-2 pb-4">
            {inboxes.length === 0 && (
              <div className="mt-4 mb-8 flex w-full flex-col items-center justify-center italic">
                <Empty />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {t('message.no-data')}
                </p>
              </div>
            )}
            <div className="mt-4 flex w-full flex-col items-start justify-start gap-4">
              {inboxes.map((inbox) => {
                if (inbox.type === Inbox_Type.MEMO_COMMENT) {
                  return (
                    <MemoCommentMessage
                      key={`${inbox.name}-${inbox.status}`}
                      inbox={inbox}
                    />
                  );
                }
                if (inbox.type === Inbox_Type.VERSION_UPDATE) {
                  return (
                    <VersionUpdateMessage
                      key={`${inbox.name}-${inbox.status}`}
                      inbox={inbox}
                    />
                  );
                }
                return undefined;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inboxes;

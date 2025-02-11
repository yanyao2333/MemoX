import { webhookServiceClient } from '@/grpcweb';
import useCurrentUser from '@/hooks/useCurrentUser';
import type { Webhook } from '@/types/proto/api/v1/webhook_service';
import { useTranslate } from '@/utils/i18n';
import { Button } from '@usememos/mui';
import { ExternalLinkIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import showCreateWebhookDialog from '../CreateWebhookDialog';

const listWebhooks = async (userId: number) => {
  const { webhooks } = await webhookServiceClient.listWebhooks({
    creatorId: userId,
  });
  return webhooks;
};

const WebhookSection = () => {
  const t = useTranslate();
  const currentUser = useCurrentUser();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  useEffect(() => {
    listWebhooks(currentUser.id).then((webhooks) => {
      setWebhooks(webhooks);
    });
  }, []);

  const handleCreateAccessTokenDialogConfirm = async () => {
    const webhooks = await listWebhooks(currentUser.id);
    setWebhooks(webhooks);
  };

  const handleDeleteWebhook = async (webhook: Webhook) => {
    const confirmed = window.confirm(
      `Are you sure to delete webhook \`${webhook.name}\`? You cannot undo this action.`
    );
    if (confirmed) {
      await webhookServiceClient.deleteWebhook({ id: webhook.id });
      setWebhooks(webhooks.filter((item) => item.id !== webhook.id));
    }
  };

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <div className="flex w-full items-center justify-between">
        <div className="flex-auto space-y-1">
          <p className="flex flex-row items-center justify-start font-medium text-gray-700 dark:text-gray-400">
            {t('setting.webhook-section.title')}
          </p>
        </div>
        <div>
          <Button
            color="primary"
            onClick={() => {
              showCreateWebhookDialog(handleCreateAccessTokenDialogConfirm);
            }}
          >
            {t('common.create')}
          </Button>
        </div>
      </div>
      <div className="mt-2 flow-root w-full">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full rounded-lg border align-middle dark:border-zinc-600">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-zinc-600">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left font-semibold text-gray-900 text-sm dark:text-gray-400"
                  >
                    {t('common.name')}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left font-semibold text-gray-900 text-sm dark:text-gray-400"
                  >
                    {t('setting.webhook-section.url')}
                  </th>
                  <th scope="col" className="relative px-3 py-2 pr-4">
                    <span className="sr-only">{t('common.delete')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-500">
                {webhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-900 text-sm dark:text-gray-400">
                      {webhook.name}
                    </td>
                    <td
                      className="max-w-[200px] truncate px-3 py-2 text-gray-900 text-sm dark:text-gray-400"
                      title={webhook.url}
                    >
                      {webhook.url}
                    </td>
                    <td className="relative whitespace-nowrap px-3 py-2 text-right text-sm">
                      <Button
                        variant="plain"
                        size="sm"
                        onClick={() => {
                          handleDeleteWebhook(webhook);
                        }}
                      >
                        <TrashIcon className="h-auto w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}

                {webhooks.length === 0 && (
                  <tr>
                    <td
                      className="whitespace-nowrap px-3 py-2 text-gray-900 text-sm dark:text-gray-400"
                      colSpan={3}
                    >
                      {t('setting.webhook-section.no-webhooks-found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-2 w-full">
        <Link
          className="inline-flex flex-row items-center justify-start text-gray-500 text-sm hover:text-blue-600 hover:underline"
          to="https://usememos.com/docs/advanced-settings/webhook"
          target="_blank"
        >
          {t('common.learn-more')}
          <ExternalLinkIcon className="ml-1 inline h-auto w-4" />
        </Link>
      </div>
    </div>
  );
};

export default WebhookSection;

import { userServiceClient } from '@/grpcweb';
import useCurrentUser from '@/hooks/useCurrentUser';
import type { UserAccessToken } from '@/types/proto/api/v1/user_service';
import { useTranslate } from '@/utils/i18n';
import { Button } from '@usememos/mui';
import copy from 'copy-to-clipboard';
import { ClipboardIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import showCreateAccessTokenDialog from '../CreateAccessTokenDialog';
import LearnMore from '../LearnMore';

const listAccessTokens = async (name: string) => {
  const { accessTokens } = await userServiceClient.listUserAccessTokens({
    name,
  });
  return accessTokens.sort(
    (a, b) => (b.issuedAt?.getTime() ?? 0) - (a.issuedAt?.getTime() ?? 0)
  );
};

const AccessTokenSection = () => {
  const t = useTranslate();
  const currentUser = useCurrentUser();
  const [userAccessTokens, setUserAccessTokens] = useState<UserAccessToken[]>(
    []
  );

  useEffect(() => {
    listAccessTokens(currentUser.name).then((accessTokens) => {
      setUserAccessTokens(accessTokens);
    });
  }, []);

  const handleCreateAccessTokenDialogConfirm = async () => {
    const accessTokens = await listAccessTokens(currentUser.name);
    setUserAccessTokens(accessTokens);
  };

  const copyAccessToken = (accessToken: string) => {
    copy(accessToken);
    toast.success('Access token copied to clipboard');
  };

  const handleDeleteAccessToken = async (accessToken: string) => {
    const confirmed = window.confirm(
      `Are you sure to delete access token \`${getFormatedAccessToken(accessToken)}\`? You cannot undo this action.`
    );
    if (confirmed) {
      await userServiceClient.deleteUserAccessToken({
        name: currentUser.name,
        accessToken: accessToken,
      });
      setUserAccessTokens(
        userAccessTokens.filter((token) => token.accessToken !== accessToken)
      );
    }
  };

  const getFormatedAccessToken = (accessToken: string) => {
    return `${accessToken.slice(0, 4)}****${accessToken.slice(-4)}`;
  };

  return (
    <div className="mt-6 flex w-full flex-col items-start justify-start space-y-4">
      <div className="w-full">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1 sm:flex-auto">
            <p className="flex flex-row items-center justify-start font-medium text-gray-700 dark:text-gray-400">
              {t('setting.access-token-section.title')}
              <LearnMore
                className="ml-2"
                url="https://usememos.com/docs/security/access-tokens"
              />
            </p>
            <p className="text-gray-700 text-sm dark:text-gray-500">
              {t('setting.access-token-section.description')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              color="primary"
              onClick={() => {
                showCreateAccessTokenDialog(
                  handleCreateAccessTokenDialogConfirm
                );
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
                      {t('setting.access-token-section.token')}
                    </th>
                    <th
                      scope="col"
                      className="py-2 pr-3 pl-4 text-left font-semibold text-gray-900 text-sm dark:text-gray-400"
                    >
                      {t('common.description')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left font-semibold text-gray-900 text-sm dark:text-gray-400"
                    >
                      {t('setting.access-token-section.created-at')}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-left font-semibold text-gray-900 text-sm dark:text-gray-400"
                    >
                      {t('setting.access-token-section.expires-at')}
                    </th>
                    <th scope="col" className="relative py-3.5 pr-4 pl-3">
                      <span className="sr-only">{t('common.delete')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                  {userAccessTokens.map((userAccessToken) => (
                    <tr key={userAccessToken.accessToken}>
                      <td className="flex flex-row items-center justify-start gap-x-1 whitespace-nowrap px-3 py-2 text-gray-900 text-sm dark:text-gray-400">
                        <span className="font-mono">
                          {getFormatedAccessToken(userAccessToken.accessToken)}
                        </span>
                        <Button
                          variant="plain"
                          size="sm"
                          onClick={() =>
                            copyAccessToken(userAccessToken.accessToken)
                          }
                        >
                          <ClipboardIcon className="h-auto w-4 text-gray-400" />
                        </Button>
                      </td>
                      <td className="whitespace-nowrap py-2 pr-3 pl-4 text-gray-900 text-sm dark:text-gray-400">
                        {userAccessToken.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-gray-500 text-sm dark:text-gray-400">
                        {userAccessToken.issuedAt?.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-gray-500 text-sm dark:text-gray-400">
                        {userAccessToken.expiresAt?.toLocaleString() ?? 'Never'}
                      </td>
                      <td className="relative whitespace-nowrap py-2 pr-4 pl-3 text-right text-sm">
                        <Button
                          variant="plain"
                          size="sm"
                          onClick={() => {
                            handleDeleteAccessToken(
                              userAccessToken.accessToken
                            );
                          }}
                        >
                          <TrashIcon className="h-auto w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessTokenSection;

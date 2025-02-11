import { identityProviderServiceClient } from '@/grpcweb';
import type { IdentityProvider } from '@/types/proto/api/v1/idp_service';
import { useTranslate } from '@/utils/i18n';
import {
  Divider,
  Dropdown,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
} from '@mui/joy';
import { Button } from '@usememos/mui';
import { MoreVerticalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import showCreateIdentityProviderDialog from '../CreateIdentityProviderDialog';
import LearnMore from '../LearnMore';

const SSOSection = () => {
  const t = useTranslate();
  const [identityProviderList, setIdentityProviderList] = useState<
    IdentityProvider[]
  >([]);

  useEffect(() => {
    fetchIdentityProviderList();
  }, []);

  const fetchIdentityProviderList = async () => {
    const { identityProviders } =
      await identityProviderServiceClient.listIdentityProviders({});
    setIdentityProviderList(identityProviders);
  };

  const handleDeleteIdentityProvider = async (
    identityProvider: IdentityProvider
  ) => {
    const confirmed = window.confirm(
      t('setting.sso-section.confirm-delete', { name: identityProvider.title })
    );
    if (confirmed) {
      try {
        await identityProviderServiceClient.deleteIdentityProvider({
          name: identityProvider.name,
        });
      } catch (error: any) {
        toast.error(error.details);
      }
      await fetchIdentityProviderList();
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 pt-2 pb-4">
      <div className="flex w-full flex-row items-center justify-between gap-1">
        <div className="flex flex-row items-center gap-1">
          <span className="font-mono text-gray-400">
            {t('setting.sso-section.sso-list')}
          </span>
          <LearnMore url="https://usememos.com/docs/advanced-settings/keycloak" />
        </div>
        <Button
          color="primary"
          onClick={() =>
            showCreateIdentityProviderDialog(
              undefined,
              fetchIdentityProviderList
            )
          }
        >
          {t('common.create')}
        </Button>
      </div>
      <Divider />
      {identityProviderList.map((identityProvider) => (
        <div
          key={identityProvider.name}
          className="flex w-full flex-row items-center justify-between border-b py-2 last:border-b dark:border-zinc-700"
        >
          <div className="flex flex-row items-center">
            <p className="ml-2">
              {identityProvider.title}
              <span className="ml-1 text-sm opacity-40">
                ({identityProvider.type})
              </span>
            </p>
          </div>
          <div className="flex flex-row items-center">
            <Dropdown>
              <MenuButton size="sm">
                <MoreVerticalIcon className="h-auto w-4" />
              </MenuButton>
              <Menu placement="bottom-end" size="sm">
                <MenuItem
                  onClick={() =>
                    showCreateIdentityProviderDialog(
                      identityProvider,
                      fetchIdentityProviderList
                    )
                  }
                >
                  {t('common.edit')}
                </MenuItem>
                <MenuItem
                  onClick={() => handleDeleteIdentityProvider(identityProvider)}
                >
                  {t('common.delete')}
                </MenuItem>
              </Menu>
            </Dropdown>
          </div>
        </div>
      ))}
      {identityProviderList.length === 0 && (
        <div className="mt-2 flex w-full flex-row items-center justify-between text-sm opacity-60 dark:border-zinc-700">
          <p className="">{t('setting.sso-section.no-sso-found')}</p>
        </div>
      )}

      <div className="mt-4 w-full">
        <p className="text-sm">{t('common.learn-more')}:</p>
        <List component="ul" marker="disc" size="sm">
          <ListItem>
            <Link
              className="text-blue-600 text-sm hover:underline"
              to="https://www.usememos.com/docs/advanced-settings/keycloak"
              target="_blank"
            >
              {t('setting.sso-section.configuring-keycloak-for-authentication')}
            </Link>
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default SSOSection;

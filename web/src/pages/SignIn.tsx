import AppearanceSelect from '@/components/AppearanceSelect';
import LocaleSelect from '@/components/LocaleSelect';
import PasswordSignInForm from '@/components/PasswordSignInForm';
import { identityProviderServiceClient } from '@/grpcweb';
import { absolutifyLink } from '@/helpers/utils';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useCommonContext } from '@/layouts/CommonContextProvider';
import { Routes } from '@/router';
import {
  extractIdentityProviderIdFromName,
  useWorkspaceSettingStore,
} from '@/store/v1';
import {
  type IdentityProvider,
  IdentityProvider_Type,
} from '@/types/proto/api/v1/idp_service';
import { WorkspaceGeneralSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import { Divider } from '@mui/joy';
import { Button } from '@usememos/mui';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const t = useTranslate();
  const currentUser = useCurrentUser();
  const commonContext = useCommonContext();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const [identityProviderList, setIdentityProviderList] = useState<
    IdentityProvider[]
  >([]);
  const workspaceGeneralSetting =
    workspaceSettingStore.getWorkspaceSettingByKey(WorkspaceSettingKey.GENERAL)
      .generalSetting || WorkspaceGeneralSetting.fromPartial({});

  // Redirect to root page if already signed in.
  useEffect(() => {
    if (currentUser) {
      window.location.href = Routes.ROOT;
    }
  }, []);

  // Prepare identity provider list.
  useEffect(() => {
    const fetchIdentityProviderList = async () => {
      const { identityProviders } =
        await identityProviderServiceClient.listIdentityProviders({});
      setIdentityProviderList(identityProviders);
    };
    fetchIdentityProviderList();
  }, []);

  const handleLocaleSelectChange = (locale: Locale) => {
    commonContext.setLocale(locale);
  };

  const handleAppearanceSelectChange = (appearance: Appearance) => {
    commonContext.setAppearance(appearance);
  };

  const handleSignInWithIdentityProvider = async (
    identityProvider: IdentityProvider
  ) => {
    const stateQueryParameter = `auth.signin.${identityProvider.title}-${extractIdentityProviderIdFromName(identityProvider.name)}`;
    if (identityProvider.type === IdentityProvider_Type.OAUTH2) {
      const redirectUri = absolutifyLink('/auth/callback');
      const oauth2Config = identityProvider.config?.oauth2Config;
      if (!oauth2Config) {
        toast.error('Identity provider configuration is invalid.');
        return;
      }
      const authUrl = `${oauth2Config.authUrl}?client_id=${
        oauth2Config.clientId
      }&redirect_uri=${redirectUri}&state=${stateQueryParameter}&response_type=code&scope=${encodeURIComponent(
        oauth2Config.scopes.join(' ')
      )}`;
      window.location.href = authUrl;
    }
  };

  return (
    <div className="mx-auto flex min-h-[100svh] w-80 max-w-full flex-col items-center justify-start py-4 sm:py-8">
      <div className="flex w-full grow flex-col items-center justify-center py-4">
        <div className="mb-6 flex w-full flex-row items-center justify-center">
          <img
            className="h-14 w-auto rounded-full shadow"
            src={workspaceGeneralSetting.customProfile?.logoUrl || '/logo.webp'}
            alt=""
          />
          <p className="ml-2 text-5xl text-black opacity-80 dark:text-gray-200">
            {workspaceGeneralSetting.customProfile?.title || 'Memos'}
          </p>
        </div>
        {workspaceGeneralSetting.disallowPasswordAuth ? (
          <p className="mt-2 w-full text-2xl dark:text-gray-500">
            Password auth is not allowed.
          </p>
        ) : (
          <PasswordSignInForm />
        )}
        {!workspaceGeneralSetting.disallowUserRegistration &&
          !workspaceGeneralSetting.disallowPasswordAuth && (
            <p className="mt-4 w-full text-sm">
              <span className="dark:text-gray-500">
                {t('auth.sign-up-tip')}
              </span>
              <Link
                to="/auth/signup"
                className="ml-2 cursor-pointer text-blue-600 hover:underline"
                viewTransition
              >
                {t('common.sign-up')}
              </Link>
            </p>
          )}
        {identityProviderList.length > 0 && (
          <>
            <Divider className="!my-4">{t('common.or')}</Divider>
            <div className="flex w-full flex-col space-y-2">
              {identityProviderList.map((identityProvider) => (
                <Button
                  className="bg-white dark:bg-black"
                  key={identityProvider.name}
                  variant="outlined"
                  fullWidth
                  onClick={() =>
                    handleSignInWithIdentityProvider(identityProvider)
                  }
                >
                  {t('common.sign-in-with', {
                    provider: identityProvider.title,
                  })}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-4 flex w-full flex-row items-center justify-center gap-2">
        <LocaleSelect
          value={commonContext.locale}
          onChange={handleLocaleSelectChange}
        />
        <AppearanceSelect
          value={commonContext.appearance as Appearance}
          onChange={handleAppearanceSelectChange}
        />
      </div>
    </div>
  );
};

export default SignIn;

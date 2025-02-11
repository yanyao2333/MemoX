import AppearanceSelect from '@/components/AppearanceSelect';
import LocaleSelect from '@/components/LocaleSelect';
import { authServiceClient } from '@/grpcweb';
import useLoading from '@/hooks/useLoading';
import useNavigateTo from '@/hooks/useNavigateTo';
import { useCommonContext } from '@/layouts/CommonContextProvider';
import { useUserStore, useWorkspaceSettingStore } from '@/store/v1';
import { WorkspaceGeneralSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import { Button, Input } from '@usememos/mui';
import { LoaderIcon } from 'lucide-react';
import type { ClientError } from 'nice-grpc-web';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const t = useTranslate();
  const navigateTo = useNavigateTo();
  const commonContext = useCommonContext();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const userStore = useUserStore();
  const actionBtnLoadingState = useLoading(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const workspaceGeneralSetting =
    workspaceSettingStore.getWorkspaceSettingByKey(WorkspaceSettingKey.GENERAL)
      .generalSetting || WorkspaceGeneralSetting.fromPartial({});

  const handleUsernameInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value as string;
    setUsername(text);
  };

  const handlePasswordInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value as string;
    setPassword(text);
  };

  const handleLocaleSelectChange = (locale: Locale) => {
    commonContext.setLocale(locale);
  };

  const handleAppearanceSelectChange = (appearance: Appearance) => {
    commonContext.setAppearance(appearance);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignUpButtonClick();
  };

  const handleSignUpButtonClick = async () => {
    if (username === '' || password === '') {
      return;
    }

    if (actionBtnLoadingState.isLoading) {
      return;
    }

    try {
      actionBtnLoadingState.setLoading();
      await authServiceClient.signUp({ username, password });
      await userStore.fetchCurrentUser();
      navigateTo('/');
    } catch (error: any) {
      toast.error((error as ClientError).details || 'Sign up failed');
    }
    actionBtnLoadingState.setFinish();
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
        {workspaceGeneralSetting.disallowUserRegistration ? (
          <p className="mt-2 w-full text-2xl dark:text-gray-500">
            Sign up is not allowed.
          </p>
        ) : (
          <>
            <p className="mt-2 w-full text-2xl dark:text-gray-500">
              {t('auth.create-your-account')}
            </p>
            <form className="mt-2 w-full" onSubmit={handleFormSubmit}>
              <div className="flex w-full flex-col items-start justify-start gap-4">
                <div className="flex w-full flex-col items-start justify-start">
                  <span className="text-gray-600 leading-8">
                    {t('common.username')}
                  </span>
                  <Input
                    className="w-full bg-white dark:bg-black"
                    size="lg"
                    type="text"
                    readOnly={actionBtnLoadingState.isLoading}
                    placeholder={t('common.username')}
                    value={username}
                    autoComplete="username"
                    autoCapitalize="off"
                    spellCheck={false}
                    onChange={handleUsernameInputChanged}
                    required
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-start">
                  <span className="text-gray-600 leading-8">
                    {t('common.password')}
                  </span>
                  <Input
                    className="w-full bg-white dark:bg-black"
                    size="lg"
                    type="password"
                    readOnly={actionBtnLoadingState.isLoading}
                    placeholder={t('common.password')}
                    value={password}
                    autoComplete="password"
                    autoCapitalize="off"
                    spellCheck={false}
                    onChange={handlePasswordInputChanged}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex w-full flex-row items-center justify-end">
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  fullWidth
                  disabled={actionBtnLoadingState.isLoading}
                  onClick={handleSignUpButtonClick}
                >
                  {t('common.sign-up')}
                  {actionBtnLoadingState.isLoading && (
                    <LoaderIcon className="ml-2 h-auto w-5 animate-spin opacity-60" />
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
        {commonContext.profile.owner ? (
          <p className="mt-4 w-full text-sm">
            <span className="dark:text-gray-500">{t('auth.sign-in-tip')}</span>
            <Link
              to="/auth"
              className="ml-2 cursor-pointer text-blue-600 hover:underline"
              viewTransition
            >
              {t('common.sign-in')}
            </Link>
          </p>
        ) : (
          <p className="mt-4 w-full font-medium text-sm dark:text-gray-500">
            {t('auth.host-tip')}
          </p>
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

export default SignUp;

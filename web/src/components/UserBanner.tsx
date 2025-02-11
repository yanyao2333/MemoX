import { authServiceClient } from '@/grpcweb';
import useCurrentUser from '@/hooks/useCurrentUser';
import useNavigateTo from '@/hooks/useNavigateTo';
import { Routes } from '@/router';
import { useWorkspaceSettingStore } from '@/store/v1';
import { WorkspaceGeneralSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import clsx from 'clsx';
import { LogOutIcon, SmileIcon } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface Props {
  collapsed?: boolean;
}

const UserBanner = (props: Props) => {
  const { collapsed } = props;
  const t = useTranslate();
  const navigateTo = useNavigateTo();
  const user = useCurrentUser();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const workspaceGeneralSetting =
    workspaceSettingStore.getWorkspaceSettingByKey(WorkspaceSettingKey.GENERAL)
      .generalSetting || WorkspaceGeneralSetting.fromPartial({});
  const title =
    (user
      ? user.nickname || user.username
      : workspaceGeneralSetting.customProfile?.title) || 'Memos';
  const avatarUrl =
    (user ? user.avatarUrl : workspaceGeneralSetting.customProfile?.logoUrl) ||
    '/full-logo.webp';

  const handleSignOut = async () => {
    await authServiceClient.signOut({});
    window.location.href = '/auth';
  };

  return (
    <div className="relative h-auto w-full shrink-0 px-1">
      <Dropdown>
        <MenuButton disabled={!user} slots={{ root: 'div' }}>
          <div
            className={clsx(
              'my-1 flex w-auto cursor-pointer flex-row items-center justify-start py-1 text-gray-800 dark:text-gray-400',
              collapsed ? 'px-1' : 'px-3'
            )}
          >
            <UserAvatar className="shrink-0" avatarUrl={avatarUrl} />
            {!collapsed && (
              <span className="ml-2 shrink truncate font-medium text-lg text-slate-800 dark:text-gray-300">
                {title}
              </span>
            )}
          </div>
        </MenuButton>
        <Menu placement="bottom-start" style={{ zIndex: '9999' }}>
          <MenuItem onClick={handleSignOut}>
            <LogOutIcon className="h-auto w-4 opacity-60" />
            <span className="truncate">{t('common.sign-out')}</span>
          </MenuItem>
          <MenuItem onClick={() => navigateTo(Routes.ABOUT)}>
            <SmileIcon className="h-auto w-4 opacity-60" />
            <span className="truncate">{t('common.about')}</span>
          </MenuItem>
        </Menu>
      </Dropdown>
    </div>
  );
};

export default UserBanner;

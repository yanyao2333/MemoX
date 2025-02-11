import useCurrentUser from '@/hooks/useCurrentUser';
import { useTranslate } from '@/utils/i18n';
import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import { Button } from '@usememos/mui';
import { MoreVerticalIcon, PenLineIcon } from 'lucide-react';
import showChangeMemberPasswordDialog from '../ChangeMemberPasswordDialog';
import showUpdateAccountDialog from '../UpdateAccountDialog';
import UserAvatar from '../UserAvatar';
import AccessTokenSection from './AccessTokenSection';

const MyAccountSection = () => {
  const t = useTranslate();
  const user = useCurrentUser();

  return (
    <div className="w-full gap-2 pt-2 pb-4">
      <p className="font-medium text-gray-700 dark:text-gray-500">
        {t('setting.account-section.title')}
      </p>
      <div className="mt-2 flex w-full flex-row items-center justify-start">
        <UserAvatar
          className="mr-2 h-10 w-10 shrink-0"
          avatarUrl={user.avatarUrl}
        />
        <div className="flex max-w-[calc(100%-3rem)] flex-col items-start justify-center">
          <p className="w-full">
            <span className="font-medium text-xl leading-tight">
              {user.nickname}
            </span>
            <span className="ml-1 text-base text-gray-500 leading-tight dark:text-gray-400">
              ({user.username})
            </span>
          </p>
          <p className="w-4/5 truncate text-sm leading-tight">
            {user.description}
          </p>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-row items-center justify-start space-x-2">
        <Button variant="outlined" size="sm" onClick={showUpdateAccountDialog}>
          <PenLineIcon className="mx-auto mr-1 h-4 w-4" />
          {t('common.edit')}
        </Button>
        <Dropdown>
          <MenuButton slots={{ root: 'div' }}>
            <Button variant="outlined" size="sm">
              <MoreVerticalIcon className="mx-auto h-4 w-4" />
            </Button>
          </MenuButton>
          <Menu className="text-sm" size="sm" placement="bottom">
            <MenuItem onClick={() => showChangeMemberPasswordDialog(user)}>
              {t('setting.account-section.change-password')}
            </MenuItem>
          </Menu>
        </Dropdown>
      </div>

      <AccessTokenSection />
    </div>
  );
};

export default MyAccountSection;

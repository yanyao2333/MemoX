import { useUserStore } from '@/store/v1';
import type { User } from '@/types/proto/api/v1/user_service';
import { useTranslate } from '@/utils/i18n';
import { Button, Input } from '@usememos/mui';
import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { generateDialog } from './Dialog';

interface Props extends DialogProps {
  user: User;
}

const ChangeMemberPasswordDialog: React.FC<Props> = (props: Props) => {
  const { user, destroy } = props;
  const t = useTranslate();
  const userStore = useUserStore();
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');

  useEffect(() => {
    // do nth
  }, []);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleNewPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setNewPassword(text);
  };

  const handleNewPasswordAgainChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value as string;
    setNewPasswordAgain(text);
  };

  const handleSaveBtnClick = async () => {
    if (newPassword === '' || newPasswordAgain === '') {
      toast.error(t('message.fill-all'));
      return;
    }

    if (newPassword !== newPasswordAgain) {
      toast.error(t('message.new-password-not-match'));
      setNewPasswordAgain('');
      return;
    }

    try {
      await userStore.updateUser(
        {
          name: user.name,
          password: newPassword,
        },
        ['password']
      );
      toast(t('message.password-changed'));
      handleCloseBtnClick();
    } catch (error: any) {
      toast.error(error.details);
    }
  };

  return (
    <>
      <div className="dialog-header-container !w-64">
        <p className="title-text">
          {t('setting.account-section.change-password')} ({user.nickname})
        </p>
        <Button size="sm" variant="plain" onClick={handleCloseBtnClick}>
          <XIcon className="h-auto w-5" />
        </Button>
      </div>
      <div className="dialog-content-container">
        <p className="mb-1 text-sm">{t('auth.new-password')}</p>
        <Input
          className="w-full"
          type="password"
          placeholder={t('auth.new-password')}
          value={newPassword}
          onChange={handleNewPasswordChanged}
        />
        <p className="mt-2 mb-1 text-sm">{t('auth.repeat-new-password')}</p>
        <Input
          className="w-full"
          type="password"
          placeholder={t('auth.repeat-new-password')}
          value={newPasswordAgain}
          onChange={handleNewPasswordAgainChanged}
        />
        <div className="mt-4 flex w-full flex-row items-center justify-end gap-x-2">
          <Button variant="plain" onClick={handleCloseBtnClick}>
            {t('common.cancel')}
          </Button>
          <Button color="primary" onClick={handleSaveBtnClick}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </>
  );
};

function showChangeMemberPasswordDialog(user: User) {
  generateDialog(
    {
      className: 'change-member-password-dialog',
      dialogName: 'change-member-password-dialog',
    },
    ChangeMemberPasswordDialog,
    { user }
  );
}

export default showChangeMemberPasswordDialog;

import {
  useWorkspaceSettingStore,
  workspaceSettingNamePrefix,
} from '@/store/v1';
import {
  WorkspaceCustomProfile,
  WorkspaceGeneralSetting,
} from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import Textarea from '@mui/joy/Textarea/Textarea';
import { Button, Input } from '@usememos/mui';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import AppearanceSelect from './AppearanceSelect';
import { generateDialog } from './Dialog';
import LocaleSelect from './LocaleSelect';

type Props = DialogProps;

const UpdateCustomizedProfileDialog: React.FC<Props> = ({ destroy }: Props) => {
  const t = useTranslate();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const workspaceGeneralSetting = WorkspaceGeneralSetting.fromPartial(
    workspaceSettingStore.getWorkspaceSettingByKey(WorkspaceSettingKey.GENERAL)
      ?.generalSetting || {}
  );
  const [customProfile, setCustomProfile] = useState<WorkspaceCustomProfile>(
    WorkspaceCustomProfile.fromPartial(
      workspaceGeneralSetting.customProfile || {}
    )
  );

  const handleCloseButtonClick = () => {
    destroy();
  };

  const setPartialState = (partialState: Partial<WorkspaceCustomProfile>) => {
    setCustomProfile((state) => {
      return {
        ...state,
        ...partialState,
      };
    });
  };

  const handleNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartialState({
      title: e.target.value as string,
    });
  };

  const handleLogoUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartialState({
      logoUrl: e.target.value as string,
    });
  };

  const handleDescriptionChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPartialState({
      description: e.target.value as string,
    });
  };

  const handleLocaleSelectChange = (locale: Locale) => {
    setPartialState({
      locale: locale,
    });
  };

  const handleAppearanceSelectChange = (appearance: Appearance) => {
    setPartialState({
      appearance: appearance,
    });
  };

  const handleRestoreButtonClick = () => {
    setPartialState({
      title: 'Memos',
      logoUrl: '/logo.webp',
      description: '',
      locale: 'en',
      appearance: 'system',
    });
  };

  const handleSaveButtonClick = async () => {
    if (customProfile.title === '') {
      toast.error('Title cannot be empty.');
      return;
    }

    try {
      await workspaceSettingStore.setWorkspaceSetting({
        name: `${workspaceSettingNamePrefix}${WorkspaceSettingKey.GENERAL}`,
        generalSetting: {
          ...workspaceGeneralSetting,
          customProfile: customProfile,
        },
      });
    } catch (_error) {
      return;
    }
    toast.success(t('message.update-succeed'));
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          {t('setting.system-section.customize-server.title')}
        </p>
        <Button size="sm" variant="plain" onClick={handleCloseButtonClick}>
          <XIcon className="h-auto w-5" />
        </Button>
      </div>
      <div className="dialog-content-container min-w-[16rem]">
        <p className="mb-1 text-sm">
          {t('setting.system-section.server-name')}
        </p>
        <Input
          className="w-full"
          type="text"
          value={customProfile.title}
          onChange={handleNameChanged}
        />
        <p className="mt-2 mb-1 text-sm">
          {t('setting.system-section.customize-server.icon-url')}
        </p>
        <Input
          className="w-full"
          type="text"
          value={customProfile.logoUrl}
          onChange={handleLogoUrlChanged}
        />
        <p className="mt-2 mb-1 text-sm">
          {t('setting.system-section.customize-server.description')}
        </p>
        <Textarea
          className="w-full"
          minRows="2"
          maxRows="4"
          value={customProfile.description}
          onChange={handleDescriptionChanged}
        />
        <p className="mt-2 mb-1 text-sm">
          {t('setting.system-section.customize-server.locale')}
        </p>
        <LocaleSelect
          className="!w-full"
          value={customProfile.locale}
          onChange={handleLocaleSelectChange}
        />
        <p className="mt-2 mb-1 text-sm">
          {t('setting.system-section.customize-server.appearance')}
        </p>
        <AppearanceSelect
          className="!w-full"
          value={customProfile.appearance as Appearance}
          onChange={handleAppearanceSelectChange}
        />
        <div className="mt-4 flex w-full flex-row items-center justify-between space-x-2">
          <div className="flex flex-row items-center justify-start">
            <Button variant="outlined" onClick={handleRestoreButtonClick}>
              {t('common.restore')}
            </Button>
          </div>
          <div className="flex flex-row items-center justify-end gap-2">
            <Button variant="plain" onClick={handleCloseButtonClick}>
              {t('common.cancel')}
            </Button>
            <Button color="primary" onClick={handleSaveButtonClick}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

function showUpdateCustomizedProfileDialog() {
  generateDialog(
    {
      className: 'update-customized-profile-dialog',
      dialogName: 'update-customized-profile-dialog',
    },
    UpdateCustomizedProfileDialog
  );
}

export default showUpdateCustomizedProfileDialog;

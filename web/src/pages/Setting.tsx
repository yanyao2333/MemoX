import MobileHeader from '@/components/MobileHeader';
import MemberSection from '@/components/Settings/MemberSection';
import MemoRelatedSettings from '@/components/Settings/MemoRelatedSettings';
import MyAccountSection from '@/components/Settings/MyAccountSection';
import PreferencesSection from '@/components/Settings/PreferencesSection';
import SSOSection from '@/components/Settings/SSOSection';
import SectionMenuItem from '@/components/Settings/SectionMenuItem';
import StorageSection from '@/components/Settings/StorageSection';
import WorkspaceSection from '@/components/Settings/WorkspaceSection';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useCommonContext } from '@/layouts/CommonContextProvider';
import { useWorkspaceSettingStore } from '@/store/v1';
import { User_Role } from '@/types/proto/api/v1/user_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import { Option, Select } from '@mui/joy';
import {
  CogIcon,
  DatabaseIcon,
  KeyIcon,
  LibraryIcon,
  type LucideIcon,
  Settings2Icon,
  UserIcon,
  UsersIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

type SettingSection =
  | 'my-account'
  | 'preference'
  | 'member'
  | 'system'
  | 'memo-related'
  | 'storage'
  | 'sso';

interface State {
  selectedSection: SettingSection;
}

const BASIC_SECTIONS: SettingSection[] = ['my-account', 'preference'];
const ADMIN_SECTIONS: SettingSection[] = [
  'member',
  'system',
  'memo-related',
  'storage',
  'sso',
];
const SECTION_ICON_MAP: Record<SettingSection, LucideIcon> = {
  'my-account': UserIcon,
  preference: CogIcon,
  member: UsersIcon,
  system: Settings2Icon,
  'memo-related': LibraryIcon,
  storage: DatabaseIcon,
  sso: KeyIcon,
};

const Setting = () => {
  const t = useTranslate();
  const location = useLocation();
  const commonContext = useCommonContext();
  const user = useCurrentUser();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const [state, setState] = useState<State>({
    selectedSection: 'my-account',
  });
  const isHost = user.role === User_Role.HOST;

  const settingsSectionList = useMemo(() => {
    let settingList = [...BASIC_SECTIONS];
    if (isHost) {
      settingList = settingList.concat(ADMIN_SECTIONS);
    }
    return settingList;
  }, [isHost]);

  useEffect(() => {
    let hash = location.hash.slice(1) as SettingSection;
    // If the hash is not a valid section, redirect to the default section.
    if (![...BASIC_SECTIONS, ...ADMIN_SECTIONS].includes(hash)) {
      hash = 'my-account';
    }
    setState({
      selectedSection: hash,
    });
  }, [location.hash]);

  useEffect(() => {
    if (!isHost) {
      return;
    }

    // Initial fetch for workspace settings.
    (async () => {
      [WorkspaceSettingKey.MEMO_RELATED, WorkspaceSettingKey.STORAGE].forEach(
        async (key) => {
          await workspaceSettingStore.fetchWorkspaceSetting(key);
        }
      );
    })();
  }, [isHost]);

  const handleSectionSelectorItemClick = useCallback(
    (settingSection: SettingSection) => {
      window.location.hash = settingSection;
    },
    []
  );

  return (
    <section className="@container flex min-h-full w-full max-w-5xl flex-col items-start justify-start pb-8 sm:pt-3 md:pt-6">
      <MobileHeader />
      <div className="w-full px-4 sm:px-6">
        <div className="flex w-full flex-row items-start justify-start rounded-xl bg-white px-4 py-3 text-gray-600 shadow dark:bg-zinc-800 dark:text-gray-400">
          <div className="hidden h-auto w-40 shrink-0 flex-col items-start justify-start py-2 sm:flex">
            <span className="mt-0.5 select-none pl-3 font-mono text-gray-400 text-sm dark:text-gray-500">
              {t('common.basic')}
            </span>
            <div className="mt-1 flex w-full flex-col items-start justify-start">
              {BASIC_SECTIONS.map((item) => (
                <SectionMenuItem
                  key={item}
                  text={t(`setting.${item}`)}
                  icon={SECTION_ICON_MAP[item]}
                  isSelected={state.selectedSection === item}
                  onClick={() => handleSectionSelectorItemClick(item)}
                />
              ))}
            </div>
            {isHost ? (
              <>
                <span className="mt-4 select-none pl-3 font-mono text-gray-400 text-sm dark:text-gray-500">
                  {t('common.admin')}
                </span>
                <div className="mt-1 flex w-full flex-col items-start justify-start">
                  {ADMIN_SECTIONS.map((item) => (
                    <SectionMenuItem
                      key={item}
                      text={t(`setting.${item}`)}
                      icon={SECTION_ICON_MAP[item]}
                      isSelected={state.selectedSection === item}
                      onClick={() => handleSectionSelectorItemClick(item)}
                    />
                  ))}
                  <span className="mt-2 px-3 text-sm opacity-70">
                    {t('setting.version')}: v{commonContext.profile.version}
                  </span>
                </div>
              </>
            ) : null}
          </div>
          <div className="w-full grow overflow-x-auto sm:pl-4">
            <div className="my-2 inline-block w-auto sm:hidden">
              <Select
                value={state.selectedSection}
                onChange={(_, value) =>
                  handleSectionSelectorItemClick(value as SettingSection)
                }
              >
                {settingsSectionList.map((settingSection) => (
                  <Option key={settingSection} value={settingSection}>
                    {t(`setting.${settingSection}`)}
                  </Option>
                ))}
              </Select>
            </div>
            {state.selectedSection === 'my-account' ? (
              <MyAccountSection />
            ) : state.selectedSection === 'preference' ? (
              <PreferencesSection />
            ) : state.selectedSection === 'member' ? (
              <MemberSection />
            ) : state.selectedSection === 'system' ? (
              <WorkspaceSection />
            ) : state.selectedSection === 'memo-related' ? (
              <MemoRelatedSettings />
            ) : state.selectedSection === 'storage' ? (
              <StorageSection />
            ) : state.selectedSection === 'sso' ? (
              <SSOSection />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Setting;

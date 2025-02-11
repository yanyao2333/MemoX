import useResponsiveWidth from '@/hooks/useResponsiveWidth';
import { useWorkspaceSettingStore } from '@/store/v1';
import { WorkspaceGeneralSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import clsx from 'clsx';
import useWindowScroll from 'react-use/lib/useWindowScroll';
import NavigationDrawer from './NavigationDrawer';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const MobileHeader = (props: Props) => {
  const { className, children } = props;
  const { sm } = useResponsiveWidth();
  const { y: offsetTop } = useWindowScroll();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const workspaceGeneralSetting =
    workspaceSettingStore.getWorkspaceSettingByKey(WorkspaceSettingKey.GENERAL)
      .generalSetting || WorkspaceGeneralSetting.fromPartial({});

  return (
    <div
      className={clsx(
        'sticky top-0 z-1 flex h-auto w-full shrink-0 flex-row flex-nowrap items-center justify-between bg-zinc-100 bg-opacity-80 px-4 pt-3 pb-2 backdrop-blur-lg sm:mb-1 sm:px-6 sm:pt-2 md:hidden dark:bg-zinc-900',
        offsetTop > 0 && 'shadow-md',
        className
      )}
    >
      <div className="mr-2 flex shrink-0 flex-row items-center justify-start overflow-hidden">
        {!sm && <NavigationDrawer />}
        <span
          className="mr-1 shrink-0 cursor-pointer overflow-hidden text-ellipsis font-bold text-gray-700 text-lg leading-10 dark:text-gray-300"
          onDoubleClick={() => location.reload()}
        >
          {workspaceGeneralSetting.customProfile?.title || 'Memos'}
        </span>
      </div>
      <div className="flex flex-row items-center justify-end">{children}</div>
    </div>
  );
};

export default MobileHeader;

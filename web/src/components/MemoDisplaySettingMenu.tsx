import { useMemoFilterStore } from '@/store/v1';
import { Option, Select } from '@mui/joy';
import clsx from 'clsx';
import { Settings2Icon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';

interface Props {
  className?: string;
}

const MemoDisplaySettingMenu = ({ className }: Props) => {
  const memoFilterStore = useMemoFilterStore();
  const isApplying = Boolean(memoFilterStore.orderByTimeAsc) !== false;

  return (
    <Popover>
      <PopoverTrigger
        className={clsx(
          className,
          isApplying
            ? 'rounded-sm bg-teal-50 text-teal-600 dark:bg-teal-900 dark:text-teal-500'
            : 'opacity-40'
        )}
      >
        <Settings2Icon className="h-auto w-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent align="end" alignOffset={-12} sideOffset={14}>
        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-row items-center justify-between">
            <span className="mr-3 shrink-0 text-sm">Order by</span>
            <Select value="displayTime">
              <Option value={'displayTime'}>Display Time</Option>
            </Select>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <span className="mr-3 shrink-0 text-sm">Direction</span>
            <Select
              value={memoFilterStore.orderByTimeAsc}
              onChange={(_, value) =>
                memoFilterStore.setOrderByTimeAsc(Boolean(value))
              }
            >
              <Option value={false}>DESC</Option>
              <Option value={true}>ASC</Option>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MemoDisplaySettingMenu;

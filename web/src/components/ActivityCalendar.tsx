import { useWorkspaceSettingStore } from '@/store/v1';
import { WorkspaceGeneralSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import { cn } from '@/utils/utils';
import { Tooltip } from '@mui/joy';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface Props {
  month: string; // Format: 2021-1
  selectedDate: string;
  data: Record<string, number>;
  onClick?: (date: string) => void;
}

const getCellAdditionalStyles = (count: number, maxCount: number) => {
  if (count === 0) {
    return '';
  }
  const ratio = count / maxCount;
  if (ratio > 0.7) {
    return 'bg-primary-darker text-gray-100 dark:opacity-80';
  }
  if (ratio > 0.4) {
    return 'bg-primary-dark text-gray-100 dark:opacity-80';
  }
  return 'bg-primary text-gray-100 dark:opacity-70';
};

const ActivityCalendar = (props: Props) => {
  const t = useTranslate();
  const { month: monthStr, data, onClick } = props;
  const workspaceSettingStore = useWorkspaceSettingStore();
  const weekStartDayOffset = (
    workspaceSettingStore.getWorkspaceSettingByKey(WorkspaceSettingKey.GENERAL)
      .generalSetting || WorkspaceGeneralSetting.fromPartial({})
  ).weekStartDayOffset;

  const year = dayjs(monthStr).toDate().getFullYear();
  const month = dayjs(monthStr).toDate().getMonth();
  const dayInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay =
    (((new Date(year, month, 1).getDay() - weekStartDayOffset) % 7) + 7) % 7;
  const lastDay =
    new Date(year, month, dayInMonth).getDay() - weekStartDayOffset;
  const prevMonthDays = new Date(year, month, 0).getDate();

  const WEEK_DAYS = [
    t('days.sun'),
    t('days.mon'),
    t('days.tue'),
    t('days.wed'),
    t('days.thu'),
    t('days.fri'),
    t('days.sat'),
  ];
  const weekDays = WEEK_DAYS.slice(weekStartDayOffset).concat(
    WEEK_DAYS.slice(0, weekStartDayOffset)
  );
  const maxCount = Math.max(...Object.values(data));
  const days = [];

  // Fill in previous month's days.
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }

  // Fill in current month's days.
  for (let i = 1; i <= dayInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  // Fill in next month's days.
  for (let i = 1; i < 7 - lastDay; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div
      className={clsx(
        'grid h-auto w-full shrink-0 grid-flow-row grid-cols-7 gap-1'
      )}
    >
      {weekDays.map((day, index) => (
        <div
          key={index}
          className={clsx(
            'flex h-5 w-6 cursor-default items-center justify-center text-xs opacity-60'
          )}
        >
          {day}
        </div>
      ))}
      {days.map((item, index) => {
        const date = dayjs(`${year}-${month + 1}-${item.day}`).format(
          'YYYY-MM-DD'
        );
        const count = item.isCurrentMonth ? data[date] || 0 : 0;
        const isToday = dayjs().format('YYYY-MM-DD') === date;
        const tooltipText = count
          ? t('memo.count-memos-in-date', { count: count, date: date })
          : date;
        const isSelected =
          dayjs(props.selectedDate).format('YYYY-MM-DD') === date;

        return (
          <Tooltip
            className="shrink-0"
            key={`${date}-${index}`}
            title={tooltipText}
            placement="top"
            arrow
          >
            <div
              className={cn(
                'flex h-6 w-6 cursor-default items-center justify-center rounded-xl border text-xs',
                'text-gray-400',
                item.isCurrentMonth
                  ? getCellAdditionalStyles(count, maxCount)
                  : 'opacity-60',
                item.isCurrentMonth && isToday && 'border-zinc-400',
                item.isCurrentMonth &&
                  isSelected &&
                  'border-zinc-400 font-bold',
                item.isCurrentMonth &&
                  !isToday &&
                  !isSelected &&
                  'border-transparent',
                !item.isCurrentMonth && 'border-transparent'
              )}
              onClick={() => count && onClick && onClick(date)}
            >
              {item.day}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ActivityCalendar;

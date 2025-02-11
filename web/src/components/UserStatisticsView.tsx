import useAsyncEffect from '@/hooks/useAsyncEffect';
import useCurrentUser from '@/hooks/useCurrentUser';
import i18n from '@/i18n';
import { useMemoFilterStore, useMemoMetadataStore } from '@/store/v1';
import { useTranslate } from '@/utils/i18n';
import { Divider, Tooltip } from '@mui/joy';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { countBy } from 'lodash-es';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Code2Icon,
  LinkIcon,
  ListTodoIcon,
} from 'lucide-react';
import { useState } from 'react';
import ActivityCalendar from './ActivityCalendar';

interface UserMemoStats {
  link: number;
  taskList: number;
  code: number;
  incompleteTasks: number;
}

const UserStatisticsView = () => {
  const t = useTranslate();
  const currentUser = useCurrentUser();
  const memoFilterStore = useMemoFilterStore();
  const memoMetadataStore = useMemoMetadataStore();
  const metadataList = Object.values(
    memoMetadataStore.getState().dataMapByName
  );
  const [memoAmount, setMemoAmount] = useState(0);
  const [memoStats, setMemoStats] = useState<UserMemoStats>({
    link: 0,
    taskList: 0,
    code: 0,
    incompleteTasks: 0,
  });
  const [activityStats, setActivityStats] = useState<Record<string, number>>(
    {}
  );
  const [selectedDate] = useState(new Date());
  const [visibleMonthString, setVisibleMonthString] = useState(
    dayjs(selectedDate.toDateString()).format('YYYY-MM')
  );
  const days = Math.ceil(
    (Date.now() - currentUser.createTime?.getTime()) / 86400000
  );

  useAsyncEffect(async () => {
    const memoStats: UserMemoStats = {
      link: 0,
      taskList: 0,
      code: 0,
      incompleteTasks: 0,
    };
    metadataList.forEach((memo) => {
      const { property } = memo;
      if (property?.hasLink) {
        memoStats.link += 1;
      }
      if (property?.hasTaskList) {
        memoStats.taskList += 1;
      }
      if (property?.hasCode) {
        memoStats.code += 1;
      }
      if (property?.hasIncompleteTasks) {
        memoStats.incompleteTasks += 1;
      }
    });
    setMemoStats(memoStats);
    setMemoAmount(metadataList.length);
    setActivityStats(
      countBy(
        metadataList.map((memo) => dayjs(memo.displayTime).format('YYYY-MM-DD'))
      )
    );
  }, [memoMetadataStore.stateId]);

  const onCalendarClick = (date: string) => {
    memoFilterStore.removeFilter((f) => f.factor === 'displayTime');
    memoFilterStore.addFilter({ factor: 'displayTime', value: date });
  };

  return (
    <div className="group mt-2 w-full space-y-0.5 rounded-lg border bg-zinc-50 px-3 py-2 text-gray-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400">
      <div className="mb-1 flex w-full flex-row items-center justify-between gap-1">
        <div className="relative inline-flex w-auto flex-row items-center truncate font-medium text-sm dark:text-gray-400">
          <CalendarDaysIcon
            className="mr-1 h-auto w-4 shrink-0 opacity-60"
            strokeWidth={1.5}
          />
          <span className="truncate">
            {dayjs(visibleMonthString).toDate().toLocaleString(i18n.language, {
              year: 'numeric',
              month: 'long',
            })}
          </span>
        </div>
        <div className="flex shrink-0 items-center justify-end">
          <span
            className="cursor-pointer hover:opacity-80"
            onClick={() =>
              setVisibleMonthString(
                dayjs(visibleMonthString).subtract(1, 'month').format('YYYY-MM')
              )
            }
          >
            <ChevronLeftIcon className="h-auto w-4 shrink-0 opacity-60" />
          </span>
          <span
            className="cursor-pointer hover:opacity-80"
            onClick={() =>
              setVisibleMonthString(
                dayjs(visibleMonthString).add(1, 'month').format('YYYY-MM')
              )
            }
          >
            <ChevronRightIcon className="h-auto w-4 shrink-0 opacity-60" />
          </span>
        </div>
      </div>
      <div className="w-full">
        <ActivityCalendar
          month={visibleMonthString}
          selectedDate={selectedDate.toDateString()}
          data={activityStats}
          onClick={onCalendarClick}
        />
        {memoAmount === 0 ? (
          <p className="mt-1 w-full text-xs italic opacity-80">No memos</p>
        ) : memoAmount === 1 ? (
          <p className="mt-1 w-full text-xs italic opacity-80">
            <span>{memoAmount}</span> memo in <span>{days}</span>{' '}
            {days > 1 ? 'days' : 'day'}
          </p>
        ) : (
          <p className="mt-1 w-full text-xs italic opacity-80">
            <span>{memoAmount}</span> memos in <span>{days}</span>{' '}
            {days > 1 ? 'days' : 'day'}
          </p>
        )}
      </div>
      <Divider className="!my-2 opacity-50" />
      <div className="flex w-full flex-row flex-wrap items-center justify-start gap-x-2 gap-y-1">
        <div
          className={clsx(
            'flex w-auto items-center justify-between rounded-md border pr-1.5 pl-1 dark:border-zinc-800'
          )}
          onClick={() =>
            memoFilterStore.addFilter({ factor: 'property.hasLink', value: '' })
          }
        >
          <div className="mr-1 flex w-auto items-center justify-start">
            <LinkIcon className="mr-1 h-auto w-4" />
            <span className="block text-sm">{t('memo.links')}</span>
          </div>
          <span className="truncate text-sm">{memoStats.link}</span>
        </div>
        <div
          className={clsx(
            'flex w-auto items-center justify-between rounded-md border pr-1.5 pl-1 dark:border-zinc-800'
          )}
          onClick={() =>
            memoFilterStore.addFilter({
              factor: 'property.hasTaskList',
              value: '',
            })
          }
        >
          <div className="mr-1 flex w-auto items-center justify-start">
            {memoStats.incompleteTasks > 0 ? (
              <ListTodoIcon className="mr-1 h-auto w-4" />
            ) : (
              <CheckCircleIcon className="mr-1 h-auto w-4" />
            )}
            <span className="block text-sm">{t('memo.to-do')}</span>
          </div>
          {memoStats.incompleteTasks > 0 ? (
            <Tooltip title={'Done / Total'} placement="top" arrow>
              <div className="flex flex-row items-start justify-center text-sm">
                <span className="truncate">
                  {memoStats.taskList - memoStats.incompleteTasks}
                </span>
                <span className="font-mono opacity-50">/</span>
                <span className="truncate">{memoStats.taskList}</span>
              </div>
            </Tooltip>
          ) : (
            <span className="truncate text-sm">{memoStats.taskList}</span>
          )}
        </div>
        <div
          className={clsx(
            'flex w-auto items-center justify-between rounded-md border pr-1.5 pl-1 dark:border-zinc-800'
          )}
          onClick={() =>
            memoFilterStore.addFilter({ factor: 'property.hasCode', value: '' })
          }
        >
          <div className="mr-1 flex w-auto items-center justify-start">
            <Code2Icon className="mr-1 h-auto w-4" />
            <span className="block text-sm">{t('memo.code')}</span>
          </div>
          <span className="truncate text-sm">{memoStats.code}</span>
        </div>
      </div>
    </div>
  );
};

export default UserStatisticsView;

import { MemoRelation_Type } from '@/types/proto/api/v1/memo_relation_service';
import { type Memo, MemoProperty } from '@/types/proto/api/v1/memo_service';
import { useTranslate } from '@/utils/i18n';
import clsx from 'clsx';
import { isEqual } from 'lodash-es';
import { CheckCircleIcon, Code2Icon, HashIcon, LinkIcon } from 'lucide-react';
import MemoRelationForceGraph from '../MemoRelationForceGraph';

interface Props {
  memo: Memo;
  className?: string;
}

const MemoDetailSidebar = ({ memo, className }: Props) => {
  const t = useTranslate();
  const property = MemoProperty.fromPartial(memo.property || {});
  const hasSpecialProperty =
    property.hasLink ||
    property.hasTaskList ||
    property.hasCode ||
    property.hasIncompleteTasks;
  const shouldShowRelationGraph =
    memo.relations.filter((r) => r.type === MemoRelation_Type.REFERENCE)
      .length > 0;

  return (
    <aside
      className={clsx(
        'hide-scrollbar relative flex h-auto max-h-screen w-full flex-col items-start justify-start overflow-auto',
        className
      )}
    >
      <div className="hide-scrollbar flex h-auto w-full shrink-0 flex-col flex-nowrap items-start justify-start gap-2 px-1">
        {shouldShowRelationGraph && (
          <div className="relative h-36 w-full rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <MemoRelationForceGraph className="h-full w-full" memo={memo} />
            <div className="absolute top-1 left-2 flex flex-row items-center gap-1 font-mono text-xs opacity-60">
              <span>Relations</span>
              <span className="text-xs opacity-60">(Beta)</span>
            </div>
          </div>
        )}
        <div className="flex w-full flex-col">
          <p className="mb-1 flex w-full select-none flex-row items-center justify-start gap-1 text-gray-400 text-sm leading-6 dark:text-gray-500">
            <span>Created at</span>
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {memo.createTime?.toLocaleString()}
          </p>
        </div>
        {!isEqual(memo.createTime, memo.updateTime) && (
          <div className="flex w-full flex-col">
            <p className="mb-1 flex w-full select-none flex-row items-center justify-start gap-1 text-gray-400 text-sm leading-6 dark:text-gray-500">
              <span>Last updated at</span>
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {memo.updateTime?.toLocaleString()}
            </p>
          </div>
        )}
        {hasSpecialProperty && (
          <div className="flex w-full flex-col">
            <p className="mb-1 flex w-full select-none flex-row items-center justify-start gap-1 text-gray-400 text-sm leading-6 dark:text-gray-500">
              <span>Properties</span>
            </p>
            <div className="flex w-full flex-row flex-wrap items-center justify-start gap-x-2 gap-y-1 text-gray-500 dark:text-gray-400">
              {property.hasLink && (
                <div className="flex w-auto items-center justify-between rounded-md border pr-1.5 pl-1 dark:border-zinc-800">
                  <div className="mr-1 flex w-auto items-center justify-start">
                    <LinkIcon className="mr-1 h-auto w-4" />
                    <span className="block text-sm">{t('memo.links')}</span>
                  </div>
                </div>
              )}
              {property.hasTaskList && (
                <div className="flex w-auto items-center justify-between rounded-md border pr-1.5 pl-1 dark:border-zinc-800">
                  <div className="mr-1 flex w-auto items-center justify-start">
                    <CheckCircleIcon className="mr-1 h-auto w-4" />
                    <span className="block text-sm">{t('memo.to-do')}</span>
                  </div>
                </div>
              )}
              {property.hasCode && (
                <div className="flex w-auto items-center justify-between rounded-md border pr-1.5 pl-1 dark:border-zinc-800">
                  <div className="mr-1 flex w-auto items-center justify-start">
                    <Code2Icon className="mr-1 h-auto w-4" />
                    <span className="block text-sm">{t('memo.code')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {memo.tags.length > 0 && (
          <>
            <div className="mb-1 flex w-full select-none flex-row items-center justify-start gap-1 text-gray-400 text-sm leading-6 dark:text-gray-500">
              <span>{t('common.tags')}</span>
              <span className="shrink-0">({memo.tags.length})</span>
            </div>
            <div className="relative flex w-full flex-row flex-wrap items-center justify-start gap-x-2 gap-y-1">
              {memo.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex w-auto max-w-full shrink-0 select-none flex-row items-center justify-start rounded-md text-gray-600 text-sm leading-6 hover:opacity-80 dark:border-zinc-800 dark:text-gray-400"
                >
                  <HashIcon className="h-auto w-4 shrink-0 opacity-40 group-hover:hidden" />
                  <div
                    className={clsx(
                      'ml-0.5 inline-flex max-w-[calc(100%-16px)] cursor-pointer flex-nowrap gap-0.5'
                    )}
                  >
                    <span className="truncate dark:opacity-80">{tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default MemoDetailSidebar;

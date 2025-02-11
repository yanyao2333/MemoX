import MemoContent from '@/components/MemoContent';
import MemoFilters from '@/components/MemoFilters';
import MobileHeader from '@/components/MobileHeader';
import PagedMemoList from '@/components/PagedMemoList';
import SearchBar from '@/components/SearchBar';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useMemoFilterStore, useMemoStore } from '@/store/v1';
import { RowStatus } from '@/types/proto/api/v1/common';
import type { Memo } from '@/types/proto/api/v1/memo_service';
import { useTranslate } from '@/utils/i18n';
import { Tooltip } from '@mui/joy';
import dayjs from 'dayjs';
import { ArchiveIcon, ArchiveRestoreIcon, TrashIcon } from 'lucide-react';
import type { ClientError } from 'nice-grpc-web';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

const Archived = () => {
  const t = useTranslate();
  const user = useCurrentUser();
  const memoStore = useMemoStore();
  const memoFilterStore = useMemoFilterStore();

  const memoListFilter = useMemo(() => {
    const filters = [`creator == "${user.name}"`, `row_status == "ARCHIVED"`];
    const contentSearch: string[] = [];
    const tagSearch: string[] = [];
    for (const filter of memoFilterStore.filters) {
      if (filter.factor === 'contentSearch') {
        contentSearch.push(`"${filter.value}"`);
      } else if (filter.factor === 'tagSearch') {
        tagSearch.push(`"${filter.value}"`);
      }
    }
    if (memoFilterStore.orderByTimeAsc) {
      filters.push('order_by_time_asc == true');
    }
    if (contentSearch.length > 0) {
      filters.push(`content_search == [${contentSearch.join(', ')}]`);
    }
    if (tagSearch.length > 0) {
      filters.push(`tag_search == [${tagSearch.join(', ')}]`);
    }
    return filters.join(' && ');
  }, [user, memoFilterStore.filters]);

  const handleDeleteMemoClick = async (memo: Memo) => {
    const confirmed = window.confirm(t('memo.delete-confirm'));
    if (confirmed) {
      await memoStore.deleteMemo(memo.name);
    }
  };

  const handleRestoreMemoClick = async (memo: Memo) => {
    try {
      await memoStore.updateMemo(
        {
          name: memo.name,
          rowStatus: RowStatus.ACTIVE,
        },
        ['row_status']
      );
      toast(t('message.restored-successfully'));
    } catch (error: unknown) {
      toast.error((error as ClientError).details);
    }
  };

  return (
    <section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
      <MobileHeader />
      <div className="w-full px-4 sm:px-6">
        <div className="flex w-full flex-col items-start justify-start">
          <div className="mb-2 flex w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start gap-1">
              <ArchiveIcon className="h-auto w-5 shrink-0 opacity-70" />
              <span>{t('common.archived')}</span>
            </div>
            <div className="w-44">
              <SearchBar />
            </div>
          </div>
          <MemoFilters />
          <PagedMemoList
            renderer={(memo: Memo) => (
              <div
                key={memo.name}
                className="relative mb-2 flex w-full flex-col items-start justify-start rounded-lg bg-white p-4 pt-3 dark:bg-zinc-800"
              >
                <div className="mb-1 flex w-full flex-row items-center justify-between">
                  <div className="mr-1 flex w-full max-w-[calc(100%-20px)] flex-row items-center justify-start">
                    <div className="select-none text-gray-400 text-sm leading-6">
                      <relative-time
                        datetime={memo.displayTime?.toISOString()}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-end gap-x-2">
                    <Tooltip title={t('common.restore')} placement="top">
                      <button onClick={() => handleRestoreMemoClick(memo)}>
                        <ArchiveRestoreIcon className="h-auto w-4 cursor-pointer text-gray-500 dark:text-gray-400" />
                      </button>
                    </Tooltip>
                    <Tooltip title={t('common.delete')} placement="top">
                      <button
                        onClick={() => handleDeleteMemoClick(memo)}
                        className="text-gray-500 dark:text-gray-400"
                      >
                        <TrashIcon className="h-auto w-4 cursor-pointer" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <MemoContent
                  key={`${memo.name}-${memo.displayTime}`}
                  memoName={memo.name}
                  nodes={memo.nodes}
                  readonly={true}
                />
              </div>
            )}
            listSort={(memos: Memo[]) =>
              memos
                .filter((memo) => memo.rowStatus === RowStatus.ARCHIVED)
                .sort((a, b) =>
                  memoFilterStore.orderByTimeAsc
                    ? dayjs(a.displayTime).unix() - dayjs(b.displayTime).unix()
                    : dayjs(b.displayTime).unix() - dayjs(a.displayTime).unix()
                )
            }
            filter={memoListFilter}
          />
        </div>
      </div>
    </section>
  );
};

export default Archived;

import {
  ExploreSidebar,
  ExploreSidebarDrawer,
} from '@/components/ExploreSidebar';
import MemoFilters from '@/components/MemoFilters';
import MemoView from '@/components/MemoView';
import MobileHeader from '@/components/MobileHeader';
import PagedMemoList from '@/components/PagedMemoList';
import useCurrentUser from '@/hooks/useCurrentUser';
import useResponsiveWidth from '@/hooks/useResponsiveWidth';
import { useMemoFilterStore } from '@/store/v1';
import { RowStatus } from '@/types/proto/api/v1/common';
import type { Memo } from '@/types/proto/api/v1/memo_service';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const Explore = () => {
  const { md } = useResponsiveWidth();
  const user = useCurrentUser();
  const memoFilterStore = useMemoFilterStore();

  const memoListFilter = useMemo(() => {
    const filters = [
      `row_status == "NORMAL"`,
      `visibilities == [${user ? "'PUBLIC', 'PROTECTED'" : "'PUBLIC'"}]`,
    ];
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
  }, [user, memoFilterStore.filters, memoFilterStore.orderByTimeAsc]);

  return (
    <section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
      {!md && (
        <MobileHeader>
          <ExploreSidebarDrawer />
        </MobileHeader>
      )}
      <div
        className={clsx(
          'flex w-full flex-row items-start justify-start gap-4 px-4 sm:px-6'
        )}
      >
        <div className={clsx(md ? 'w-[calc(100%-15rem)]' : 'w-full')}>
          <MemoFilters />
          <div className="flex w-full max-w-full flex-col items-start justify-start">
            <PagedMemoList
              renderer={(memo: Memo) => (
                <MemoView
                  key={`${memo.name}-${memo.updateTime}`}
                  memo={memo}
                  showCreator
                  showVisibility
                  compact
                />
              )}
              listSort={(memos: Memo[]) =>
                memos
                  .filter((memo) => memo.rowStatus === RowStatus.ACTIVE)
                  .sort((a, b) =>
                    memoFilterStore.orderByTimeAsc
                      ? dayjs(a.displayTime).unix() -
                        dayjs(b.displayTime).unix()
                      : dayjs(b.displayTime).unix() -
                        dayjs(a.displayTime).unix()
                  )
              }
              filter={memoListFilter}
            />
          </div>
        </div>
        {md && (
          <div className="-mt-6 sticky top-0 left-0 h-full w-56 shrink-0">
            <ExploreSidebar className="py-6" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Explore;

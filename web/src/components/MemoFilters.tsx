import {
  type FilterFactor,
  type MemoFilter,
  getMemoFilterKey,
  useMemoFilterStore,
} from '@/store/v1';
import { isEqual } from 'lodash-es';
import {
  CalendarIcon,
  CheckCircleIcon,
  CodeIcon,
  EyeIcon,
  FilterIcon,
  LinkIcon,
  SearchIcon,
  TagIcon,
  XIcon,
} from 'lucide-react';

const MemoFilters = () => {
  const memoFilterStore = useMemoFilterStore();
  const filters = memoFilterStore.filters;

  const getFilterDisplayText = (filter: MemoFilter) => {
    if (filter.value) {
      return filter.value;
    }
    if (filter.factor.startsWith('property.')) {
      return filter.factor.replace('property.', '');
    }
    return filter.factor;
  };

  if (filters.length === 0) {
    return undefined;
  }

  return (
    <div className="mb-2 flex w-full flex-row items-start justify-start gap-2">
      <span className="flex flex-row items-center gap-0.5 border border-transparent text-gray-500 text-sm leading-6">
        <FilterIcon className="inline h-auto w-4 opacity-60" />
        Filters
      </span>
      <div className="flex h-6 flex-row flex-wrap items-center justify-start gap-2 leading-6">
        {filters.map((filter) => (
          <div
            key={getMemoFilterKey(filter)}
            className="flex cursor-pointer flex-row items-center gap-1 rounded-md border bg-white pr-1 pl-1.5 hover:line-through dark:border-zinc-700 dark:bg-zinc-800"
            onClick={() =>
              memoFilterStore.removeFilter((f) => isEqual(f, filter))
            }
          >
            <FactorIcon
              className="h-auto w-4 text-gray-500 opacity-60 dark:text-gray-400"
              factor={filter.factor}
            />
            <span className="max-w-32 truncate text-gray-500 text-sm dark:text-gray-400">
              {getFilterDisplayText(filter)}
            </span>
            <button className="text-gray-500 opacity-60 hover:opacity-100 dark:text-gray-300">
              <XIcon className="h-auto w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const FactorIcon = ({
  factor,
  className,
}: { factor: FilterFactor; className?: string }) => {
  const iconMap = {
    tagSearch: <TagIcon className={className} />,
    visibility: <EyeIcon className={className} />,
    contentSearch: <SearchIcon className={className} />,
    displayTime: <CalendarIcon className={className} />,
    'property.hasLink': <LinkIcon className={className} />,
    'property.hasTaskList': <CheckCircleIcon className={className} />,
    'property.hasCode': <CodeIcon className={className} />,
  };
  return iconMap[factor as keyof typeof iconMap] || <></>;
};

export default MemoFilters;

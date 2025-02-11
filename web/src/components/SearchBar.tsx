import { useMemoFilterStore } from '@/store/v1';
import { useTranslate } from '@/utils/i18n';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import MemoDisplaySettingMenu from './MemoDisplaySettingMenu';

const SearchBar = () => {
  const t = useTranslate();
  const memoFilterStore = useMemoFilterStore();
  const [queryText, setQueryText] = useState('');

  const onTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    setQueryText(event.currentTarget.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (queryText !== '') {
        memoFilterStore.removeFilter((f) => f.factor === 'contentSearch');
        memoFilterStore.addFilter({
          factor: 'contentSearch',
          value: queryText,
        });
        setQueryText('');
      }
    }
  };

  return (
    <div className="relative flex h-auto w-full flex-row items-center justify-start">
      <SearchIcon className="absolute left-3 h-auto w-4 opacity-40" />
      <input
        className="w-full rounded-lg border bg-zinc-50 p-1 pl-8 text-gray-500 text-sm leading-7 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400"
        placeholder={t('memo.search-placeholder')}
        value={queryText}
        onChange={onTextChange}
        onKeyDown={onKeyDown}
      />
      <MemoDisplaySettingMenu className="absolute top-3 right-3" />
    </div>
  );
};

export default SearchBar;

import SearchBar from '@/components/SearchBar';
import UserStatisticsView from '@/components/UserStatisticsView';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useMemoList, useMemoMetadataStore } from '@/store/v1';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import useDebounce from 'react-use/lib/useDebounce';
import TagsSection from './TagsSection';

interface Props {
  className?: string;
}

const HomeSidebar = (props: Props) => {
  const location = useLocation();
  const user = useCurrentUser();
  const memoList = useMemoList();
  const memoMetadataStore = useMemoMetadataStore();

  useDebounce(
    async () => {
      await memoMetadataStore.fetchMemoMetadata({ user, location });
    },
    300,
    [memoList.size(), user, location.pathname]
  );

  return (
    <aside
      className={clsx(
        'hide-scrollbar relative flex h-auto max-h-screen w-full flex-col items-start justify-start overflow-auto',
        props.className
      )}
    >
      <SearchBar />
      <UserStatisticsView />
      <TagsSection />
    </aside>
  );
};

export default HomeSidebar;

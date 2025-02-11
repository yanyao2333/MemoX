import { memoServiceClient } from '@/grpcweb';
import useCurrentUser from '@/hooks/useCurrentUser';
import {
  useMemoFilterStore,
  useMemoMetadataStore,
  useMemoTagList,
} from '@/store/v1';
import { useTranslate } from '@/utils/i18n';
import { Dropdown, Menu, MenuButton, MenuItem, Switch } from '@mui/joy';
import clsx from 'clsx';
import {
  Edit3Icon,
  HashIcon,
  MoreVerticalIcon,
  TagsIcon,
  TrashIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import showRenameTagDialog from '../RenameTagDialog';
import TagTree from '../TagTree';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';

interface Props {
  readonly?: boolean;
}

const TagsSection = (props: Props) => {
  const t = useTranslate();
  const location = useLocation();
  const user = useCurrentUser();
  const memoFilterStore = useMemoFilterStore();
  const memoMetadataStore = useMemoMetadataStore();
  const [treeMode, setTreeMode] = useLocalStorage<boolean>(
    'tag-view-as-tree',
    false
  );
  const tags = Object.entries(useMemoTagList())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .sort((a, b) => b[1] - a[1]);

  const handleTagClick = (tag: string) => {
    const isActive = memoFilterStore
      .getFiltersByFactor('tagSearch')
      .some((filter) => filter.value === tag);
    if (isActive) {
      memoFilterStore.removeFilter(
        (f) => f.factor === 'tagSearch' && f.value === tag
      );
    } else {
      memoFilterStore.addFilter({
        factor: 'tagSearch',
        value: tag,
      });
    }
  };

  const handleDeleteTag = async (tag: string) => {
    const confirmed = window.confirm(t('tag.delete-confirm'));
    if (confirmed) {
      await memoServiceClient.deleteMemoTag({
        parent: 'memos/-',
        tag: tag,
      });
      await memoMetadataStore.fetchMemoMetadata({ user, location });
      toast.success(t('message.deleted-successfully'));
    }
  };

  return (
    <div className="hide-scrollbar mt-3 flex h-auto w-full shrink-0 flex-col flex-nowrap items-start justify-start px-1">
      <div className="mb-1 flex w-full select-none flex-row items-center justify-between gap-1 text-gray-400 text-sm leading-6">
        <span>{t('common.tags')}</span>
        {tags.length > 0 && (
          <Popover>
            <PopoverTrigger>
              <MoreVerticalIcon className="h-auto w-4 shrink-0 opacity-60" />
            </PopoverTrigger>
            <PopoverContent align="end" alignOffset={-12}>
              <div className="flex w-auto flex-row items-center justify-between gap-2">
                <span className="shrink-0 text-sm">Tree mode</span>
                <Switch
                  size="sm"
                  checked={treeMode}
                  onChange={(event) => setTreeMode(event.target.checked)}
                />
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      {tags.length > 0 ? (
        treeMode ? (
          <TagTree tagAmounts={tags} />
        ) : (
          <div className="relative flex w-full flex-row flex-wrap items-center justify-start gap-x-2 gap-y-1">
            {tags.map(([tag, amount]) => (
              <div
                key={tag}
                className="flex w-auto max-w-full shrink-0 select-none flex-row items-center justify-start rounded-md text-gray-600 text-sm leading-6 hover:opacity-80 dark:border-zinc-800 dark:text-gray-400"
              >
                <Dropdown>
                  <MenuButton slots={{ root: 'div' }}>
                    <div className="group shrink-0">
                      <HashIcon className="h-auto w-4 shrink-0 opacity-40 group-hover:hidden" />
                      <MoreVerticalIcon className="hidden h-auto w-4 shrink-0 opacity-60 group-hover:block" />
                    </div>
                  </MenuButton>
                  <Menu size="sm" placement="bottom-start">
                    <MenuItem onClick={() => showRenameTagDialog({ tag: tag })}>
                      <Edit3Icon className="h-auto w-4" />
                      {t('common.rename')}
                    </MenuItem>
                    <MenuItem
                      color="danger"
                      onClick={() => handleDeleteTag(tag)}
                    >
                      <TrashIcon className="h-auto w-4" />
                      {t('common.delete')}
                    </MenuItem>
                  </Menu>
                </Dropdown>
                <div
                  className={clsx(
                    'ml-0.5 inline-flex max-w-[calc(100%-16px)] cursor-pointer flex-nowrap gap-0.5'
                  )}
                  onClick={() => handleTagClick(tag)}
                >
                  <span className="truncate dark:opacity-80">{tag}</span>
                  {amount > 1 && (
                    <span className="shrink-0 opacity-60">({amount})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        !props.readonly && (
          <div className="flex flex-row items-start justify-start gap-1 rounded-md border border-dashed p-2 text-gray-400 dark:border-zinc-800 dark:text-gray-500">
            <TagsIcon />
            <p className="mt-0.5 text-sm italic leading-snug">
              {t('tag.create-tags-guide')}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default TagsSection;

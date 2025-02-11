import { useMemoFilterStore } from '@/store/v1';
import { ChevronRightIcon, HashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import useToggle from 'react-use/lib/useToggle';

interface Tag {
  key: string;
  text: string;
  amount: number;
  subTags: Tag[];
}

interface Props {
  tagAmounts: [tag: string, amount: number][];
}

const TagTree = ({ tagAmounts: rawTagAmounts }: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const sortedTagAmounts = Array.from(rawTagAmounts).sort();
    const root: Tag = {
      key: '',
      text: '',
      amount: 0,
      subTags: [],
    };

    for (const tagAmount of sortedTagAmounts) {
      const subtags = tagAmount[0].split('/');
      let tempObj = root;
      let tagText = '';

      for (let i = 0; i < subtags.length; i++) {
        const key = subtags[i];
        let amount = 0;

        if (i === 0) {
          tagText += key;
        } else {
          tagText += `/${key}`;
        }
        if (
          sortedTagAmounts.some(
            ([tag, amount]) => tag === tagText && amount > 1
          )
        ) {
          amount = tagAmount[1];
        }

        let obj = null;

        for (const t of tempObj.subTags) {
          if (t.text === tagText) {
            obj = t;
            break;
          }
        }

        if (!obj) {
          obj = {
            key,
            text: tagText,
            amount: amount,
            subTags: [],
          };
          tempObj.subTags.push(obj);
        }

        tempObj = obj;
      }
    }

    setTags(root.subTags as Tag[]);
  }, [rawTagAmounts]);

  return (
    <div className="relative mt-1 flex h-auto w-full flex-col flex-nowrap items-start justify-start gap-2">
      {tags.map((t, idx) => (
        <TagItemContainer key={`${t.text}-${idx}`} tag={t} />
      ))}
    </div>
  );
};

interface TagItemContainerProps {
  tag: Tag;
}

const TagItemContainer: React.FC<TagItemContainerProps> = (
  props: TagItemContainerProps
) => {
  const { tag } = props;
  const memoFilterStore = useMemoFilterStore();
  const tagFilters = memoFilterStore.getFiltersByFactor('tagSearch');
  const isActive = tagFilters.some((f) => f.value === tag.text);
  const hasSubTags = tag.subTags.length > 0;
  const [showSubTags, toggleSubTags] = useToggle(false);

  const handleTagClick = () => {
    if (isActive) {
      memoFilterStore.removeFilter(
        (f) => f.factor === 'tagSearch' && f.value === tag.text
      );
    } else {
      memoFilterStore.addFilter({
        factor: 'tagSearch',
        value: tag.text,
      });
    }
  };

  const handleToggleBtnClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSubTags();
  };

  return (
    <>
      <div className="relative mt-px flex w-full shrink-0 select-none flex-row items-center justify-between rounded-lg py-0 text-sm leading-6">
        <div
          className={`mr-1 flex shrink flex-row items-center justify-start truncate text-gray-600 leading-5 dark:text-gray-400 ${
            isActive && '!text-blue-600'
          }`}
        >
          <div className="shrink-0">
            <HashIcon className="mr-1 h-auto w-4 shrink-0 text-gray-400 dark:text-gray-500" />
          </div>
          <span
            className="cursor-pointer truncate hover:opacity-80"
            onClick={handleTagClick}
          >
            {tag.key} {tag.amount > 1 && `(${tag.amount})`}
          </span>
        </div>
        <div className="flex flex-row items-center justify-end">
          {hasSubTags ? (
            <span
              className={`flex h-6 w-6 shrink-0 rotate-0 flex-row items-center justify-center transition-all ${showSubTags && 'rotate-90'}`}
              onClick={handleToggleBtnClick}
            >
              <ChevronRightIcon className="h-5 w-5 cursor-pointer text-gray-400 dark:text-gray-500" />
            </span>
          ) : null}
        </div>
      </div>
      {hasSubTags ? (
        <div
          className={`ml-2 flex h-auto w-[calc(100%-0.5rem)] flex-col items-start justify-start border-l-2 border-l-gray-200 pl-2 dark:border-l-zinc-800 ${
            !showSubTags && '!hidden'
          }`}
        >
          {tag.subTags.map((st, idx) => (
            <TagItemContainer key={`${st.text}-${idx}`} tag={st} />
          ))}
        </div>
      ) : null}
    </>
  );
};

export default TagTree;

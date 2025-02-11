import { useMemoStore } from '@/store/v1';
import {
  type MemoRelation,
  MemoRelation_Type,
} from '@/types/proto/api/v1/memo_relation_service';
import type { Memo } from '@/types/proto/api/v1/memo_service';
import { LinkIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  relationList: MemoRelation[];
  setRelationList: (relationList: MemoRelation[]) => void;
}

const RelationListView = (props: Props) => {
  const { relationList, setRelationList } = props;
  const memoStore = useMemoStore();
  const [referencingMemoList, setReferencingMemoList] = useState<Memo[]>([]);

  useEffect(() => {
    (async () => {
      const requests = relationList
        .filter((relation) => relation.type === MemoRelation_Type.REFERENCE)
        .map(async (relation) => {
          return await memoStore.getOrFetchMemoByName(
            relation.relatedMemo?.name,
            { skipStore: true }
          );
        });
      const list = await Promise.all(requests);
      setReferencingMemoList(list);
    })();
  }, [relationList]);

  const handleDeleteRelation = async (memo: Memo) => {
    setRelationList(
      relationList.filter(
        (relation) => relation.relatedMemo?.name !== memo.name
      )
    );
  };

  return (
    <>
      {referencingMemoList.length > 0 && (
        <div className="mt-2 flex w-full flex-row flex-wrap gap-2">
          {referencingMemoList.map((memo) => {
            return (
              <div
                key={memo.name}
                className="flex w-auto max-w-xs cursor-pointer flex-row items-center justify-start overflow-hidden rounded-md bg-zinc-100 p-1 px-2 text-gray-500 text-sm hover:line-through hover:opacity-80 dark:bg-zinc-900 dark:text-gray-400"
                onClick={() => handleDeleteRelation(memo)}
              >
                <LinkIcon className="h-auto w-4 shrink-0 opacity-80" />
                <span className="mx-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {memo.snippet}
                </span>
                <XIcon className="h-auto w-4 shrink-0 cursor-pointer opacity-60 hover:opacity-100" />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default RelationListView;

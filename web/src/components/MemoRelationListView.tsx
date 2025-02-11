import type { MemoRelation } from '@/types/proto/api/v1/memo_relation_service';
import type { Memo } from '@/types/proto/api/v1/memo_service';
import clsx from 'clsx';
import { LinkIcon, MilestoneIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  memo: Memo;
  relations: MemoRelation[];
}

const MemoRelationListView = (props: Props) => {
  const { memo, relations: relationList } = props;
  const referencingMemoList = relationList
    .filter(
      (relation) =>
        relation.memo?.name === memo.name &&
        relation.relatedMemo?.name !== memo.name
    )
    .map((relation) => relation.relatedMemo!);
  const referencedMemoList = relationList
    .filter(
      (relation) =>
        relation.memo?.name !== memo.name &&
        relation.relatedMemo?.name === memo.name
    )
    .map((relation) => relation.memo!);
  const [selectedTab, setSelectedTab] = useState<'referencing' | 'referenced'>(
    referencingMemoList.length === 0 ? 'referenced' : 'referencing'
  );

  if (referencingMemoList.length + referencedMemoList.length === 0) {
    return null;
  }

  return (
    <div className="relative flex w-full flex-col items-start justify-start rounded-lg border border-gray-200 bg-zinc-50 px-2 pt-2 pb-1.5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-1 flex w-full flex-row items-center justify-start gap-3 opacity-60">
        {referencingMemoList.length > 0 && (
          <button
            className={clsx(
              'flex w-auto flex-row items-center justify-start gap-0.5 text-gray-500 text-xs',
              selectedTab === 'referencing' &&
                'text-gray-800 dark:text-gray-400'
            )}
            onClick={() => setSelectedTab('referencing')}
          >
            <LinkIcon className="h-auto w-3 shrink-0 opacity-70" />
            <span>Referencing</span>
            <span className="opacity-80">({referencingMemoList.length})</span>
          </button>
        )}
        {referencedMemoList.length > 0 && (
          <button
            className={clsx(
              'flex w-auto flex-row items-center justify-start gap-0.5 text-gray-500 text-xs',
              selectedTab === 'referenced' && 'text-gray-800 dark:text-gray-400'
            )}
            onClick={() => setSelectedTab('referenced')}
          >
            <MilestoneIcon className="h-auto w-3 shrink-0 opacity-70" />
            <span>Referenced by</span>
            <span className="opacity-80">({referencedMemoList.length})</span>
          </button>
        )}
      </div>
      {selectedTab === 'referencing' && referencingMemoList.length > 0 && (
        <div className="flex w-full flex-col items-start justify-start">
          {referencingMemoList.map((memo) => {
            return (
              <Link
                key={memo.name}
                className="flex w-auto max-w-full flex-row items-center justify-start text-gray-600 text-sm leading-5 hover:underline dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-400"
                to={`/m/${memo.uid}`}
                viewTransition
              >
                <span className="mr-1 rounded-full border px-1 font-mono text-xs leading-4 opacity-60 dark:border-zinc-700">
                  {memo.uid.slice(0, 6)}
                </span>
                <span className="truncate">{memo.snippet}</span>
              </Link>
            );
          })}
        </div>
      )}
      {selectedTab === 'referenced' && referencedMemoList.length > 0 && (
        <div className="flex w-full flex-col items-start justify-start">
          {referencedMemoList.map((memo) => {
            return (
              <Link
                key={memo.name}
                className="flex w-auto max-w-full flex-row items-center justify-start text-gray-600 text-sm leading-5 hover:underline dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-400"
                to={`/m/${memo.uid}`}
                viewTransition
              >
                <span className="mr-1 rounded-full border px-1 font-mono text-xs leading-4 opacity-60 dark:border-zinc-700">
                  {memo.uid.slice(0, 6)}
                </span>
                <span className="truncate">{memo.snippet}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default memo(MemoRelationListView);

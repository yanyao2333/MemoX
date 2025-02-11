import MemoResourceListView from '@/components/MemoResourceListView';
import useLoading from '@/hooks/useLoading';
import { useMemoStore } from '@/store/v1';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import { ArrowUpRightIcon } from 'lucide-react';
import { useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import MemoContent from '..';
import { RendererContext } from '../types';
import Error from './Error';

interface Props {
  resourceId: string;
  params: string;
}

const EmbeddedMemo = ({ resourceId: uid, params: paramsStr }: Props) => {
  const context = useContext(RendererContext);
  const loadingState = useLoading();
  const memoStore = useMemoStore();
  const memo = memoStore.getMemoByUid(uid);
  const resourceName = `memos/${uid}`;

  useEffect(() => {
    memoStore.fetchMemoByUid(uid).finally(() => loadingState.setFinish());
  }, [uid]);

  if (loadingState.isLoading) {
    return null;
  }
  if (!memo) {
    return <Error message={`Memo not found: ${uid}`} />;
  }

  const params = new URLSearchParams(paramsStr);
  const useSnippet = params.has('snippet');
  const inlineMode = params.has('inline');
  if (
    !useSnippet &&
    (memo.name === context.memoName || context.embeddedMemos.has(resourceName))
  ) {
    return <Error message={`Nested Rendering Error: ![[${resourceName}]]`} />;
  }

  // Add the memo to the set of embedded memos. This is used to prevent infinite loops when a memo embeds itself.
  context.embeddedMemos.add(resourceName);
  const contentNode = useSnippet ? (
    <div
      className={clsx(
        'text-gray-800 dark:text-gray-400',
        inlineMode ? '' : 'line-clamp-3'
      )}
    >
      {memo.snippet}
    </div>
  ) : (
    <>
      <MemoContent
        contentClassName={inlineMode ? '' : 'line-clamp-3'}
        memoName={memo.name}
        nodes={memo.nodes}
        embeddedMemos={context.embeddedMemos}
      />
      <MemoResourceListView resources={memo.resources} />
    </>
  );
  if (inlineMode) {
    return <div className="w-full">{contentNode}</div>;
  }

  const copyMemoUid = (uid: string) => {
    copy(uid);
    toast.success('Copied memo UID to clipboard');
  };

  return (
    <div className="relative flex w-full flex-col items-start justify-start rounded-lg border border-gray-200 bg-zinc-50 px-3 py-2 hover:shadow dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-1 flex w-full flex-row items-center justify-between text-gray-400 dark:text-gray-500">
        <div className="select-none text-sm leading-5">
          <relative-time
            datetime={memo.displayTime?.toISOString()}
            format="datetime"
          />
        </div>
        <div className="flex items-center justify-end gap-1">
          <span
            className="cursor-pointer text-xs leading-5 opacity-60 hover:opacity-80"
            onClick={() => copyMemoUid(memo.uid)}
          >
            {memo.uid.slice(0, 6)}
          </span>
          <Link
            className="opacity-60 hover:opacity-80"
            to={`/m/${memo.uid}`}
            viewTransition
          >
            <ArrowUpRightIcon className="h-auto w-5" />
          </Link>
        </div>
      </div>
      {contentNode}
    </div>
  );
};

export default EmbeddedMemo;

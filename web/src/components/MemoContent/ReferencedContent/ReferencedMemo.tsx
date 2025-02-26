import useLoading from '@/hooks/useLoading';
import useNavigateTo from '@/hooks/useNavigateTo';
import { useMemoStore } from '@/store/v1';
import { useEffect } from 'react';
import Error from './Error';

interface Props {
  resourceId: string;
  params: string;
}

const ReferencedMemo = ({ resourceId: uid, params: paramsStr }: Props) => {
  const navigateTo = useNavigateTo();
  const loadingState = useLoading();
  const memoStore = useMemoStore();
  const memo = memoStore.getMemoByUid(uid);
  const params = new URLSearchParams(paramsStr);

  useEffect(() => {
    memoStore.fetchMemoByUid(uid).finally(() => loadingState.setFinish());
  }, [uid]);

  if (loadingState.isLoading) {
    return null;
  }
  if (!memo) {
    return <Error message={`Memo not found: ${uid}`} />;
  }

  const paramsText = params.has('text') ? params.get('text') : undefined;
  const displayContent =
    paramsText ||
    (memo.snippet.length > 12
      ? `${memo.snippet.slice(0, 12)}...`
      : memo.snippet);

  const handleGotoMemoDetailPage = () => {
    navigateTo(`/m/${memo.uid}`);
  };

  return (
    <span
      className="cursor-pointer whitespace-nowrap break-all text-blue-600 underline decoration-1 hover:opacity-80 dark:text-blue-400"
      onClick={handleGotoMemoDetailPage}
    >
      {displayContent}
    </span>
  );
};

export default ReferencedMemo;

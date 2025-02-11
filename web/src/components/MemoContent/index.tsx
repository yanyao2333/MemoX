import useCurrentUser from '@/hooks/useCurrentUser';
import { useMemoStore } from '@/store/v1';
import { type Node, NodeType } from '@/types/proto/api/v1/markdown_service';
import { useTranslate } from '@/utils/i18n';
import { isSuperUser } from '@/utils/user';
import clsx from 'clsx';
import { memo, useEffect, useRef, useState } from 'react';
import Renderer from './Renderer';
import { RendererContext } from './types';

// MAX_DISPLAY_HEIGHT is the maximum height of the memo content to display in compact mode.
const MAX_DISPLAY_HEIGHT = 256;

interface Props {
  nodes: Node[];
  memoName?: string;
  compact?: boolean;
  readonly?: boolean;
  disableFilter?: boolean;
  // embeddedMemos is a set of memo resource names that are embedded in the current memo.
  // This is used to prevent infinite loops when a memo embeds itself.
  embeddedMemos?: Set<string>;
  className?: string;
  contentClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

type ContentCompactView = 'ALL' | 'SNIPPET';

const MemoContent: React.FC<Props> = (props: Props) => {
  const {
    className,
    contentClassName,
    nodes,
    memoName,
    embeddedMemos,
    onClick,
    onDoubleClick,
  } = props;
  const t = useTranslate();
  const currentUser = useCurrentUser();
  const memoStore = useMemoStore();
  const memoContentContainerRef = useRef<HTMLDivElement>(null);
  const [showCompactMode, setShowCompactMode] = useState<
    ContentCompactView | undefined
  >(undefined);
  const memo = memoName ? memoStore.getMemoByName(memoName) : null;
  const allowEdit =
    !props.readonly &&
    memo &&
    (currentUser?.name === memo.creator || isSuperUser(currentUser));

  // Initial compact mode.
  useEffect(() => {
    if (!props.compact) {
      return;
    }
    if (!memoContentContainerRef.current) {
      return;
    }

    if (
      (
        memoContentContainerRef.current as HTMLDivElement
      ).getBoundingClientRect().height > MAX_DISPLAY_HEIGHT
    ) {
      setShowCompactMode('ALL');
    }
  }, []);

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleMemoContentDoubleClick = async (e: React.MouseEvent) => {
    if (onDoubleClick) {
      onDoubleClick(e);
    }
  };

  let prevNode: Node | null = null;
  let skipNextLineBreakFlag = false;
  const compactStates = {
    ALL: { text: t('memo.show-more'), nextState: 'SNIPPET' },
    SNIPPET: { text: t('memo.show-less'), nextState: 'ALL' },
  };

  return (
    <RendererContext.Provider
      value={{
        nodes,
        memoName: memoName,
        readonly: !allowEdit,
        disableFilter: props.disableFilter,
        embeddedMemos: embeddedMemos || new Set(),
      }}
    >
      <div
        className={`flex w-full flex-col items-start justify-start text-gray-800 dark:text-gray-400 ${className || ''}`}
      >
        <div
          ref={memoContentContainerRef}
          className={clsx(
            'word-break relative w-full max-w-full space-y-2 whitespace-pre-wrap text-base leading-snug',
            showCompactMode === 'ALL' && 'line-clamp-6 max-h-60',
            contentClassName
          )}
          onClick={handleMemoContentClick}
          onDoubleClick={handleMemoContentDoubleClick}
        >
          {nodes.map((node, index) => {
            if (
              prevNode?.type !== NodeType.LINE_BREAK &&
              node.type === NodeType.LINE_BREAK &&
              skipNextLineBreakFlag
            ) {
              skipNextLineBreakFlag = false;
              return null;
            }
            prevNode = node;
            skipNextLineBreakFlag = true;
            return (
              <Renderer
                key={`${node.type}-${index}`}
                index={String(index)}
                node={node}
              />
            );
          })}
          {showCompactMode === 'ALL' && (
            <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-full bg-gradient-to-b from-transparent to-white dark:to-zinc-800" />
          )}
        </div>
        {showCompactMode !== undefined && (
          <div className="mt-1 w-full">
            <span
              className="flex w-auto cursor-pointer flex-row items-center justify-start text-blue-600 text-sm hover:opacity-80 dark:text-blue-400"
              onClick={() => {
                setShowCompactMode(
                  compactStates[showCompactMode].nextState as ContentCompactView
                );
              }}
            >
              {compactStates[showCompactMode].text}
            </span>
          </div>
        )}
      </div>
    </RendererContext.Provider>
  );
};

export default memo(MemoContent);

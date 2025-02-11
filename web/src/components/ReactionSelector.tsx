import { memoServiceClient } from '@/grpcweb';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useMemoStore, useWorkspaceSettingStore } from '@/store/v1';
import type { Memo } from '@/types/proto/api/v1/memo_service';
import { WorkspaceMemoRelatedSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { Dropdown, Menu, MenuButton } from '@mui/joy';
import clsx from 'clsx';
import { SmilePlusIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import useClickAway from 'react-use/lib/useClickAway';

interface Props {
  memo: Memo;
  className?: string;
}

const ReactionSelector = (props: Props) => {
  const { memo, className } = props;
  const currentUser = useCurrentUser();
  const memoStore = useMemoStore();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceMemoRelatedSetting =
    workspaceSettingStore.getWorkspaceSettingByKey(
      WorkspaceSettingKey.MEMO_RELATED
    )?.memoRelatedSetting || WorkspaceMemoRelatedSetting.fromPartial({});

  useClickAway(containerRef, () => {
    setOpen(false);
  });

  const hasReacted = (reactionType: string) => {
    return memo.reactions.some(
      (r) => r.reactionType === reactionType && r.creator === currentUser?.name
    );
  };

  const handleReactionClick = async (reactionType: string) => {
    try {
      if (hasReacted(reactionType)) {
        const reactions = memo.reactions.filter(
          (reaction) =>
            reaction.reactionType === reactionType &&
            reaction.creator === currentUser.name
        );
        for (const reaction of reactions) {
          await memoServiceClient.deleteMemoReaction({
            reactionId: reaction.id,
          });
        }
      } else {
        await memoServiceClient.upsertMemoReaction({
          name: memo.name,
          reaction: {
            contentId: memo.name,
            reactionType: reactionType,
          },
        });
      }
      await memoStore.getOrFetchMemoByName(memo.name, { skipCache: true });
    } catch (_error) {
      // skip error.
    }
    setOpen(false);
  };

  return (
    <Dropdown open={open} onOpenChange={(_, isOpen) => setOpen(isOpen)}>
      <MenuButton slots={{ root: 'div' }}>
        <span
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded-full border hover:opacity-70 dark:border-zinc-700',
            className
          )}
        >
          <SmilePlusIcon className="mx-auto h-4 w-4 text-gray-500 dark:text-gray-400" />
        </span>
      </MenuButton>
      <Menu
        className="relative"
        component="div"
        size="sm"
        placement="bottom-start"
      >
        <div ref={containerRef}>
          <div className="flex h-auto max-w-56 flex-row flex-wrap gap-1 px-2 py-0.5">
            {workspaceMemoRelatedSetting.reactions.map((reactionType) => {
              return (
                <span
                  key={reactionType}
                  className={clsx(
                    'inline-flex w-auto cursor-pointer rounded px-1 text-base text-gray-500 hover:opacity-80 dark:text-gray-400',
                    hasReacted(reactionType) && 'bg-blue-100 dark:bg-zinc-800'
                  )}
                  onClick={() => handleReactionClick(reactionType)}
                >
                  {reactionType}
                </span>
              );
            })}
          </div>
        </div>
      </Menu>
    </Dropdown>
  );
};

export default ReactionSelector;

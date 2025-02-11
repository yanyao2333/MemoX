import { markdownServiceClient } from '@/grpcweb';
import { useWorkspaceSettingStore } from '@/store/v1';
import type { LinkMetadata } from '@/types/proto/api/v1/markdown_service';
import { WorkspaceMemoRelatedSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { Link as MLink, Tooltip } from '@mui/joy';
import { useState } from 'react';

interface Props {
  url: string;
  text?: string;
}

const getFaviconWithGoogleS2 = (url: string) => {
  try {
    const urlObject = new URL(url);
    return `https://www.google.com/s2/favicons?sz=128&domain=${urlObject.hostname}`;
  } catch (_error) {
    return undefined;
  }
};

const Link: React.FC<Props> = ({ text, url }: Props) => {
  const workspaceSettingStore = useWorkspaceSettingStore();
  const workspaceMemoRelatedSetting =
    workspaceSettingStore.getWorkspaceSettingByKey(
      WorkspaceSettingKey.MEMO_RELATED
    ).memoRelatedSetting || WorkspaceMemoRelatedSetting.fromPartial({});
  const [initialized, setInitialized] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [linkMetadata, setLinkMetadata] = useState<LinkMetadata | undefined>();

  const handleMouseEnter = async () => {
    if (!workspaceMemoRelatedSetting.enableLinkPreview) {
      return;
    }

    setShowTooltip(true);
    if (!initialized) {
      try {
        const linkMetadata = await markdownServiceClient.getLinkMetadata({
          link: url,
        });
        setLinkMetadata(linkMetadata);
      } catch (_error) {}
      setInitialized(true);
    }
  };

  return (
    <Tooltip
      variant="outlined"
      title={
        linkMetadata && (
          <div className="flex w-full max-w-64 flex-col p-1 sm:max-w-96">
            <div className="flex w-full flex-row items-center justify-start gap-1">
              <img
                className="h-5 w-5 rounded"
                src={getFaviconWithGoogleS2(url)}
                alt={linkMetadata?.title}
              />
              <h3 className="truncate text-base dark:opacity-90">
                {linkMetadata?.title}
              </h3>
            </div>
            {linkMetadata.description && (
              <p className="mt-1 line-clamp-3 w-full text-sm leading-snug opacity-80">
                {linkMetadata.description}
              </p>
            )}
          </div>
        )
      }
      open={showTooltip}
      arrow
    >
      <MLink underline="always" target="_blank" href={url}>
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {text || url}
        </span>
      </MLink>
    </Tooltip>
  );
};

export default Link;

import type { Resource } from '@/types/proto/api/v1/resource_service';
import { getResourceUrl } from '@/utils/resource';
import ResourceIcon from './ResourceIcon';

interface Props {
  resource: Resource;
  className?: string;
}

const MemoResource: React.FC<Props> = (props: Props) => {
  const { className, resource } = props;
  const resourceUrl = getResourceUrl(resource);

  const handlePreviewBtnClick = () => {
    window.open(resourceUrl);
  };

  return (
    <div
      className={`flex w-auto flex-row items-center justify-start text-gray-500 hover:opacity-80 dark:text-gray-400 ${className}`}
    >
      {resource.type.startsWith('audio') ? (
        <audio src={resourceUrl} controls />
      ) : (
        <>
          <ResourceIcon className="!w-4 !h-4 mr-1" resource={resource} />
          <span
            className="max-w-[256px] cursor-pointer truncate text-sm"
            onClick={handlePreviewBtnClick}
          >
            {resource.filename}
          </span>
        </>
      )}
    </div>
  );
};

export default MemoResource;

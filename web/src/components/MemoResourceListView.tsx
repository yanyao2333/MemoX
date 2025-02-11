import type { Resource } from '@/types/proto/api/v1/resource_service';
import { getResourceType, getResourceUrl } from '@/utils/resource';
import { memo } from 'react';
import MemoResource from './MemoResource';
import showPreviewImageDialog from './PreviewImageDialog';
import SquareDiv from './kit/SquareDiv';

const MemoResourceListView = ({
  resources = [],
}: { resources: Resource[] }) => {
  const mediaResources: Resource[] = [];
  const otherResources: Resource[] = [];

  resources.forEach((resource) => {
    const type = getResourceType(resource);
    if (type === 'image/*' || type === 'video/*') {
      mediaResources.push(resource);
      return;
    }

    otherResources.push(resource);
  });

  const handleImageClick = (imgUrl: string) => {
    const imgUrls = mediaResources
      .filter((resource) => getResourceType(resource) === 'image/*')
      .map((resource) => getResourceUrl(resource));
    const index = imgUrls.findIndex((url) => url === imgUrl);
    showPreviewImageDialog(imgUrls, index);
  };

  const MediaCard = ({ resource }: { resource: Resource }) => {
    const type = getResourceType(resource);
    const resourceUrl = getResourceUrl(resource);

    if (type === 'image/*') {
      return (
        <img
          className="min-h-full w-auto cursor-pointer object-cover"
          src={
            resource.externalLink
              ? resourceUrl
              : `${resourceUrl}?thumbnail=true`
          }
          onClick={() => handleImageClick(resourceUrl)}
          decoding="async"
          loading="lazy"
        />
      );
    }
    if (type === 'video/*') {
      return (
        <video
          className="h-full w-full cursor-pointer bg-zinc-100 object-contain dark:bg-zinc-800"
          preload="metadata"
          crossOrigin="anonymous"
          src={resourceUrl}
          controls
        />
      );
    }
    return <></>;
  };

  const MediaList = ({ resources = [] }: { resources: Resource[] }) => {
    if (resources.length === 0) {
      return <></>;
    }

    if (resources.length === 1) {
      return (
        <div className="hide-scrollbar flex max-w-full items-center justify-center overflow-hidden rounded border hover:shadow-md dark:border-zinc-800">
          <MediaCard resource={mediaResources[0]} />
        </div>
      );
    }

    const cards = resources.map((resource) => (
      <SquareDiv
        key={resource.name}
        className="hide-scrollbar flex items-center justify-center overflow-hidden rounded border hover:shadow-md dark:border-zinc-900"
      >
        <MediaCard resource={resource} />
      </SquareDiv>
    ));

    if (resources.length === 2 || resources.length === 4) {
      return <div className="grid w-full grid-cols-2 gap-2">{cards}</div>;
    }

    return (
      <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
        {cards}
      </div>
    );
  };

  const OtherList = ({ resources = [] }: { resources: Resource[] }) => {
    if (resources.length === 0) {
      return <></>;
    }

    return (
      <div className="flex w-full flex-row flex-wrap justify-start gap-2">
        {otherResources.map((resource) => (
          <MemoResource key={resource.name} resource={resource} />
        ))}
      </div>
    );
  };

  return (
    <>
      <MediaList resources={mediaResources} />
      <OtherList resources={otherResources} />
    </>
  );
};

export default memo(MemoResourceListView);

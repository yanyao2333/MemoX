import type { Resource } from '@/types/proto/api/v1/resource_service';
import { getResourceType, getResourceUrl } from '@/utils/resource';
import clsx from 'clsx';
import {
  BinaryIcon,
  BookIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileEditIcon,
  FileIcon,
  FileTextIcon,
  FileVideo2Icon,
  SheetIcon,
} from 'lucide-react';
import React from 'react';
import showPreviewImageDialog from './PreviewImageDialog';
import SquareDiv from './kit/SquareDiv';

interface Props {
  resource: Resource;
  className?: string;
  strokeWidth?: number;
}

const ResourceIcon = (props: Props) => {
  const { resource } = props;
  const resourceType = getResourceType(resource);
  const resourceUrl = getResourceUrl(resource);
  const className = clsx('h-auto w-full', props.className);
  const strokeWidth = props.strokeWidth;

  const previewResource = () => {
    window.open(resourceUrl);
  };

  if (resourceType === 'image/*') {
    return (
      <SquareDiv
        className={clsx(
          className,
          'flex items-center justify-center overflow-clip'
        )}
      >
        <img
          className="min-h-full min-w-full object-cover"
          src={
            resource.externalLink
              ? resourceUrl
              : `${resourceUrl}?thumbnail=true`
          }
          onClick={() => showPreviewImageDialog(resourceUrl)}
          decoding="async"
          loading="lazy"
        />
      </SquareDiv>
    );
  }

  const getResourceIcon = () => {
    switch (resourceType) {
      case 'video/*':
        return (
          <FileVideo2Icon strokeWidth={strokeWidth} className="h-auto w-full" />
        );
      case 'audio/*':
        return (
          <FileAudioIcon strokeWidth={strokeWidth} className="h-auto w-full" />
        );
      case 'text/*':
        return (
          <FileTextIcon strokeWidth={strokeWidth} className="h-auto w-full" />
        );
      case 'application/epub+zip':
        return <BookIcon strokeWidth={strokeWidth} className="h-auto w-full" />;
      case 'application/pdf':
        return <BookIcon strokeWidth={strokeWidth} className="h-auto w-full" />;
      case 'application/msword':
        return (
          <FileEditIcon strokeWidth={strokeWidth} className="h-auto w-full" />
        );
      case 'application/msexcel':
        return (
          <SheetIcon strokeWidth={strokeWidth} className="h-auto w-full" />
        );
      case 'application/zip':
        return (
          <FileArchiveIcon
            onClick={previewResource}
            strokeWidth={strokeWidth}
            className="h-auto w-full"
          />
        );
      case 'application/x-java-archive':
        return (
          <BinaryIcon strokeWidth={strokeWidth} className="h-auto w-full" />
        );
      default:
        return <FileIcon strokeWidth={strokeWidth} className="h-auto w-full" />;
    }
  };

  return (
    <div
      onClick={previewResource}
      className={clsx(className, 'max-w-[4rem] opacity-50')}
    >
      {getResourceIcon()}
    </div>
  );
};

export default React.memo(ResourceIcon);

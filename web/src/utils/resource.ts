import type { Resource } from '@/types/proto/api/v1/resource_service';

export const getResourceUrl = (resource: Resource) => {
  if (resource.externalLink) {
    return resource.externalLink;
  }

  return `${window.location.origin}/file/${resource.name}/${resource.filename}`;
};

export const getResourceType = (resource: Resource) => {
  if (isImage(resource.type)) {
    return 'image/*';
  }
  if (resource.type.startsWith('video')) {
    return 'video/*';
  }
  if (resource.type.startsWith('audio')) {
    return 'audio/*';
  }
  if (resource.type.startsWith('text')) {
    return 'text/*';
  }
  if (resource.type.startsWith('application/epub+zip')) {
    return 'application/epub+zip';
  }
  if (resource.type.startsWith('application/pdf')) {
    return 'application/pdf';
  }
  if (resource.type.includes('word')) {
    return 'application/msword';
  }
  if (resource.type.includes('excel')) {
    return 'application/msexcel';
  }
  if (resource.type.startsWith('application/zip')) {
    return 'application/zip';
  }
  if (resource.type.startsWith('application/x-java-archive')) {
    return 'application/x-java-archive';
  }
  return 'application/octet-stream';
};

// isImage returns true if the given mime type is an image.
export const isImage = (t: string) => {
  // Don't show PSDs as images.
  return t.startsWith('image/') && !isPSD(t);
};

const isPSD = (t: string) => {
  return (
    t === 'image/vnd.adobe.photoshop' ||
    t === 'image/x-photoshop' ||
    t === 'image/photoshop'
  );
};

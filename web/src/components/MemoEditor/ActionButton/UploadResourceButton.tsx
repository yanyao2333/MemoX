import { useResourceStore } from '@/store/v1';
import { Resource } from '@/types/proto/api/v1/resource_service';
import { Button } from '@usememos/mui';
import { PaperclipIcon } from 'lucide-react';
import { useContext, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { MemoEditorContext } from '../types';

interface State {
  uploadingFlag: boolean;
}

const UploadResourceButton = () => {
  const context = useContext(MemoEditorContext);
  const resourceStore = useResourceStore();
  const [state, setState] = useState<State>({
    uploadingFlag: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = async () => {
    if (
      !fileInputRef.current ||
      !fileInputRef.current.files ||
      fileInputRef.current.files.length === 0
    ) {
      return;
    }
    if (state.uploadingFlag) {
      return;
    }

    setState((state) => {
      return {
        ...state,
        uploadingFlag: true,
      };
    });

    const createdResourceList: Resource[] = [];
    try {
      if (!fileInputRef.current || !fileInputRef.current.files) {
        return;
      }
      for (const file of fileInputRef.current.files) {
        const { name: filename, size, type } = file;
        const buffer = new Uint8Array(await file.arrayBuffer());
        const resource = await resourceStore.createResource({
          resource: Resource.fromPartial({
            filename,
            size,
            type,
            content: buffer,
          }),
        });
        createdResourceList.push(resource);
      }
    } catch (error: any) {
      toast.error(error.details);
    }

    context.setResourceList([...context.resourceList, ...createdResourceList]);
    setState((state) => {
      return {
        ...state,
        uploadingFlag: false,
      };
    });
  };

  return (
    <Button
      className="relative"
      size="sm"
      variant="plain"
      disabled={state.uploadingFlag}
    >
      <PaperclipIcon className="mx-auto h-5 w-5" />
      <input
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        ref={fileInputRef}
        disabled={state.uploadingFlag}
        onChange={handleFileInputChange}
        type="file"
        id="files"
        multiple={true}
        accept="*"
      />
    </Button>
  );
};

export default UploadResourceButton;

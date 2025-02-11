import { memoServiceClient } from '@/grpcweb';
import useCurrentUser from '@/hooks/useCurrentUser';
import useLoading from '@/hooks/useLoading';
import { useMemoMetadataStore } from '@/store/v1';
import { useTranslate } from '@/utils/i18n';
import { List, ListItem } from '@mui/joy';
import { Button, Input } from '@usememos/mui';
import { XIcon } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { generateDialog } from './Dialog';

interface Props extends DialogProps {
  tag: string;
}

const RenameTagDialog: React.FC<Props> = (props: Props) => {
  const { tag, destroy } = props;
  const t = useTranslate();
  const memoMetadataStore = useMemoMetadataStore();
  const [newName, setNewName] = useState(tag);
  const requestState = useLoading(false);
  const user = useCurrentUser();

  const handleTagNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value.trim());
  };

  const handleConfirm = async () => {
    if (!newName || newName.includes(' ')) {
      toast.error('Tag name cannot be empty or contain spaces');
      return;
    }
    if (newName === tag) {
      toast.error('New name cannot be the same as the old name');
      return;
    }

    try {
      await memoServiceClient.renameMemoTag({
        parent: 'memos/-',
        oldTag: tag,
        newTag: newName,
      });
      toast.success('Rename tag successfully');
      memoMetadataStore.fetchMemoMetadata({ user });
    } catch (error: any) {
      toast.error(error.details);
    }
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">{'Rename tag'}</p>
        <Button size="sm" variant="plain" onClick={() => destroy()}>
          <XIcon className="h-auto w-5" />
        </Button>
      </div>
      <div className="dialog-content-container max-w-xs">
        <div className="mb-3 flex w-full flex-col items-start justify-start">
          <div className="relative mb-2 flex w-full flex-row items-center justify-start space-x-2">
            <span className="w-20 shrink-0 whitespace-nowrap text-right text-sm">
              Old Name
            </span>
            <Input
              className="w-full"
              readOnly
              disabled
              type="text"
              placeholder="A new tag name"
              value={tag}
            />
          </div>
          <div className="relative mb-2 flex w-full flex-row items-center justify-start space-x-2">
            <span className="w-20 shrink-0 whitespace-nowrap text-right text-sm">
              New Name
            </span>
            <Input
              className="w-full"
              type="text"
              placeholder="A new tag name"
              value={newName}
              onChange={handleTagNameInputChange}
            />
          </div>
          <List size="sm" marker="disc">
            <ListItem>
              <p className="leading-5">
                All your memos with this tag will be updated.
              </p>
            </ListItem>
          </List>
        </div>
        <div className="flex w-full flex-row items-center justify-end space-x-2">
          <Button
            variant="plain"
            disabled={requestState.isLoading}
            onClick={destroy}
          >
            {t('common.cancel')}
          </Button>
          <Button
            color="primary"
            disabled={requestState.isLoading}
            onClick={handleConfirm}
          >
            {t('common.confirm')}
          </Button>
        </div>
      </div>
    </>
  );
};

function showRenameTagDialog(props: Pick<Props, 'tag'>) {
  generateDialog(
    {
      className: 'rename-tag-dialog',
      dialogName: 'rename-tag-dialog',
    },
    RenameTagDialog,
    props
  );
}

export default showRenameTagDialog;

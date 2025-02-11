import { Divider, Option, Select } from '@mui/joy';
import { Button } from '@usememos/mui';
import { isEqual } from 'lodash-es';
import { LoaderIcon, SendIcon } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { memoServiceClient } from '@/grpcweb';
import { TAB_SPACE_WIDTH } from '@/helpers/consts';
import { isValidUrl } from '@/helpers/utils';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import useCurrentUser from '@/hooks/useCurrentUser';
import {
  useMemoStore,
  useResourceStore,
  useUserStore,
  useWorkspaceSettingStore,
} from '@/store/v1';
import {
  type MemoRelation,
  MemoRelation_Type,
} from '@/types/proto/api/v1/memo_relation_service';
import {
  type Location,
  type Memo,
  Visibility,
} from '@/types/proto/api/v1/memo_service';
import { Resource } from '@/types/proto/api/v1/resource_service';
import type { UserSetting } from '@/types/proto/api/v1/user_service';
import { WorkspaceMemoRelatedSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import {
  convertVisibilityFromString,
  convertVisibilityToString,
} from '@/utils/memo';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'react-use/lib/useLocalStorage';
import VisibilityIcon from '../VisibilityIcon';
import AddMemoRelationPopover from './ActionButton/AddMemoRelationPopover';
import LocationSelector from './ActionButton/LocationSelector';
import MarkdownMenu from './ActionButton/MarkdownMenu';
import TagSelector from './ActionButton/TagSelector';
import UploadResourceButton from './ActionButton/UploadResourceButton';
import Editor, { type EditorRefActions } from './Editor';
import RelationListView from './RelationListView';
import ResourceListView from './ResourceListView';
import {
  handleEditorKeydownWithMarkdownShortcuts,
  hyperlinkHighlightedText,
} from './handlers';
import { MemoEditorContext } from './types';

export interface Props {
  className?: string;
  cacheKey?: string;
  placeholder?: string;
  // The name of the memo to be edited.
  memoName?: string;
  // The name of the parent memo if the memo is a comment.
  parentMemoName?: string;
  autoFocus?: boolean;
  onConfirm?: (memoName: string) => void;
  onCancel?: () => void;
}

interface State {
  memoVisibility: Visibility;
  resourceList: Resource[];
  relationList: MemoRelation[];
  location: Location | undefined;
  isUploadingResource: boolean;
  isRequesting: boolean;
  isComposing: boolean;
}

const MemoEditor = (props: Props) => {
  const {
    className,
    cacheKey,
    memoName,
    parentMemoName,
    autoFocus,
    onConfirm,
    onCancel,
  } = props;
  const t = useTranslate();
  const { i18n } = useTranslation();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const userStore = useUserStore();
  const memoStore = useMemoStore();
  const resourceStore = useResourceStore();
  const currentUser = useCurrentUser();
  const [state, setState] = useState<State>({
    memoVisibility: Visibility.PRIVATE,
    resourceList: [],
    relationList: [],
    location: undefined,
    isUploadingResource: false,
    isRequesting: false,
    isComposing: false,
  });
  const [displayTime, setDisplayTime] = useState<Date | undefined>();
  const [hasContent, setHasContent] = useState<boolean>(false);
  const editorRef = useRef<EditorRefActions>(null);
  const userSetting = userStore.userSetting as UserSetting;
  const contentCacheKey = `${currentUser.name}-${cacheKey || ''}`;
  const [contentCache, setContentCache] = useLocalStorage<string>(
    contentCacheKey,
    ''
  );
  const referenceRelations = memoName
    ? state.relationList.filter(
        (relation) =>
          relation.memo?.name === memoName &&
          relation.relatedMemo?.name !== memoName &&
          relation.type === MemoRelation_Type.REFERENCE
      )
    : state.relationList.filter(
        (relation) => relation.type === MemoRelation_Type.REFERENCE
      );
  const workspaceMemoRelatedSetting =
    workspaceSettingStore.getWorkspaceSettingByKey(
      WorkspaceSettingKey.MEMO_RELATED
    )?.memoRelatedSetting || WorkspaceMemoRelatedSetting.fromPartial({});

  useEffect(() => {
    editorRef.current?.setContent(contentCache || '');
  }, []);

  useEffect(() => {
    if (autoFocus) {
      handleEditorFocus();
    }
  }, [autoFocus]);

  useEffect(() => {
    let visibility = userSetting.memoVisibility;
    if (
      workspaceMemoRelatedSetting.disallowPublicVisibility &&
      visibility === 'PUBLIC'
    ) {
      visibility = 'PRIVATE';
    }
    setState((prevState) => ({
      ...prevState,
      memoVisibility: convertVisibilityFromString(visibility),
    }));
  }, [
    userSetting.memoVisibility,
    workspaceMemoRelatedSetting.disallowPublicVisibility,
  ]);

  useAsyncEffect(async () => {
    if (!memoName) {
      return;
    }

    const memo = await memoStore.getOrFetchMemoByName(memoName);
    if (memo) {
      handleEditorFocus();
      setDisplayTime(memo.displayTime);
      setState((prevState) => ({
        ...prevState,
        memoVisibility: memo.visibility,
        resourceList: memo.resources,
        relationList: memo.relations,
        location: memo.location,
      }));
      if (!contentCache) {
        editorRef.current?.setContent(memo.content ?? '');
      }
    }
  }, [memoName]);

  const handleCompositionStart = () => {
    setState((prevState) => ({
      ...prevState,
      isComposing: true,
    }));
  };

  const handleCompositionEnd = () => {
    setState((prevState) => ({
      ...prevState,
      isComposing: false,
    }));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!editorRef.current) {
      return;
    }

    const isMetaKey = event.ctrlKey || event.metaKey;
    if (isMetaKey) {
      if (event.key === 'Enter') {
        void handleSaveBtnClick();
        return;
      }
      if (!workspaceMemoRelatedSetting.disableMarkdownShortcuts) {
        handleEditorKeydownWithMarkdownShortcuts(event, editorRef.current);
      }
    }
    if (event.key === 'Tab' && !state.isComposing) {
      event.preventDefault();
      const tabSpace = ' '.repeat(TAB_SPACE_WIDTH);
      const cursorPosition = editorRef.current.getCursorPosition();
      const selectedContent = editorRef.current.getSelectedContent();
      editorRef.current.insertText(tabSpace);
      if (selectedContent) {
        editorRef.current.setCursorPosition(cursorPosition + TAB_SPACE_WIDTH);
      }
      return;
    }
  };

  const handleMemoVisibilityChange = (visibility: Visibility) => {
    setState((prevState) => ({
      ...prevState,
      memoVisibility: visibility,
    }));
  };

  const handleSetResourceList = (resourceList: Resource[]) => {
    setState((prevState) => ({
      ...prevState,
      resourceList,
    }));
  };

  const handleSetRelationList = (relationList: MemoRelation[]) => {
    setState((prevState) => ({
      ...prevState,
      relationList,
    }));
  };

  const handleUploadResource = async (file: File) => {
    setState((state) => {
      return {
        ...state,
        isUploadingResource: true,
      };
    });

    const { name: filename, size, type } = file;
    const buffer = new Uint8Array(await file.arrayBuffer());

    try {
      const resource = await resourceStore.createResource({
        resource: Resource.fromPartial({
          filename,
          size,
          type,
          content: buffer,
        }),
      });
      setState((state) => {
        return {
          ...state,
          isUploadingResource: false,
        };
      });
      return resource;
    } catch (error: any) {
      toast.error(error.details);
    }
  };

  const uploadMultiFiles = async (files: FileList) => {
    const uploadedResourceList: Resource[] = [];
    for (const file of files) {
      const resource = await handleUploadResource(file);
      if (resource) {
        uploadedResourceList.push(resource);
        if (memoName) {
          await resourceStore.updateResource({
            resource: Resource.fromPartial({
              name: resource.name,
              memo: memoName,
            }),
            updateMask: ['memo'],
          });
        }
      }
    }
    if (uploadedResourceList.length > 0) {
      setState((prevState) => ({
        ...prevState,
        resourceList: [...prevState.resourceList, ...uploadedResourceList],
      }));
    }
  };

  const handleDropEvent = async (event: React.DragEvent) => {
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      event.preventDefault();
      await uploadMultiFiles(event.dataTransfer.files);
    }
  };

  const handlePasteEvent = async (event: React.ClipboardEvent) => {
    if (event.clipboardData && event.clipboardData.files.length > 0) {
      event.preventDefault();
      await uploadMultiFiles(event.clipboardData.files);
    } else if (
      editorRef.current != null &&
      editorRef.current.getSelectedContent().length !== 0 &&
      isValidUrl(event.clipboardData.getData('Text'))
    ) {
      event.preventDefault();
      hyperlinkHighlightedText(
        editorRef.current,
        event.clipboardData.getData('Text')
      );
    }
  };

  const handleContentChange = (content: string) => {
    setHasContent(content !== '');
    if (content !== '') {
      setContentCache(content);
    } else {
      localStorage.removeItem(contentCacheKey);
    }
  };

  const handleSaveBtnClick = async () => {
    if (state.isRequesting) {
      return;
    }

    setState((state) => {
      return {
        ...state,
        isRequesting: true,
      };
    });
    const content = editorRef.current?.getContent() ?? '';
    try {
      // Update memo.
      if (memoName) {
        const prevMemo = await memoStore.getOrFetchMemoByName(memoName);
        if (prevMemo) {
          const updateMask = ['content', 'visibility'];
          const memoPatch: Partial<Memo> = {
            name: prevMemo.name,
            content,
            visibility: state.memoVisibility,
          };
          if (!isEqual(displayTime, prevMemo.displayTime)) {
            updateMask.push('display_time');
            memoPatch.displayTime = displayTime;
          }
          if (!isEqual(state.resourceList, prevMemo.resources)) {
            updateMask.push('resources');
            memoPatch.resources = state.resourceList;
          }
          if (!isEqual(state.relationList, prevMemo.relations)) {
            updateMask.push('relations');
            memoPatch.relations = state.relationList;
          }
          if (!isEqual(state.location, prevMemo.location)) {
            updateMask.push('location');
            memoPatch.location = state.location;
          }
          const memo = await memoStore.updateMemo(memoPatch, updateMask);
          if (onConfirm) {
            onConfirm(memo.name);
          }
        }
      } else {
        // Create memo or memo comment.
        const request = parentMemoName
          ? memoServiceClient
              .createMemoComment({
                name: parentMemoName,
                comment: {
                  content,
                  visibility: state.memoVisibility,
                  resources: state.resourceList,
                  relations: state.relationList,
                  location: state.location,
                },
              })
              .then((memo) => memo)
          : memoStore.createMemo({
              content,
              visibility: state.memoVisibility,
              resources: state.resourceList,
              relations: state.relationList,
              location: state.location,
            });
        const memo = await request;
        if (onConfirm) {
          onConfirm(memo.name);
        }
      }
      editorRef.current?.setContent('');
    } catch (error: any) {
      toast.error(error.details);
    }

    localStorage.removeItem(contentCacheKey);
    setState((state) => {
      return {
        ...state,
        isRequesting: false,
        resourceList: [],
        relationList: [],
        location: undefined,
      };
    });
  };

  const handleCancelBtnClick = () => {
    localStorage.removeItem(contentCacheKey);

    if (onCancel) {
      onCancel();
    }
  };

  const handleEditorFocus = () => {
    editorRef.current?.focus();
  };

  const editorConfig = useMemo(
    () => ({
      className: '',
      initialContent: '',
      placeholder: props.placeholder ?? t('editor.any-thoughts'),
      onContentChange: handleContentChange,
      onPaste: handlePasteEvent,
    }),
    [i18n.language]
  );

  const allowSave =
    (hasContent || state.resourceList.length > 0) &&
    !state.isUploadingResource &&
    !state.isRequesting;

  return (
    <MemoEditorContext.Provider
      value={{
        resourceList: state.resourceList,
        relationList: state.relationList,
        setResourceList: (resourceList: Resource[]) => {
          setState((prevState) => ({
            ...prevState,
            resourceList,
          }));
        },
        setRelationList: (relationList: MemoRelation[]) => {
          setState((prevState) => ({
            ...prevState,
            relationList,
          }));
        },
        memoName,
      }}
    >
      <div
        className={`${
          className ?? ''
        } relative flex w-full flex-col items-start justify-start rounded-lg border border-gray-200 bg-white px-4 pt-4 dark:border-zinc-700 dark:bg-zinc-800`}
        onKeyDown={handleKeyDown}
        onDrop={handleDropEvent}
        onFocus={handleEditorFocus}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      >
        {memoName && displayTime && (
          <DatePicker
            selected={displayTime}
            onChange={(date) => date && setDisplayTime(date)}
            showTimeSelect
            customInput={
              <span className="cursor-pointer text-gray-400 text-sm dark:text-gray-500">
                {displayTime.toLocaleString()}
              </span>
            }
            calendarClassName="ml-24 sm:ml-44"
          />
        )}
        <Editor ref={editorRef} {...editorConfig} />
        <ResourceListView
          resourceList={state.resourceList}
          setResourceList={handleSetResourceList}
        />
        <RelationListView
          relationList={referenceRelations}
          setRelationList={handleSetRelationList}
        />
        <div
          className="relative flex w-full flex-row items-center justify-between pt-2"
          onFocus={(e) => e.stopPropagation()}
        >
          <div className="-space-x-1 flex flex-row items-center justify-start opacity-80 dark:opacity-60">
            <TagSelector editorRef={editorRef} />
            <MarkdownMenu editorRef={editorRef} />
            <UploadResourceButton />
            <AddMemoRelationPopover editorRef={editorRef} />
            {workspaceMemoRelatedSetting.enableLocation && (
              <LocationSelector
                location={state.location}
                onChange={(location) =>
                  setState((prevState) => ({
                    ...prevState,
                    location,
                  }))
                }
              />
            )}
          </div>
        </div>
        <Divider className="!mt-2 opacity-40" />
        <div className="flex w-full flex-row items-center justify-between gap-2 overflow-auto py-3 dark:border-t-zinc-500">
          <div
            className="relative flex flex-row items-center justify-start"
            onFocus={(e) => e.stopPropagation()}
          >
            <Select
              className="!text-sm"
              variant="plain"
              size="md"
              value={state.memoVisibility}
              startDecorator={
                <VisibilityIcon visibility={state.memoVisibility} />
              }
              onChange={(_, visibility) => {
                if (visibility) {
                  handleMemoVisibilityChange(visibility);
                }
              }}
            >
              {[
                Visibility.PRIVATE,
                Visibility.PROTECTED,
                Visibility.PUBLIC,
              ].map((item) => (
                <Option
                  key={item}
                  value={item}
                  className="!text-sm whitespace-nowrap"
                >
                  {t(
                    `memo.visibility.${convertVisibilityToString(item).toLowerCase()}` as any
                  )}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex shrink-0 flex-row items-center justify-end gap-2">
            {props.onCancel && (
              <Button
                variant="plain"
                disabled={state.isRequesting}
                onClick={handleCancelBtnClick}
              >
                {t('common.cancel')}
              </Button>
            )}
            <Button
              color="primary"
              disabled={!allowSave || state.isRequesting}
              onClick={handleSaveBtnClick}
            >
              {t('editor.save')}
              {state.isRequesting ? (
                <LoaderIcon className="ml-1 h-auto w-4 animate-spin" />
              ) : (
                <SendIcon className="ml-1 h-auto w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </MemoEditorContext.Provider>
  );
};

export default MemoEditor;

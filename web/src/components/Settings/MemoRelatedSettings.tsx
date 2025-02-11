import {
  useWorkspaceSettingStore,
  workspaceSettingNamePrefix,
} from '@/store/v1';
import { Visibility } from '@/types/proto/api/v1/memo_service';
import { WorkspaceMemoRelatedSetting } from '@/types/proto/api/v1/workspace_setting_service';
import { WorkspaceSettingKey } from '@/types/proto/store/workspace_setting';
import { useTranslate } from '@/utils/i18n';
import {
  convertVisibilityFromString,
  convertVisibilityToString,
} from '@/utils/memo';
import { Chip, ChipDelete, Option, Select, Switch } from '@mui/joy';
import { Button, Input } from '@usememos/mui';
import { isEqual, uniq } from 'lodash-es';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import VisibilityIcon from '../VisibilityIcon';

const MemoRelatedSettings = () => {
  const t = useTranslate();
  const workspaceSettingStore = useWorkspaceSettingStore();
  const originalSetting = WorkspaceMemoRelatedSetting.fromPartial(
    workspaceSettingStore.getWorkspaceSettingByKey(
      WorkspaceSettingKey.MEMO_RELATED
    )?.memoRelatedSetting || {}
  );
  const [memoRelatedSetting, setMemoRelatedSetting] =
    useState<WorkspaceMemoRelatedSetting>(originalSetting);
  const [editingReaction, setEditingReaction] = useState<string>('');

  const updatePartialSetting = (
    partial: Partial<WorkspaceMemoRelatedSetting>
  ) => {
    const newWorkspaceMemoRelatedSetting =
      WorkspaceMemoRelatedSetting.fromPartial({
        ...memoRelatedSetting,
        ...partial,
      });
    setMemoRelatedSetting(newWorkspaceMemoRelatedSetting);
  };

  const upsertReaction = () => {
    if (!editingReaction) {
      return;
    }

    updatePartialSetting({
      reactions: uniq([
        ...memoRelatedSetting.reactions,
        editingReaction.trim(),
      ]),
    });
    setEditingReaction('');
  };

  const updateSetting = async () => {
    if (memoRelatedSetting.reactions.length === 0) {
      toast.error('Reactions must not be empty.');
      return;
    }

    try {
      await workspaceSettingStore.setWorkspaceSetting({
        name: `${workspaceSettingNamePrefix}${WorkspaceSettingKey.MEMO_RELATED}`,
        memoRelatedSetting,
      });
    } catch (error: any) {
      toast.error(error.details);
      return;
    }
    toast.success(t('message.update-succeed'));
  };

  return (
    <div className="flex w-full flex-col gap-2 pt-2 pb-4">
      <p className="font-medium text-gray-700 dark:text-gray-500">
        {t('setting.memo-related-settings.title')}
      </p>
      <div className="flex w-full flex-row items-center justify-between">
        <span>{t('setting.system-section.disable-public-memos')}</span>
        <Switch
          checked={memoRelatedSetting.disallowPublicVisibility}
          onChange={(event) =>
            updatePartialSetting({
              disallowPublicVisibility: event.target.checked,
            })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span>{t('setting.system-section.display-with-updated-time')}</span>
        <Switch
          checked={memoRelatedSetting.displayWithUpdateTime}
          onChange={(event) =>
            updatePartialSetting({
              displayWithUpdateTime: event.target.checked,
            })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span>{t('setting.system-section.enable-auto-compact')}</span>
        <Switch
          checked={memoRelatedSetting.enableAutoCompact}
          onChange={(event) =>
            updatePartialSetting({ enableAutoCompact: event.target.checked })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span>{t('setting.memo-related-settings.enable-link-preview')}</span>
        <Switch
          checked={memoRelatedSetting.enableLinkPreview}
          onChange={(event) =>
            updatePartialSetting({ enableLinkPreview: event.target.checked })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span>{t('setting.memo-related-settings.enable-memo-comments')}</span>
        <Switch
          checked={memoRelatedSetting.enableComment}
          onChange={(event) =>
            updatePartialSetting({ enableComment: event.target.checked })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span>{t('setting.memo-related-settings.enable-memo-location')}</span>
        <Switch
          checked={memoRelatedSetting.enableLocation}
          onChange={(event) =>
            updatePartialSetting({ enableLocation: event.target.checked })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span>{t('setting.system-section.enable-double-click-to-edit')}</span>
        <Switch
          checked={memoRelatedSetting.enableDoubleClickEdit}
          onChange={(event) =>
            updatePartialSetting({
              enableDoubleClickEdit: event.target.checked,
            })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span>
          {t('setting.system-section.disable-markdown-shortcuts-in-editor')}
        </span>
        <Switch
          checked={memoRelatedSetting.disableMarkdownShortcuts}
          onChange={(event) =>
            updatePartialSetting({
              disableMarkdownShortcuts: event.target.checked,
            })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span>{t('setting.memo-related-settings.content-lenght-limit')}</span>
        <Input
          className="w-24"
          type="number"
          defaultValue={memoRelatedSetting.contentLengthLimit}
          onBlur={(event) =>
            updatePartialSetting({
              contentLengthLimit: Number(event.target.value),
            })
          }
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <span className="truncate">
          {t('setting.preference-section.default-memo-visibility')}
        </span>
        <Select
          className="!min-w-fit"
          value={memoRelatedSetting.defaultVisibility}
          startDecorator={
            <VisibilityIcon
              visibility={convertVisibilityFromString(
                memoRelatedSetting.defaultVisibility
              )}
            />
          }
          onChange={(_, visibility) => {
            updatePartialSetting({
              defaultVisibility: visibility || Visibility.PRIVATE,
            });
          }}
        >
          {[Visibility.PRIVATE, Visibility.PROTECTED, Visibility.PUBLIC]
            .map((v) => convertVisibilityToString(v))
            .map((item) => (
              <Option key={item} value={item} className="whitespace-nowrap">
                {t(
                  `memo.visibility.${item.toLowerCase() as Lowercase<typeof item>}`
                )}
              </Option>
            ))}
        </Select>
      </div>
      <div className="w-full">
        <span className="truncate">
          {t('setting.memo-related-settings.reactions')}
        </span>
        <div className="mt-2 flex w-full flex-row flex-wrap gap-1">
          {memoRelatedSetting.reactions.map((reactionType) => {
            return (
              <Chip
                className="!h-8"
                key={reactionType}
                variant="outlined"
                size="lg"
                endDecorator={
                  <ChipDelete
                    onDelete={() =>
                      updatePartialSetting({
                        reactions: memoRelatedSetting.reactions.filter(
                          (r) => r !== reactionType
                        ),
                      })
                    }
                  />
                }
              >
                {reactionType}
              </Chip>
            );
          })}
          <Input
            className="!rounded-full !pl-3 w-32"
            placeholder="Input"
            size="sm"
            value={editingReaction}
            onChange={(event) => setEditingReaction(event.target.value.trim())}
            endDecorator={
              <CheckIcon
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-teal-600 dark:text-gray-400"
                onClick={() => upsertReaction()}
              />
            }
          />
        </div>
      </div>
      <div className="mt-2 flex w-full justify-end">
        <Button
          color="primary"
          disabled={isEqual(memoRelatedSetting, originalSetting)}
          onClick={updateSetting}
        >
          {t('common.save')}
        </Button>
      </div>
    </div>
  );
};

export default MemoRelatedSettings;

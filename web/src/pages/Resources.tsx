import Empty from '@/components/Empty';
import MobileHeader from '@/components/MobileHeader';
import ResourceIcon from '@/components/ResourceIcon';
import { resourceServiceClient } from '@/grpcweb';
import useLoading from '@/hooks/useLoading';
import i18n from '@/i18n';
import { useMemoStore } from '@/store/v1';
import type { Resource } from '@/types/proto/api/v1/resource_service';
import { useTranslate } from '@/utils/i18n';
import { Divider, Tooltip } from '@mui/joy';
import { Button, Input } from '@usememos/mui';
import dayjs from 'dayjs';
import { includes } from 'lodash-es';
import { PaperclipIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

function groupResourcesByDate(resources: Resource[]) {
  const grouped = new Map<string, Resource[]>();
  resources
    .sort((a, b) => dayjs(b.createTime).unix() - dayjs(a.createTime).unix())
    .forEach((item) => {
      const monthStr = dayjs(item.createTime).format('YYYY-MM');
      if (!grouped.has(monthStr)) {
        grouped.set(monthStr, []);
      }
      grouped.get(monthStr)?.push(item);
    });
  return grouped;
}

interface State {
  searchQuery: string;
}

const Resources = () => {
  const t = useTranslate();
  const loadingState = useLoading();
  const [state, setState] = useState<State>({
    searchQuery: '',
  });
  const memoStore = useMemoStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const filteredResources = resources.filter((resource) =>
    includes(resource.filename, state.searchQuery)
  );
  const groupedResources = groupResourcesByDate(
    filteredResources.filter((resource) => resource.memo)
  );
  const unusedResources = filteredResources.filter(
    (resource) => !resource.memo
  );

  useEffect(() => {
    resourceServiceClient.listResources({}).then(({ resources }) => {
      setResources(resources);
      loadingState.setFinish();
      Promise.all(
        resources.map((resource) =>
          resource.memo ? memoStore.getOrFetchMemoByName(resource.memo) : null
        )
      );
    });
  }, []);

  const handleDeleteUnusedResources = async () => {
    const confirmed = window.confirm(
      'Are you sure to delete all unused resources? This action cannot be undone.'
    );
    if (confirmed) {
      for (const resource of unusedResources) {
        await resourceServiceClient.deleteResource({ name: resource.name });
      }
      setResources(resources.filter((resource) => resource.memo));
    }
  };

  return (
    <section className="@container flex min-h-full w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
      <MobileHeader />
      <div className="w-full px-4 sm:px-6">
        <div className="flex w-full flex-col items-start justify-start rounded-xl bg-white px-4 py-3 text-black shadow dark:bg-zinc-800 dark:text-gray-300">
          <div className="relative flex w-full flex-row items-center justify-between">
            <p className="flex select-none flex-row items-center justify-start py-1 opacity-80">
              <PaperclipIcon className="mr-1 h-auto w-6 opacity-80" />
              <span className="text-lg">{t('common.resources')}</span>
            </p>
            <div>
              <Input
                className="max-w-[8rem]"
                placeholder={t('common.search')}
                startDecorator={<SearchIcon className="h-auto w-4" />}
                value={state.searchQuery}
                onChange={(e) =>
                  setState({ ...state, searchQuery: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-4 mb-6 flex w-full flex-col items-start justify-start">
            {loadingState.isLoading ? (
              <div className="flex h-32 w-full flex-col items-center justify-center">
                <p className="my-6 mt-8 w-full text-center text-base">
                  {t('resource.fetching-data')}
                </p>
              </div>
            ) : (
              <>
                {filteredResources.length === 0 ? (
                  <div className="mt-8 mb-8 flex w-full flex-col items-center justify-center italic">
                    <Empty />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      {t('message.no-data')}
                    </p>
                  </div>
                ) : (
                  <div
                    className={
                      'flex h-auto w-full flex-col items-start justify-start gap-y-8 px-2'
                    }
                  >
                    {Array.from(groupedResources.entries()).map(
                      ([monthStr, resources]) => {
                        return (
                          <div
                            key={monthStr}
                            className="flex w-full flex-row items-start justify-start"
                          >
                            <div className="flex w-16 flex-col items-start justify-start pt-4 sm:w-24 sm:pl-4">
                              <span className="text-sm opacity-60">
                                {dayjs(monthStr).year()}
                              </span>
                              <span className="font-medium text-xl">
                                {dayjs(monthStr)
                                  .toDate()
                                  .toLocaleString(i18n.language, {
                                    month: 'short',
                                  })}
                              </span>
                            </div>
                            <div className="flex w-full max-w-[calc(100%-4rem)] flex-row flex-wrap items-start justify-start gap-4 sm:max-w-[calc(100%-6rem)]">
                              {resources.map((resource) => {
                                return (
                                  <div
                                    key={resource.name}
                                    className="flex h-auto w-24 flex-col items-start justify-start sm:w-32"
                                  >
                                    <div className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-clip rounded-xl border hover:opacity-80 hover:shadow sm:h-32 sm:w-32 dark:border-zinc-900">
                                      <ResourceIcon
                                        resource={resource}
                                        strokeWidth={0.5}
                                      />
                                    </div>
                                    <div className="mt-1 flex w-full max-w-full flex-row items-center justify-between px-1">
                                      <p className="shrink truncate text-gray-400 text-xs">
                                        {resource.filename}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                    )}

                    {unusedResources.length > 0 && (
                      <>
                        <Divider />
                        <div className="flex w-full flex-row items-start justify-start">
                          <div className="flex w-16 flex-col items-start justify-start sm:w-24 sm:pl-4" />
                          <div className="flex w-full max-w-[calc(100%-4rem)] flex-row flex-wrap items-start justify-start gap-4 sm:max-w-[calc(100%-6rem)]">
                            <div className="flex w-full flex-row items-center justify-start gap-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Unused resources
                              </span>
                              <span className="text-gray-500 opacity-80 dark:text-gray-500">
                                ({unusedResources.length})
                              </span>
                              <Tooltip title="Delete all" placement="top">
                                <Button
                                  size="sm"
                                  variant="plain"
                                  onClick={handleDeleteUnusedResources}
                                >
                                  <TrashIcon className="h-auto w-4 opacity-60" />
                                </Button>
                              </Tooltip>
                            </div>
                            {unusedResources.map((resource) => {
                              return (
                                <div
                                  key={resource.name}
                                  className="flex h-auto w-24 flex-col items-start justify-start sm:w-32"
                                >
                                  <div className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-clip rounded-xl border hover:opacity-80 hover:shadow sm:h-32 sm:w-32 dark:border-zinc-900">
                                    <ResourceIcon
                                      resource={resource}
                                      strokeWidth={0.5}
                                    />
                                  </div>
                                  <div className="mt-1 flex w-full max-w-full flex-row items-center justify-between px-1">
                                    <p className="shrink truncate text-gray-400 text-xs">
                                      {resource.filename}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;

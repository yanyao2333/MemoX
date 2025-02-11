import type { Resource } from '@/types/proto/api/v1/resource_service';
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { XIcon } from 'lucide-react';
import ResourceIcon from '../ResourceIcon';
import SortableItem from './SortableItem';

interface Props {
  resourceList: Resource[];
  setResourceList: (resourceList: Resource[]) => void;
}

const ResourceListView = (props: Props) => {
  const { resourceList, setResourceList } = props;
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDeleteResource = async (name: string) => {
    setResourceList(resourceList.filter((resource) => resource.name !== name));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = resourceList.findIndex(
        (resource) => resource.name === active.id
      );
      const newIndex = resourceList.findIndex(
        (resource) => resource.name === over.id
      );

      setResourceList(arrayMove(resourceList, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={resourceList.map((resource) => resource.name)}
        strategy={verticalListSortingStrategy}
      >
        {resourceList.length > 0 && (
          <div className="mt-2 flex max-h-[50vh] w-full flex-row flex-wrap justify-start gap-2 overflow-y-auto">
            {resourceList.map((resource) => {
              return (
                <div
                  key={resource.name}
                  className="flex w-auto max-w-full flex-row flex-nowrap items-center justify-start gap-x-1 rounded bg-zinc-100 px-2 py-1 text-gray-500 hover:shadow-sm dark:bg-zinc-900 dark:text-gray-400"
                >
                  <SortableItem
                    id={resource.name}
                    className="flex flex-row items-center justify-start gap-x-1"
                  >
                    <ResourceIcon
                      resource={resource}
                      className="!w-4 !h-4 !opacity-100"
                    />
                    <span className="max-w-[8rem] truncate text-sm">
                      {resource.filename}
                    </span>
                  </SortableItem>
                  <button
                    className="shrink-0"
                    onClick={() => handleDeleteResource(resource.name)}
                  >
                    <XIcon className="h-auto w-4 cursor-pointer opacity-60 hover:opacity-100" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </SortableContext>
    </DndContext>
  );
};

export default ResourceListView;

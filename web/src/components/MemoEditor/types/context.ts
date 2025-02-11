import type { MemoRelation } from '@/types/proto/api/v1/memo_relation_service';
import type { Resource } from '@/types/proto/api/v1/resource_service';
import { createContext } from 'react';

interface Context {
  resourceList: Resource[];
  relationList: MemoRelation[];
  setResourceList: (resourceList: Resource[]) => void;
  setRelationList: (relationList: MemoRelation[]) => void;
  memoName?: string;
}

export const MemoEditorContext = createContext<Context>({
  resourceList: [],
  relationList: [],
  setResourceList: () => {},
  setRelationList: () => {},
});

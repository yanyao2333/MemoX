import type { Node } from '@/types/proto/api/v1/markdown_service';
import { createContext } from 'react';

interface Context {
  nodes: Node[];
  // embeddedMemos is a set of memo resource names that are embedded in the current memo.
  // This is used to prevent infinite loops when a memo embeds itself.
  embeddedMemos: Set<string>;
  memoName?: string;
  readonly?: boolean;
  disableFilter?: boolean;
}

export const RendererContext = createContext<Context>({
  nodes: [],
  embeddedMemos: new Set(),
});

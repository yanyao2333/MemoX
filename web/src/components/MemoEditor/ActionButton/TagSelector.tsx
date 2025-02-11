import OverflowTip from '@/components/kit/OverflowTip';
import { useMemoTagList } from '@/store/v1';
import { useTranslate } from '@/utils/i18n';
import { Dropdown, Menu, MenuButton } from '@mui/joy';
import { Button } from '@usememos/mui';
import { HashIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import useClickAway from 'react-use/lib/useClickAway';
import type { EditorRefActions } from '../Editor';

interface Props {
  editorRef: React.RefObject<EditorRefActions>;
}

const TagSelector = (props: Props) => {
  const t = useTranslate();
  const { editorRef } = props;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tags = Object.entries(useMemoTagList())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  useClickAway(containerRef, () => {
    setOpen(false);
  });

  const handleTagClick = (tag: string) => {
    const current = editorRef.current;
    if (current === null) {
      return;
    }

    const line = current.getLine(current.getCursorLineNumber());
    const lastCharOfLine = line.slice(-1);

    if (lastCharOfLine !== ' ' && lastCharOfLine !== '　' && line !== '') {
      current.insertText('\n');
    }
    current.insertText(`#${tag} `);
  };

  return (
    <Dropdown open={open} onOpenChange={(_, isOpen) => setOpen(isOpen)}>
      <MenuButton slots={{ root: 'div' }}>
        <Button size="sm" variant="plain">
          <HashIcon className="mx-auto h-5 w-5" />
        </Button>
      </MenuButton>
      <Menu
        className="relative"
        component="div"
        size="sm"
        placement="bottom-start"
      >
        <div ref={containerRef}>
          {tags.length > 0 ? (
            <div className="flex h-auto max-h-48 max-w-[12rem] flex-row flex-wrap items-start justify-start gap-x-2 gap-y-1 overflow-y-auto px-3 py-1">
              {tags.map((tag) => {
                return (
                  <div
                    key={tag}
                    className="inline-flex w-auto max-w-full cursor-pointer text-base text-gray-500 leading-6 hover:text-primary dark:text-gray-400 dark:hover:text-primary-dark"
                    onClick={() => handleTagClick(tag)}
                  >
                    <OverflowTip>#{tag}</OverflowTip>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mx-2 italic" onClick={(e) => e.stopPropagation()}>
              {t('tag.no-tag-found')}
            </p>
          )}
        </div>
      </Menu>
    </Dropdown>
  );
};

export default TagSelector;

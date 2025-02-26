import OverflowTip from '@/components/kit/OverflowTip';
import { useMemoTagList } from '@/store/v1';
import clsx from 'clsx';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';
import getCaretCoordinates from 'textarea-caret';
import type { EditorRefActions } from '.';

type Props = {
  editorRef: React.RefObject<HTMLTextAreaElement>;
  editorActions: React.ForwardedRef<EditorRefActions>;
};

type Position = { left: number; top: number; height: number };

const TagSuggestions = ({ editorRef, editorActions }: Props) => {
  const [position, setPosition] = useState<Position | null>(null);
  const [selected, select] = useState(0);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const tags = Object.entries(useMemoTagList())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);

  const hide = () => setPosition(null);

  const getCurrentWord = (): [word: string, startIndex: number] => {
    const editor = editorRef.current;
    if (!editor) {
      return ['', 0];
    }
    const cursorPos = editor.selectionEnd;
    const before = editor.value.slice(0, cursorPos).match(/\S*$/) || {
      0: '',
      index: cursorPos,
    };
    const after = editor.value.slice(cursorPos).match(/^\S*/) || { 0: '' };
    return [before[0] + after[0], before.index ?? cursorPos];
  };

  const suggestionsRef = useRef<string[]>([]);
  suggestionsRef.current = (() => {
    const search = getCurrentWord()[0].slice(1).toLowerCase();
    const fuse = new Fuse(tags);
    return fuse.search(search).map((result) => result.item);
  })();

  const isVisibleRef = useRef(false);
  isVisibleRef.current = !!(position && suggestionsRef.current.length > 0);

  const autocomplete = (tag: string) => {
    if (
      !editorActions ||
      !('current' in editorActions) ||
      !editorActions.current
    ) {
      return;
    }
    const [word, index] = getCurrentWord();
    editorActions.current.removeText(index, word.length);
    editorActions.current.insertText(`#${tag}`);
    hide();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isVisibleRef.current) {
      return;
    }
    const suggestions = suggestionsRef.current;
    const selected = selectedRef.current;
    if (['Escape', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      hide();
    }
    if (e.code === 'ArrowDown') {
      select((selected + 1) % suggestions.length);
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.code === 'ArrowUp') {
      select((selected - 1 + suggestions.length) % suggestions.length);
      e.preventDefault();
      e.stopPropagation();
    }
    if (['Enter', 'Tab'].includes(e.code)) {
      autocomplete(suggestions[selected]);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleInput = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    select(0);
    const [word, index] = getCurrentWord();
    const currentChar = editor.value[editor.selectionEnd];
    const isActive = word.startsWith('#') && currentChar !== '#';

    const caretCordinates = getCaretCoordinates(editor, index);
    caretCordinates.top -= editor.scrollTop;
    isActive ? setPosition(caretCordinates) : hide();
  };

  const listenersAreRegisteredRef = useRef(false);
  const registerListeners = () => {
    const editor = editorRef.current;
    if (!editor || listenersAreRegisteredRef.current) {
      return;
    }
    editor.addEventListener('click', hide);
    editor.addEventListener('blur', hide);
    editor.addEventListener('keydown', handleKeyDown);
    editor.addEventListener('input', handleInput);
    listenersAreRegisteredRef.current = true;
  };
  useEffect(registerListeners, [!!editorRef.current]);

  if (!isVisibleRef.current || !position) {
    return null;
  }
  return (
    <div
      className="-ml-2 absolute z-20 mt-1 flex max-w-[12rem] flex-col items-start justify-start gap-px overflow-auto rounded bg-zinc-100 p-1 font-mono shadow dark:bg-zinc-700"
      style={{ left: position.left, top: position.top + position.height }}
    >
      {suggestionsRef.current.map((tag, i) => (
        <div
          key={tag}
          onMouseDown={() => autocomplete(tag)}
          className={clsx(
            'w-full cursor-pointer truncate rounded p-1 px-2 text-sm hover:bg-zinc-200 dark:text-gray-300 dark:hover:bg-zinc-800',
            i === selected ? 'bg-zinc-300 dark:bg-zinc-600' : ''
          )}
        >
          <OverflowTip>#{tag}</OverflowTip>
        </div>
      ))}
    </div>
  );
};

export default TagSuggestions;

import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import hljs from 'highlight.js';
import { CopyIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import MermaidBlock from './MermaidBlock';
import type { BaseProps } from './types';

// Special languages that are rendered differently.
enum SpecialLanguage {
  HTML = '__html',
  MERMAID = 'mermaid',
}

interface Props extends BaseProps {
  language: string;
  content: string;
}

const CodeBlock: React.FC<Props> = ({ language, content }: Props) => {
  const formatedLanguage = useMemo(
    () => (language || '').toLowerCase() || 'text',
    [language]
  );

  // Users can set Markdown code blocks as `__html` to render HTML directly.
  if (formatedLanguage === SpecialLanguage.HTML) {
    return (
      <div
        className="!my-2 w-full overflow-auto"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    );
  }
  if (formatedLanguage === SpecialLanguage.MERMAID) {
    return <MermaidBlock content={content} />;
  }

  const highlightedCode = useMemo(() => {
    try {
      const lang = hljs.getLanguage(formatedLanguage);
      if (lang) {
        return hljs.highlight(content, {
          language: formatedLanguage,
        }).value;
      }
    } catch (_error) {
      // Skip error and use default highlighted code.
    }

    // Escape any HTML entities when rendering original content.
    return Object.assign(document.createElement('span'), {
      textContent: content,
    }).innerHTML;
  }, [formatedLanguage, content]);

  const handleCopyButtonClick = useCallback(() => {
    copy(content);
    toast.success('Copied to clipboard!');
  }, [content]);

  return (
    <div className="relative my-1 w-full rounded border-amber-400 border-l-4 bg-amber-100 hover:shadow dark:border-zinc-400 dark:bg-zinc-600">
      <div className="flex w-full flex-row items-center justify-between px-2 py-1 text-amber-500 dark:text-zinc-400">
        <span className="font-mono text-sm">{formatedLanguage}</span>
        <CopyIcon
          className="h-auto w-4 cursor-pointer hover:opacity-80"
          onClick={handleCopyButtonClick}
        />
      </div>

      <div className="overflow-auto">
        <pre
          className={clsx(
            'no-wrap overflow-auto',
            'relative w-full bg-amber-50 p-2 dark:bg-zinc-700'
          )}
        >
          <code
            className={clsx(
              `language-${formatedLanguage}`,
              'block text-sm leading-5'
            )}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;

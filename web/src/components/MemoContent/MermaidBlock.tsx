import { useEffect, useRef } from 'react';

interface Props {
  content: string;
}

const MermaidBlock: React.FC<Props> = ({ content }: Props) => {
  const mermaidDockBlock = useRef<null>(null);

  useEffect(() => {
    // Dynamically import mermaid to ensure compatibility with Vite
    const initializeMermaid = async () => {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({ startOnLoad: false, theme: 'default' });
      if (mermaidDockBlock.current) {
        mermaid.run({
          nodes: [mermaidDockBlock.current],
        });
      }
    };

    initializeMermaid();
  }, [content]);

  return (
    <pre
      ref={mermaidDockBlock}
      className="relative w-full whitespace-pre-wrap p-2"
    >
      {content}
    </pre>
  );
};

export default MermaidBlock;

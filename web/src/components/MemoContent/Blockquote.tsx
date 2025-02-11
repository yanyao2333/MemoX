import type { Node } from '@/types/proto/api/v1/markdown_service';
import Renderer from './Renderer';
import type { BaseProps } from './types';

interface Props extends BaseProps {
  children: Node[];
}

const Blockquote: React.FC<Props> = ({ children }: Props) => {
  return (
    <blockquote className="rounded border-gray-300 border-s-4 bg-gray-50 p-2 dark:border-gray-500 dark:bg-zinc-700">
      {children.map((child, index) => (
        <Renderer
          key={`${child.type}-${index}`}
          index={String(index)}
          node={child}
        />
      ))}
    </blockquote>
  );
};

export default Blockquote;

import TeX from '@matejmazur/react-katex';
import clsx from 'clsx';
import 'katex/dist/katex.min.css';

interface Props {
  content: string;
  block?: boolean;
}

const Math: React.FC<Props> = ({ content, block }: Props) => {
  return (
    <TeX
      className={clsx('max-w-full', block ? 'block w-full' : 'inline text-sm')}
      block={block}
      math={content}
    />
  );
};

export default Math;

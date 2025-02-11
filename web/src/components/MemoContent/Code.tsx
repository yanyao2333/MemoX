interface Props {
  content: string;
}

const Code: React.FC<Props> = ({ content }: Props) => {
  return (
    <code className="inline break-all rounded bg-gray-100 px-1 font-mono text-sm opacity-80 dark:bg-zinc-700">
      {content}
    </code>
  );
};

export default Code;

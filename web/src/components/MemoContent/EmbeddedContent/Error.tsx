interface Props {
  message: string;
}

const Error = ({ message }: Props) => {
  return (
    <p className="font-mono text-red-600 text-sm dark:text-red-700">
      {message}
    </p>
  );
};

export default Error;

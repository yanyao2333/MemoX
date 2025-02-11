import clsx from 'clsx';

interface Props {
  avatarUrl?: string;
  className?: string;
}

const UserAvatar = (props: Props) => {
  const { avatarUrl, className } = props;
  return (
    <div className={clsx('h-8 w-8 overflow-clip rounded-xl', className)}>
      <img
        className="h-auto min-h-full w-full min-w-full object-cover shadow dark:opacity-80"
        src={avatarUrl || '/full-logo.webp'}
        decoding="async"
        loading="lazy"
        alt=""
      />
    </div>
  );
};

export default UserAvatar;

import { Visibility } from '@/types/proto/api/v1/memo_service';
import clsx from 'clsx';
import { Globe2Icon, LockIcon, UsersIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Props {
  visibility: Visibility;
  className?: string;
}

const VisibilityIcon = (props: Props) => {
  const { visibility } = props;

  let VIcon = null;
  if (visibility === Visibility.PRIVATE) {
    VIcon = LockIcon;
  } else if (visibility === Visibility.PROTECTED) {
    VIcon = UsersIcon;
  } else if (visibility === Visibility.PUBLIC) {
    VIcon = Globe2Icon;
  }
  if (!VIcon) {
    return null;
  }

  return (
    <VIcon
      className={twMerge(
        clsx('h-auto w-4 text-gray-500 dark:text-gray-400', props.className)
      )}
    />
  );
};

export default VisibilityIcon;

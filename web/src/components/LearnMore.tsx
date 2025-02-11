import { useTranslate } from '@/utils/i18n';
import { Tooltip } from '@mui/joy';
import { ExternalLinkIcon } from 'lucide-react';

interface Props {
  className?: string;
  url: string;
  title?: string;
}

const LearnMore: React.FC<Props> = (props: Props) => {
  const { className, url, title } = props;
  const t = useTranslate();

  return (
    <Tooltip title={title ?? t('common.learn-more')} placement="top">
      <a
        className={`text-gray-500 hover:text-blue-600 dark:text-gray-400 ${className}`}
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLinkIcon className="h-auto w-4" />
      </a>
    </Tooltip>
  );
};

export default LearnMore;

import { BirdIcon } from 'lucide-react';

const Empty = () => {
  return (
    <div className="mx-auto">
      <BirdIcon
        strokeWidth={0.5}
        absoluteStrokeWidth={true}
        className="h-auto w-24 text-gray-500 dark:text-gray-400"
      />
    </div>
  );
};

export default Empty;

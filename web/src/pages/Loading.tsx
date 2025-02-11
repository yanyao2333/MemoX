import { LoaderIcon } from 'lucide-react';

function Loading() {
  return (
    <div className="fixed flex h-full w-full flex-row items-center justify-center">
      <div className="flex h-full w-80 max-w-full flex-col items-center justify-center py-4">
        <LoaderIcon className="animate-spin dark:text-gray-200" />
      </div>
    </div>
  );
}

export default Loading;

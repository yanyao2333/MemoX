import MobileHeader from '@/components/MobileHeader';

const PermissionDenied = () => {
  return (
    <section className="@container flex min-h-[100svh] w-full max-w-5xl flex-col items-center justify-start pb-8 sm:pt-3 md:pt-6">
      <MobileHeader />
      <div className="flex w-full grow flex-col items-center justify-center px-4 sm:px-6">
        <p className="font-medium">Permission denied</p>
        <p className="mt-4 font-mono text-[8rem] dark:text-gray-300">403</p>
      </div>
    </section>
  );
};

export default PermissionDenied;

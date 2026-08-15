
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-slate-800 ${className}`} />
);

export const CardSkeleton = () => (
  <div className="flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden h-full">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-8 flex flex-col flex-grow">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-1/4 rounded-lg" />
      </div>
    </div>
  </div>
);

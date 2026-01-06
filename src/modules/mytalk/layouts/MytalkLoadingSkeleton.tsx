
const Skeleton = ({ className = "" }) => (
  <div className={`bg-muted-foreground/20 animate-pulse rounded-md ${className}`} />
);

const SkeletonCircle = ({ size = 40 }) => (
  <div
    className="rounded-full bg-muted-foreground/20 animate-pulse"
    style={{ width: size, height: size }}
  />
);

export function MytalkLoadingSkeleton() {
  return (
        <div className="flex h-screen w-screen overflow-hidden text-sm text-muted-foreground bg-background">
        <div className="w-80 h-full bg-muted px-4 py-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <SkeletonCircle size={40} />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-8 mt-4 overflow-y-auto">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <SkeletonCircle size={32} />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col px-8 py-6 gap-6 overflow-hidden">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="flex gap-3">
                <SkeletonCircle size={32} />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>

  )
}

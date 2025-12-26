import { Skeleton } from "@/components/ui/skeleton";

function MessageSkeleton() {
  return (
    <div className="p-5 flex-1 flex flex-col gap-y-3 border-t border-muted-foreground/20 sm:p-5 min-h-full overflow-y-auto scrollbar">
      <Skeleton className="w-40 h-14 animate-pulse bg-muted rounded-lg" /> 
      <Skeleton className="ml-auto w-40 h-14 animate-pulse bg-muted rounded-lg" /> 
      <Skeleton className="w-40 h-14 animate-pulse bg-muted rounded-lg" /> 
      <Skeleton className="ml-auto w-40 h-14 animate-pulse bg-muted rounded-lg" /> 
      <Skeleton className="ml-auto w-40 h-14 animate-pulse bg-muted rounded-lg" /> 
    </div>
  )
}

export default MessageSkeleton;

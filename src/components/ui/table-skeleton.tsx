import { cn } from "@/lib/utils"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn("w-full border rounded-md overflow-hidden", className)}>
      <div className="divide-y divide-border">
        {/* Cabeçalho fake */}
        <div
          className="grid bg-muted/30"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-10 flex items-center px-4 font-medium text-muted-foreground"
            >
              <div className="h-4 w-20 bg-muted-foreground/20 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Linhas fake */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid border-t border-border/50"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-10 flex items-center px-4"
              >
                <div className="h-3 w-full bg-muted-foreground/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}


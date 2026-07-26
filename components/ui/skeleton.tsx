import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  );
}

function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-5 rounded-[28px] bg-white p-6",
        className
      )}
    >
      {/* Image and Text Container */}
      <div className="flex w-full flex-col items-start gap-3.5">
        {/* Image Skeleton */}
        <Skeleton className="h-[200px] w-full rounded-[33px]" />

        {/* Title and Subtitle */}
        <div className="flex w-full flex-col items-start gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>

      {/* Price */}
      <Skeleton className="h-6 w-1/3" />

      {/* Button */}
      <Skeleton className="h-10 w-full rounded-[20px]" />
    </div>
  );
}

function ProductGridSkeleton({
  count = 9,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export { Skeleton, ProductCardSkeleton, ProductGridSkeleton };

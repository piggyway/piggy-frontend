export default function ShopAllLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 lg:py-16">
      <div className="bg-neutral-stroke mb-8 h-10 w-48 animate-pulse rounded-[16px]" />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="bg-neutral-stroke h-[160px] animate-pulse rounded-[20px] lg:h-[200px]" />
            <div className="bg-neutral-stroke h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-neutral-stroke h-4 w-1/3 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

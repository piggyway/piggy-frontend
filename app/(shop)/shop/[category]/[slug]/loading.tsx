export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 lg:py-16">
      <div className="bg-neutral-stroke mb-8 h-4 w-56 animate-pulse rounded" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="bg-neutral-stroke h-[360px] animate-pulse rounded-[24px] lg:h-[520px]" />
        <div className="flex flex-col gap-4">
          <div className="bg-neutral-stroke h-8 w-3/4 animate-pulse rounded" />
          <div className="bg-neutral-stroke h-6 w-1/3 animate-pulse rounded" />
          <div className="bg-neutral-stroke h-24 w-full animate-pulse rounded-[16px]" />
          <div className="bg-neutral-stroke h-[52px] w-full animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function BoardingAgreementLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5 px-4 pt-12 pb-24 sm:px-6">
      <Skeleton className="h-10 w-2/3 rounded-[12px]" />
      <Skeleton className="h-40 w-full rounded-[24px]" />
      <Skeleton className="h-64 w-full rounded-[24px]" />
    </div>
  );
}

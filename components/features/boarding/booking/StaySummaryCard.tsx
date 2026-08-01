interface StaySummaryCardProps {
  dropOff: string;
  pickUp: string;
  nights: string;
  pets: string;
  children: React.ReactNode;
}

export function StaySummaryCard({
  dropOff,
  pickUp,
  nights,
  pets,
  children,
}: StaySummaryCardProps) {
  const rows = [
    { label: "Drop-off", value: dropOff },
    { label: "Pick-up", value: pickUp },
    { label: "Nights", value: nights },
    { label: "Pets", value: pets },
  ];

  return (
    <div className="border-neutral-stroke flex flex-col gap-[18px] rounded-[24px] border bg-white px-7 py-[26px]">
      <h2 className="text-primary-navy text-[20px] font-semibold">
        Stay summary
      </h2>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span className="text-subtle text-slate-600">{row.label}</span>
          <span className="text-subtle-medium text-primary-navy">
            {row.value}
          </span>
        </div>
      ))}

      <div className="bg-neutral-stroke h-px w-full" />

      <div className="bg-secondary-mint rounded-[12px] px-3.5 py-2.5">
        <p className="text-primary-navy text-[13px] font-medium">
          Final price confirmed after we review your request — no payment today.
        </p>
      </div>

      {children}
    </div>
  );
}

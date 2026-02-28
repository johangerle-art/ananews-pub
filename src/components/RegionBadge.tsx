/**
 * Tidszon/region-indikator
 * Grön indikator för aktiva regioner
 */

interface RegionBadgeProps {
  region: string;
  isActive?: boolean;
}

export default function RegionBadge({ region, isActive }: RegionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-[#22c55e]/20 text-[#22c55e]"
          : "bg-[#e8e8e8]/10 text-[#a0a0a0]"
      }`}
    >
      {isActive && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#22c55e]"
          aria-hidden
        />
      )}
      {region}
    </span>
  );
}

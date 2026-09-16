import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "blue" | "violet" | "teal" | "amber" | "rose";
}

const accentStyles: Record<string, string> = {
  blue: "bg-blue-600/15 text-blue-400",
  violet: "bg-violet-600/15 text-violet-400",
  teal: "bg-teal-600/15 text-teal-400",
  amber: "bg-amber-600/15 text-amber-400",
  rose: "bg-rose-600/15 text-rose-400",
};

export default function StatCard({ label, value, icon: Icon, accent = "blue" }: StatCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center gap-4">
      <div className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${accentStyles[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-sm text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "blue" | "violet" | "teal" | "amber" | "rose";
}

const accentStyles: Record<string, string> = {
  blue: "bg-accent-blue-bg text-accent-blue-text",
  violet: "bg-accent-violet-bg text-accent-violet-text",
  teal: "bg-accent-teal-bg text-accent-teal-text",
  amber: "bg-accent-amber-bg text-accent-amber-text",
  rose: "bg-accent-rose-bg text-accent-rose-text",
};

export default function StatCard({ label, value, icon: Icon, accent = "blue" }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
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
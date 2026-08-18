import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

type NavCardAccent = "blue" | "violet" | "teal" | "amber" | "rose";

const accentStyles: Record<NavCardAccent, { badge: string; border: string; glow: string }> = {
  blue: {
    badge: "bg-blue-600/15 text-blue-400",
    border: "hover:border-blue-500/60",
    glow: "group-hover:bg-blue-600/10",
  },
  violet: {
    badge: "bg-violet-600/15 text-violet-400",
    border: "hover:border-violet-500/60",
    glow: "group-hover:bg-violet-600/10",
  },
  teal: {
    badge: "bg-teal-600/15 text-teal-400",
    border: "hover:border-teal-500/60",
    glow: "group-hover:bg-teal-600/10",
  },
  amber: {
    badge: "bg-amber-600/15 text-amber-400",
    border: "hover:border-amber-500/60",
    glow: "group-hover:bg-amber-600/10",
  },
  rose: {
    badge: "bg-rose-600/15 text-rose-400",
    border: "hover:border-rose-500/60",
    glow: "group-hover:bg-rose-600/10",
  },
};

interface NavCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: NavCardAccent;
}

export default function NavCard({ to, icon: Icon, title, description, accent = "blue" }: NavCardProps) {
  const styles = accentStyles[accent];

  return (
    <Link
      to={to}
      className={`group relative overflow-hidden bg-gray-800 border border-gray-700 rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 ${styles.border}`}
    >
      {/* Soft radial glow that fades in on hover, sitting behind the content */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${styles.glow}`}
      />

      <div className={`mx-auto relative flex items-center justify-center w-14 h-14 rounded-xl transition-transform duration-300 group-hover:scale-105 ${styles.badge}`}>
        <Icon className="w-7 h-7" />
      </div>

      <div className="relative items-center justify-between mx-auto">
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      </div>

      <div className="relative">
        <p className="text-sm leading-relaxed text-gray-400">{description}</p>
      </div>

      <div className="relative mt-auto flex items-center gap-1.5 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
        Open
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

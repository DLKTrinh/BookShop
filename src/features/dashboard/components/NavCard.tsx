import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

type NavCardAccent = "blue" | "violet" | "teal" | "amber" | "rose";

const accentStyles: Record<NavCardAccent, { badge: string; border: string; glow: string }> = {
  blue: {
    badge: "bg-accent-blue-bg text-accent-blue-text",
    border: "hover:border-accent-blue-text/60",
    glow: "group-hover:bg-accent-blue-bg",
  },
  violet: {
    badge: "bg-accent-violet-bg text-accent-violet-text",
    border: "hover:border-accent-violet-text/60",
    glow: "group-hover:bg-accent-violet-bg",
  },
  teal: {
    badge: "bg-accent-teal-bg text-accent-teal-text",
    border: "hover:border-accent-teal-text/60",
    glow: "group-hover:bg-accent-teal-bg",
  },
  amber: {
    badge: "bg-accent-amber-bg text-accent-amber-text",
    border: "hover:border-accent-amber-text/60",
    glow: "group-hover:bg-accent-amber-bg",
  },
  rose: {
    badge: "bg-accent-rose-bg text-accent-rose-text",
    border: "hover:border-accent-rose-text/60",
    glow: "group-hover:bg-accent-rose-text/20",
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
      className={`group relative overflow-hidden bg-card border border-border rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 ${styles.border}`}
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
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      </div>

      <div className="relative">
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="relative mt-auto flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        Open
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
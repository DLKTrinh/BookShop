interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ title, children, className = "" }: ChartCardProps) {
  return (
    <div className={`bg-card border border-border rounded-xl p-5 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}
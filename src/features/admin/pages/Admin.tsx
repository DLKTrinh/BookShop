import Layout from "@/shared/components/Layout";
import { BookOpen, Copy, PackageX, Users, Feather, Building2, Tags } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Legend,
} from "recharts";
import { useAdminStats } from "../hooks/useAdminStats";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

// Chart token colors mapping directly to CSS Variables defined in index.css
const axisColor = "var(--muted-foreground)";
const gridColor = "var(--border)";
const tooltipStyle = {
  contentStyle: { 
    backgroundColor: "var(--card)", 
    borderColor: "var(--border)", 
    borderRadius: "var(--radius)",
    color: "var(--card-foreground)"
  },
  labelStyle: { color: "var(--card-foreground)" },
  itemStyle: { color: "var(--card-foreground)" },
};

// Recharts Pie Colors mapping to CSS theme variables
const PIE_COLORS = [
  "var(--chart-1)", 
  "var(--chart-2)", 
  "var(--chart-3)", 
  "var(--chart-4)", 
  "var(--chart-5)"
];

const Admin: React.FC = () => {
  const { data, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-muted-foreground animate-pulse">Loading statistics...</p>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-destructive">Failed to load statistics</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">An overview of everything in the database.</p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Books" value={data.overview.totalBooks} icon={BookOpen} accent="blue" />
          <StatCard label="Total Copies" value={data.overview.totalCopies} icon={Copy} accent="violet" />
          <StatCard label="Out of Stock" value={data.overview.outOfStock} icon={PackageX} accent="rose" />
          <StatCard label="Total Users" value={data.overview.totalUsers} icon={Users} accent="teal" />
          <StatCard label="Unique Authors" value={data.overview.uniqueAuthors} icon={Feather} accent="amber" />
          <StatCard label="Unique Publishers" value={data.overview.uniquePublishers} icon={Building2} accent="blue" />
          <StatCard label="Unique Subjects" value={data.overview.uniqueSubjects} icon={Tags} accent="violet" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Top Subjects" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.booksBySubject} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid stroke={gridColor} horizontal={false} />
                <XAxis type="number" stroke={axisColor} fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke={axisColor} fontSize={12} width={140} />
                <Tooltip {...tooltipStyle} cursor={false} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 4, 4, 0]} activeBar={{ fillOpacity: 0.8, stroke: "var(--chart-1)", strokeWidth: 2 }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Authors">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.booksByAuthor}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} interval={0} angle={-30} textAnchor="end" height={70} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip {...tooltipStyle} cursor={false} />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[4, 4, 0, 0]} activeBar={{ fillOpacity: 0.8, stroke: "var(--chart-2)", strokeWidth: 2 }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Publishers">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.booksByPublisher}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={11} interval={0} angle={-30} textAnchor="end" height={70} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip {...tooltipStyle} cursor={false} />
                <Bar dataKey="count" fill="var(--chart-3)" radius={[4, 4, 0, 0]} activeBar={{ fillOpacity: 0.8, stroke: "var(--chart-3)", strokeWidth: 2 }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Books by Decade">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.booksByDecade.map(d => ({ ...d, label: `${d.decade}s` }))}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip {...tooltipStyle} cursor={false} />
                <Bar dataKey="count" fill="var(--chart-4)" radius={[4, 4, 0, 0]} activeBar={{ fillOpacity: 0.8, stroke: "var(--chart-4)", strokeWidth: 2 }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Users by Role">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.usersByRole.map((d, i) => ({ ...d, fill: PIE_COLORS[i % PIE_COLORS.length] }))}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: axisColor, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Books Added Over Time" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.booksAddedOverTime}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Users Added Over Time" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.usersAddedOverTime}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="var(--chart-3)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
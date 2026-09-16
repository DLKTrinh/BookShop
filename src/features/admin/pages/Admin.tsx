import Layout from "@/shared/components/Layout";
import { BookOpen, Copy, PackageX, Users, Feather, Building2, Tags } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Legend,
} from "recharts";
import { useAdminStats } from "../hooks/useAdminStats";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

// Shared dark-theme styling for every chart's axes/grid/tooltip, so each
// chart doesn't repeat the same six props.
const axisColor = "#9ca3af"; // gray-400
const gridColor = "#374151"; // gray-700
const tooltipStyle = {
  contentStyle: { backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 8 },
  labelStyle: { color: "#e5e7eb" },
  itemStyle: { color: "#e5e7eb" },
};

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#14b8a6", "#f59e0b", "#f43f5e"];

const Admin: React.FC = () => {
  const { data, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-gray-300 animate-pulse">Loading statistics...</p>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-2xl text-red-400">Failed to load statistics</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">An overview of everything in the database.</p>
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
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} activeBar={{ fillOpacity: 0.8, stroke: "#3b82f6", strokeWidth: 2 }} />
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
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} activeBar={{ fillOpacity: 0.8, stroke: "#8b5cf6", strokeWidth: 2 }} />
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
                <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} activeBar={{ fillOpacity: 0.8, stroke: "#14b8a6", strokeWidth: 2 }} />
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
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} activeBar={{ fillOpacity: 0.8, stroke: "#f59e0b", strokeWidth: 2 }} />
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
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
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
                <Line type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
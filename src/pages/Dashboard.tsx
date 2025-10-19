import React from "react";
import Layout from "../components/Layout";

interface DashboardProps {
    username: string;
}

interface StatCardProps {
    title: string;
    value: string;
    color: "blue" | "green" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
    const colorClasses: Record<string, string> = {
        blue: "text-blue-400",
        green: "text-green-400",
        orange: "text-orange-400",
    };

    return (
        <div className="bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 border border-gray-700">
            <h3 className="text-gray-300 font-medium mb-2">{title}</h3>
            <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({username}) => {
    return (
        <Layout username={username}>
            <h2 className="text-xl font-semibold mb-3">Welcome, {username} 👋</h2>

            <p className="text-gray-400 mb-6">
                Here’s your book management dashboard. View stats, manage books, and track users easily.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
                <StatCard title="📖 Total Books" value="245" color="blue" />
                <StatCard title="👥 Active Users" value="92" color="green" />
                <StatCard title="⚙️ Pending Requests" value="8" color="orange" />
            </div>
        </Layout>
    );
};

export default Dashboard;

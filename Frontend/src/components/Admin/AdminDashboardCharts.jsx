import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Briefcase, Users } from "lucide-react";

const AdminDashboardCharts = ({ stats }) => {
  // Visual Mock Data for Job Performance matched from screenshot
  const barData = [
    { name: "Users", value: stats.totalUsers || 0 },
    { name: "Jobs", value: stats.totalJobs || 0 },
    { name: "Companies", value: stats.totalCompanies || 0 },
    { name: "Applications", value: stats.totalApplications || 0 },
  ];

  // Visual Mock Data for Global User Distribution matched from screenshot
  let pieData = [
    { name: "EMPLOYERS", value: stats.totalEmployers || 0 },
    { name: "JOBSEEKERS", value: stats.totalJobseekers || 0 },
  ].filter(d => d.value > 0);
  
  if (pieData.length === 0) pieData.push({ name: "NO DATA", value: 1 });

  const PIE_COLORS = ["#3b82f6", "#10b981", "#ef4444", "#9ca3af"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

      {/* BAR CHART */}
      <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col h-[400px]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Job Performance - Applications per Job</h2>
          <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
            <Briefcase size={20} />
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} barSize={40} margin={{ left: -20, bottom: 5 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
            <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col h-[400px]">
        <div className="flex justify-between items-center mb-0">
          <h2 className="text-lg font-bold text-gray-800">Global User Distribution</h2>
          <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
            <Users size={20} />
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={PIE_COLORS[index]} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
            <Legend 
               verticalAlign="bottom" 
               iconType="square" 
               wrapperStyle={{ fontSize: "11px", fontWeight: "bold", color: "#6b7280", letterSpacing: "1px" }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default AdminDashboardCharts;

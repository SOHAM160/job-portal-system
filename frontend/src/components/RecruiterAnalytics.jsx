import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { getRecruiterStats } from "../api";
import { Loader2, TrendingUp, Users, Briefcase, Target, Clock } from "lucide-react";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const RecruiterAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getRecruiterStats();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600 w-8 h-8" /></div>;
  if (!stats) return <div className="text-center p-10 text-slate-500">No data available yet. Start posting jobs to see analytics.</div>;

  const totalApps = stats.totalApplications || 0;
  const acceptedApps = stats.statusBreakdown.find(s => s._id === "Accepted")?.count || 0;
  const rejectedApps = stats.statusBreakdown.find(s => s._id === "Rejected")?.count || 0;
  const acceptanceRate = totalApps > 0 ? ((acceptedApps / totalApps) * 100).toFixed(1) : 0;
  const rejectionRate = totalApps > 0 ? ((rejectedApps / totalApps) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Jobs Posted" value={stats.totalJobs} icon={<Briefcase className="w-5 h-5" />} color="bg-blue-50 text-blue-600" />
        <StatCard title="Total Applications" value={stats.totalApplications} icon={<Users className="w-5 h-5" />} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Acceptance Rate" value={`${acceptanceRate}%`} icon={<Target className="w-5 h-5" />} color="bg-amber-50 text-amber-600" />
        <StatCard title="Rejection Rate" value={`${rejectionRate}%`} icon={<Clock className="w-5 h-5" />} color="bg-red-50 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications per Job */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" /> Applications per Job
          </h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.appsPerJob}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Target className="w-5 h-5 text-emerald-600" /> Application Status
          </h3>
          <div className="h-[300px] flex items-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={stats.statusBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                   {stats.statusBreakdown.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hiring Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Clock className="w-5 h-5 text-indigo-600" /> Hiring Trend (Weekly)
          </h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.hiringTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Top Required Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" /> Top Required Skills
           </h3>
           <div className="space-y-4">
              {stats.topSkills.map((skill, i) => (
                <div key={skill.name} className="space-y-1.5">
                   <div className="flex justify-between items-center text-xs font-bold uppercase">
                      <span className="text-slate-600">{skill.name}</span>
                      <span className="text-primary-600">{skill.value} Jobs</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(skill.value / stats.totalJobs) * 100}%` }} />
                   </div>
                </div>
              ))}
              {stats.topSkills.length === 0 && <p className="text-sm text-slate-500 text-center py-10">Define skills in your job posts to see this data.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

export default RecruiterAnalytics;

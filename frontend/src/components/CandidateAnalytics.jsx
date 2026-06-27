import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getCandidateStats } from "../api";
import { Loader2, TrendingUp, Target, Clock, Star } from "lucide-react";

const COLORS = ["#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

const CandidateAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getCandidateStats();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch candidate stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600 w-8 h-8" /></div>;
  if (!stats) return <div className="text-center p-10 text-slate-500">No application data yet. Start applying to see your insights.</div>;

  const total = stats.totalApplications || 0;
  const accepted = stats.statusBreakdown.find(s => s._id === "Accepted")?.count || 0;
  const successRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="p-3 rounded-xl bg-primary-50 text-primary-600"><TrendingUp className="w-5 h-5" /></div>
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Applications</p>
              <p className="text-2xl font-black text-slate-900">{total}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><Target className="w-5 h-5" /></div>
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
              <p className="text-2xl font-black text-slate-900">{successRate}%</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><Star className="w-5 h-5" /></div>
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Top Skills Demand</p>
              <p className="text-2xl font-black text-slate-900">{stats.topAppliedSkills?.[0]?.name || "N/A"}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" /> Application Activity (Last 7 Days)
          </h3>
          <div className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stats.applicationTrend}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                 <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={0.1} fill="#2563eb" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" /> Application Status
           </h3>
           <div className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={stats.statusBreakdown} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                   {stats.statusBreakdown.map((entry, index) => (
                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Most Required Skills in your target jobs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
         <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-600" /> Skills in Demand (Based on your applications)
         </h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.topAppliedSkills.map((skill, index) => (
              <div key={skill.name} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center transition-transform hover:scale-105">
                 <p className="text-lg font-black text-primary-600">{skill.value}</p>
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider truncate">{skill.name}</p>
              </div>
            ))}
            {stats.topAppliedSkills.length === 0 && <p className="col-span-full text-center text-slate-400 py-10">No skill data available.</p>}
         </div>
      </div>
    </div>
  );
};

export default CandidateAnalytics;

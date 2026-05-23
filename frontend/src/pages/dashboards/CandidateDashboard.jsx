import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  FileText,
  Bookmark,
  TrendingUp,
  Clock,
  CheckCircle2,
  Search,
  Bell,
} from "lucide-react";

const CandidateDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: "Applications Sent",
      value: "24",
      icon: <FileText className="w-5 h-5" />,
      change: "+3 this week",
      color: "from-primary-500 to-blue-500",
    },
    {
      label: "Interviews",
      value: "5",
      icon: <Clock className="w-5 h-5" />,
      change: "+2 scheduled",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Saved Jobs",
      value: "18",
      icon: <Bookmark className="w-5 h-5" />,
      change: "6 new matches",
      color: "from-accent-500 to-teal-500",
    },
    {
      label: "Profile Views",
      value: "142",
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+28% this month",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const recentApplications = [
    {
      company: "TechCorp Inc.",
      role: "Frontend Developer",
      status: "Interview",
      statusColor: "text-amber-400 bg-amber-400/10",
      date: "2 days ago",
    },
    {
      company: "DataFlow AI",
      role: "Full Stack Engineer",
      status: "Applied",
      statusColor: "text-blue-400 bg-blue-400/10",
      date: "3 days ago",
    },
    {
      company: "CloudBase",
      role: "React Developer",
      status: "Shortlisted",
      statusColor: "text-accent-400 bg-accent-400/10",
      date: "5 days ago",
    },
    {
      company: "InnovateTech",
      role: "UI Engineer",
      status: "Rejected",
      statusColor: "text-red-400 bg-red-400/10",
      date: "1 week ago",
    },
  ];

  const recommendedJobs = [
    { title: "Senior React Developer", company: "Meta", location: "Remote", salary: "$120k-$160k" },
    { title: "Full Stack Engineer", company: "Stripe", location: "San Francisco", salary: "$140k-$180k" },
    { title: "Frontend Developer", company: "Vercel", location: "Remote", salary: "$110k-$150k" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, <span className="gradient-text">{user?.name}</span> 👋
              </h1>
              <p className="text-surface-200/50 mt-1">
                Here's what's happening with your job search
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl glass hover:bg-white/5 transition-colors relative">
                <Bell className="w-5 h-5 text-surface-200/60" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-sm font-medium text-white hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-600/20">
                <Search className="w-4 h-4" />
                Find Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 hover:bg-white/5 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}
                >
                  {stat.icon}
                </div>
                <span className="text-[11px] text-accent-400 font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-surface-200/50 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {recentApplications.map((app, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600/20 to-primary-500/10 border border-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-400">
                      {app.company.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{app.role}</p>
                      <p className="text-xs text-surface-200/50">{app.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${app.statusColor}`}>
                      {app.status}
                    </span>
                    <span className="text-[11px] text-surface-200/40 hidden sm:block">{app.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Recommended</h2>
              <span className="text-[11px] text-accent-400 font-medium">AI Matched</span>
            </div>
            <div className="space-y-3">
              {recommendedJobs.map((job, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-colors group">
                  <p className="text-sm font-medium text-white group-hover:text-primary-300 transition-colors">
                    {job.title}
                  </p>
                  <p className="text-xs text-surface-200/50 mt-1">{job.company} · {job.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-accent-400 font-medium">{job.salary}</span>
                    <button className="text-[11px] text-primary-400 hover:text-primary-300 transition-colors">
                      Apply →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Search className="w-5 h-5" />, label: "Browse Jobs" },
              { icon: <FileText className="w-5 h-5" />, label: "My Resume" },
              { icon: <Bookmark className="w-5 h-5" />, label: "Saved Jobs" },
              { icon: <CheckCircle2 className="w-5 h-5" />, label: "Applications" },
            ].map((action, i) => (
              <button
                key={i}
                className="flex flex-col items-center gap-2 py-4 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-primary-500/30 transition-all duration-300 text-surface-200/60 hover:text-primary-400"
              >
                {action.icon}
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;

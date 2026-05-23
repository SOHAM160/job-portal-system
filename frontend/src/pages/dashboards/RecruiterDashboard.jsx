import { useAuth } from "../../context/AuthContext";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Plus,
  Clock,
  MapPin,
  DollarSign,
  Bell,
} from "lucide-react";

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: "Active Jobs",
      value: "12",
      icon: <Briefcase className="w-5 h-5" />,
      change: "+2 this week",
      color: "from-primary-500 to-blue-500",
    },
    {
      label: "Total Applicants",
      value: "348",
      icon: <Users className="w-5 h-5" />,
      change: "+45 new",
      color: "from-accent-500 to-teal-500",
    },
    {
      label: "Job Views",
      value: "2.4K",
      icon: <Eye className="w-5 h-5" />,
      change: "+12% this week",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Hire Rate",
      value: "68%",
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+5% this month",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const activePostings = [
    {
      title: "Senior Full Stack Developer",
      applicants: 42,
      views: 230,
      location: "Remote",
      salary: "$130k-$170k",
      posted: "3 days ago",
      status: "Active",
    },
    {
      title: "Product Designer",
      applicants: 28,
      views: 180,
      location: "New York",
      salary: "$100k-$140k",
      posted: "5 days ago",
      status: "Active",
    },
    {
      title: "DevOps Engineer",
      applicants: 15,
      views: 120,
      location: "San Francisco",
      salary: "$140k-$180k",
      posted: "1 week ago",
      status: "Active",
    },
    {
      title: "Mobile Developer (React Native)",
      applicants: 31,
      views: 195,
      location: "Remote",
      salary: "$110k-$150k",
      posted: "2 weeks ago",
      status: "Closing Soon",
    },
  ];

  const recentApplicants = [
    { name: "Alice Johnson", role: "Senior Full Stack Developer", time: "2h ago", match: "95%" },
    { name: "Bob Smith", role: "Product Designer", time: "4h ago", match: "88%" },
    { name: "Carol Davis", role: "DevOps Engineer", time: "6h ago", match: "92%" },
    { name: "David Lee", role: "Mobile Developer", time: "1d ago", match: "85%" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, <span className="gradient-text">{user?.name}</span> 🎯
              </h1>
              <p className="text-surface-200/50 mt-1">
                Manage your job postings and find top talent
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl glass hover:bg-white/5 transition-colors relative">
                <Bell className="w-5 h-5 text-surface-200/60" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-sm font-medium text-white hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-600/20">
                <Plus className="w-4 h-4" />
                Post a Job
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
          {/* Active Job Postings */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Active Job Postings</h2>
              <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                Manage all →
              </button>
            </div>
            <div className="space-y-3">
              {activePostings.map((posting, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-white">{posting.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-surface-200/50">
                          <MapPin className="w-3 h-3" /> {posting.location}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-surface-200/50">
                          <DollarSign className="w-3 h-3" /> {posting.salary}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                        posting.status === "Active"
                          ? "text-accent-400 bg-accent-400/10"
                          : "text-amber-400 bg-amber-400/10"
                      }`}
                    >
                      {posting.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4 text-[11px] text-surface-200/40">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {posting.applicants} applicants
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {posting.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {posting.posted}
                      </span>
                    </div>
                    <button className="text-[11px] text-primary-400 hover:text-primary-300 transition-colors">
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applicants */}
          <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Recent Applicants</h2>
              <span className="text-[11px] text-accent-400 font-medium">Today</span>
            </div>
            <div className="space-y-3">
              {recentApplicants.map((applicant, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-xs font-bold">
                    {applicant.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{applicant.name}</p>
                    <p className="text-[11px] text-surface-200/50 truncate">{applicant.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-accent-400">{applicant.match}</span>
                    <p className="text-[10px] text-surface-200/40">{applicant.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 text-xs text-surface-200/60 hover:text-primary-400 transition-all">
              View all applicants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

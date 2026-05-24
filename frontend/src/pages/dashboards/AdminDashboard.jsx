import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api";
import toast from "react-hot-toast";
import {
  Users,
  Briefcase,
  Shield,
  Trash2,
  Search,
  Bell,
  UserCheck,
  Building,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      if (data.success) setUsers(data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCandidates = users.filter((u) => u.role === "candidate").length;
  const totalRecruiters = users.filter((u) => u.role === "recruiter").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <Users className="w-5 h-5" />,
      color: "bg-primary-600",
    },
    {
      label: "Candidates",
      value: totalCandidates,
      icon: <UserCheck className="w-5 h-5" />,
      color: "bg-emerald-600",
    },
    {
      label: "Recruiters",
      value: totalRecruiters,
      icon: <Briefcase className="w-5 h-5" />,
      color: "bg-blue-600",
    },
    {
      label: "Admins",
      value: totalAdmins,
      icon: <Shield className="w-5 h-5" />,
      color: "bg-slate-800",
    },
  ];

  const getRoleBadge = (role) => {
    const styles = {
      candidate: "text-emerald-600 bg-emerald-50 border-emerald-100",
      recruiter: "text-blue-600 bg-blue-50 border-blue-100",
      admin: "text-slate-600 bg-slate-50 border-slate-100",
    };
    return styles[role] || "text-slate-400 bg-slate-50 border-slate-100";
  };

  return (
    <div className="min-h-screen pt-8 pb-10 px-4 bg-surface-100">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Admin Panel <span className="text-primary-600">({user?.name})</span>
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Manage users and monitor platform activity
              </p>
            </div>
            <button className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors relative shadow-sm">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-slate-200 card-shadow hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-xl border border-slate-200 card-shadow animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-bold text-slate-900">User Directory</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="admin-search"
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 h-10 text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Users className="w-8 h-8 opacity-20" />
              </div>
              <p className="font-bold">No users found</p>
              <p className="text-sm mt-1">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="text-left py-4 px-6">Identity</th>
                    <th className="text-left py-4 px-6">Email Address</th>
                    <th className="text-left py-4 px-6">Assigned Role</th>
                    <th className="text-left py-4 px-6">Joining Date</th>
                    <th className="text-right py-4 px-6">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600 font-black text-sm">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-600">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u._id !== user?._id && (
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-2 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            title="Remove account"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

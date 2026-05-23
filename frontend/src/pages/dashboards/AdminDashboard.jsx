import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../api";
import toast from "react-hot-toast";
import {
  Users,
  Briefcase,
  Shield,
  TrendingUp,
  Trash2,
  Search,
  Bell,
  UserCheck,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

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
      color: "from-primary-500 to-blue-500",
    },
    {
      label: "Candidates",
      value: totalCandidates,
      icon: <UserCheck className="w-5 h-5" />,
      color: "from-accent-500 to-teal-500",
    },
    {
      label: "Recruiters",
      value: totalRecruiters,
      icon: <Briefcase className="w-5 h-5" />,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Admins",
      value: totalAdmins,
      icon: <Shield className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const getRoleBadge = (role) => {
    const styles = {
      candidate: "text-blue-400 bg-blue-400/10",
      recruiter: "text-amber-400 bg-amber-400/10",
      admin: "text-purple-400 bg-purple-400/10",
    };
    return styles[role] || "text-surface-200/50 bg-white/5";
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Admin Panel <span className="gradient-text">({user?.name})</span> 🛡️
              </h1>
              <p className="text-surface-200/50 mt-1">
                Manage users, monitor platform activity
              </p>
            </div>
            <button className="p-2.5 rounded-xl glass hover:bg-white/5 transition-colors relative">
              <Bell className="w-5 h-5 text-surface-200/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
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
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-surface-200/50 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* User Management Table */}
        <div className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-lg font-semibold">User Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/30" />
              <input
                id="admin-search"
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-surface-200/30 focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-64"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-surface-200/40">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-medium text-surface-200/40 pb-3 pl-2">User</th>
                    <th className="text-left text-xs font-medium text-surface-200/40 pb-3">Email</th>
                    <th className="text-left text-xs font-medium text-surface-200/40 pb-3">Role</th>
                    <th className="text-left text-xs font-medium text-surface-200/40 pb-3">Joined</th>
                    <th className="text-right text-xs font-medium text-surface-200/40 pb-3 pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-xs font-bold">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-surface-200/60">{u.email}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-surface-200/40">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        {u._id !== user?._id && (
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-2 rounded-lg text-surface-200/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
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

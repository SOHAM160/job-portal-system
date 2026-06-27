import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, LogOut, LayoutDashboard, Search, Home as HomeIcon, Bell, MessageSquare, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const qVal = searchParams.get("q") || "";
    setSearchText(qVal);
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      if (searchText.trim()) navigate(`/login?q=${encodeURIComponent(searchText.trim())}`);
      return;
    }
    if (searchText.trim()) {
      // Search with q param
      navigate(`/${user.role}/dashboard?q=${encodeURIComponent(searchText.trim())}`);
    } else {
      // Empty — reset to all jobs (no q param)
      navigate(`/${user.role}/dashboard`);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    // When cleared live, immediately reset to all jobs
    if (!val && user) {
      navigate(`/${user.role}/dashboard`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 p-1.5 rounded flex items-center justify-center group-hover:bg-primary-700 transition-all">
                <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight hidden sm:block">HireHub</span>
          </Link>
          
          {user && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-primary-50 border border-slate-200 rounded-lg px-3 py-1.5 w-72 group focus-within:w-96 transition-all duration-300">
              <Search className="w-4 h-4 text-slate-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search for jobs, companies..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500"
                value={searchText}
                onChange={handleSearchChange}
              />
            </form>
          )}
        </div>

        {/* Right: Nav Links */}
        <div className="flex items-center gap-1 sm:gap-6">
          <NavLink 
            to={user ? `/${user.role}/dashboard` : "/"} 
            icon={<HomeIcon className="w-6 h-6" />} 
            label="Home" 
          />
          
          {user ? (
            <>
              <NavLink to="/notifications" icon={<Bell className="w-6 h-6" />} label="Notifications" />
              <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />
              <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center text-slate-500 hover:text-red-600 transition-colors group px-2"
              >
                <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium mt-1 uppercase tracking-wider">Logout</span>
              </button>
              <div className="flex items-center gap-3 ml-4 border-l border-slate-200 pl-4 hidden sm:flex">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">{user.role}</p>
                </div>
                {user.profilePicture ? (
                  <img src={user.profilePicture} className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" alt="Profile" />
                ) : (
                  <UserCircle className="w-8 h-8 text-slate-400" />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-primary-600 hover:text-primary-700 px-4 py-1.5 rounded-full font-bold text-sm transition-all hover:bg-primary-50">Sign In</Link>
              <Link to="/register" className="btn-primary !px-5 !py-1.5 !text-sm whitespace-nowrap">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link to={to} className="flex flex-col items-center justify-center text-slate-500 hover:text-primary-600 transition-colors group px-2 relative after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-primary-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[10px] font-medium mt-1 uppercase tracking-wider hidden sm:block">{label}</span>
  </Link>
);

export default Navbar;

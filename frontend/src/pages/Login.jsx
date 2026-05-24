import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, Eye, EyeOff, Briefcase, Users } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  // Use state for role even in login, to distinguish the UI "Path"
  const [selectedRole, setSelectedRole] = useState(searchParams.get("role") || "candidate");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      if (data.success) {
        toast.success(`Welcome back!`);
        // We redirect to the ACTUAL role of the user returned from DB
        navigate(`/${data.user.role}/dashboard`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await loginWithGoogle(credentialResponse.credential, selectedRole);
      if (data.success) {
        toast.success(`Welcome back!`);
        navigate(`/${data.user.role}/dashboard`);
      }
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-100 animate-fade-in text-slate-900">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tighter">Hire <span className="text-primary-600">&</span> Fly</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[9px] mt-2">Professional Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Options at Login */}
          <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button
                type="button"
                onClick={() => setSelectedRole('candidate')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-[11px] font-black uppercase tracking-tight ${
                    selectedRole === 'candidate' ? 'bg-white shadow-sm border border-slate-200 text-primary-600' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <Users className="w-4 h-4" /> Candidate
            </button>
            <button
                type="button"
                onClick={() => setSelectedRole('recruiter')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-[11px] font-black uppercase tracking-tight ${
                    selectedRole === 'recruiter' ? 'bg-white shadow-sm border border-slate-200 text-recruiter-600' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <Briefcase className="w-4 h-4" /> Recruiter
            </button>
          </div>

          <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Account Email</label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-11 h-12"
                    placeholder="name@mail.com"
                  />
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-11 pr-11 h-12"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-black text-lg transition-all shadow-lg ${
                selectedRole === 'recruiter' ? 'bg-recruiter-600 hover:bg-recruiter-700 shadow-recruiter-600/20' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20'
            }`}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : `Sign In as ${selectedRole}`}
          </button>
        </form>

        <div className="my-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Social Link</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} theme="outline" shape="pill" width="320px" />
          </div>

          <p className="text-center text-slate-500 font-medium text-sm">
            Need an account?{" "}
            <Link to={selectedRole ? `/register?role=${selectedRole}` : "/register"} className="text-primary-600 font-black hover:underline ml-1">
               Join Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

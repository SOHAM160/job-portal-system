import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock, Loader2, Briefcase, Users } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: searchParams.get("role") || "candidate",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(form);
      if (data.success) {
        toast.success("Account created successfully!");
        navigate(`/${data.user.role}/dashboard`);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      if (msg === "Email already registered") {
         setTimeout(() => toast.loading("Redirecting to login...", { duration: 2000 }), 500);
         setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-100 animate-fade-in text-slate-900">
      <div className="bg-white w-full max-w-lg p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tighter">Hire <span className="text-primary-600">&</span> Fly</h1>
          <div className="flex items-center justify-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] bg-slate-50 py-2.5 px-6 rounded-full w-fit mx-auto border border-slate-100 mt-2 shadow-sm">
             {form.role === 'recruiter' ? <Briefcase className="w-4 h-4 text-recruiter-600"/> : <Users className="w-4 h-4 text-primary-600"/>}
             {form.role} Network Invitation
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!searchParams.get("role") && (
            <div className="grid grid-cols-2 gap-4 mb-2">
               <RoleCard 
                 selected={form.role === 'candidate'} 
                 onClick={() => setForm({...form, role: 'candidate'})}
                 icon={<Users className="w-6 h-6" />}
                 label="Candidate"
                 desc="Find jobs"
               />
               <RoleCard 
                 selected={form.role === 'recruiter'} 
                 onClick={() => setForm({...form, role: 'recruiter'})}
                 icon={<Briefcase className="w-6 h-6" />}
                 label="Recruiter"
                 desc="Post jobs"
               />
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-11 h-12"
                  placeholder="John Doe"
                />
                <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
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
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Create Password</label>
              <div className="relative">
                <input
                  required
                  autoComplete="new-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-11 h-12"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center px-6 leading-relaxed">
            By creating an account, you agree to our <span className="text-primary-600 font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary-600 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-all ${
                form.role === 'recruiter' ? 'bg-recruiter-600 hover:bg-recruiter-700 shadow-recruiter-600/20' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20'
            }`}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : `Create ${form.role} Account`}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          Member already?{" "}
          <Link to={form.role ? `/login?role=${form.role}` : "/login"} className="text-primary-600 font-black hover:underline">
            Sign in now
          </Link>
        </p>
      </div>
    </div>
  );
};

const RoleCard = ({ selected, onClick, icon, label, desc }) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-4 rounded-[1.5rem] border-2 text-left transition-all relative ${
            selected ? 'border-primary-600 bg-primary-50' : 'border-slate-100 bg-white hover:border-slate-200'
        }`}
    >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm ${
            selected ? 'bg-primary-600 text-white' : 'bg-slate-50 text-slate-400'
        }`}>
            {icon}
        </div>
        <p className={`font-black text-xs uppercase tracking-tight ${selected ? 'text-primary-700' : 'text-slate-900'}`}>{label}</p>
        <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase tracking-widest">{desc}</p>
        {selected && (
            <div className="absolute top-3 right-3 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
        )}
    </button>
);

export default Register;

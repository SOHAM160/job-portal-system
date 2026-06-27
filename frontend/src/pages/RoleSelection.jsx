import { Link } from "react-router-dom";
import { Users, Briefcase, ArrowRight, ShieldCheck, Globe, Zap } from "lucide-react";

const RoleSelection = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      {/* Mini Header */}
      <nav className="p-6 flex justify-center">
         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <div className="bg-primary-600 p-1 rounded">
                <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">HireHub</span>
         </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-6xl mx-auto text-center space-y-12 py-10">
        <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Every journey starts with a <span className="text-primary-600">choice.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                Choose the path that fits your current professional goal. Whether you're here to grow or here to build, we have the right tools for you.
            </p>
        </div>

        {/* The Choice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Candidate Choice */}
          <Link 
            to="/candidate" 
            className="group relative bg-white p-10 rounded-[2.5rem] border-2 border-transparent hover:border-primary-600 transition-all duration-500 card-shadow overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[5rem] group-hover:scale-150 transition-transform duration-700 opacity-50" />
            
            <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-600/20">
                    <Users className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">I am a Candidate</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Find your dream job, connect with top employers, and manage your applications in one place.</p>
                </div>
                <div className="flex items-center gap-3 text-primary-600 font-bold group-hover:gap-5 transition-all">
                    Start Exploring <ArrowRight className="w-5 h-5" />
                </div>
            </div>
          </Link>

          {/* Recruiter Choice */}
          <Link 
            to="/recruiter" 
            className="group relative bg-slate-900 p-10 rounded-[2.5rem] border-2 border-transparent hover:border-recruiter-600 transition-all duration-500 card-shadow overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-recruiter-600 rounded-bl-[5rem] group-hover:scale-150 transition-transform duration-700 opacity-20" />
            
            <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-recruiter-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-recruiter-600/20">
                    <Briefcase className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white mb-2">I am a Recruiter</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">Post open positions, manage your company profile, and find the perfect talent for your team.</p>
                </div>
                <div className="flex items-center gap-3 text-recruiter-600 font-bold group-hover:gap-5 transition-all">
                    Start Hiring <ArrowRight className="w-5 h-5" />
                </div>
            </div>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 justify-center font-bold text-slate-600"><ShieldCheck className="w-5 h-5"/> Secure</div>
            <div className="flex items-center gap-2 justify-center font-bold text-slate-600"><Globe className="w-5 h-5"/> Global</div>
            <div className="flex items-center gap-2 justify-center font-bold text-slate-600"><Zap className="w-5 h-5"/> Instant</div>
            <div className="flex items-center gap-2 justify-center font-bold text-slate-600"><Users className="w-5 h-5"/> Community</div>
        </div>
      </div>

      <footer className="p-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        © 2026 HireHub. Built for Professionals.
      </footer>
    </div>
  );
};

export default RoleSelection;

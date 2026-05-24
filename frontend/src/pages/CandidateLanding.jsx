import { Link } from "react-router-dom";
import { Search, MapPin, Users, Zap, Briefcase, ChevronRight, TrendingUp } from "lucide-react";

const CandidateLanding = () => {
  return (
    <div className="bg-slate-50 min-h-screen animate-fade-in flex flex-col">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/[0.02] skew-x-12 transform translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-8 relative z-10">
          <div className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-float">
             Over 4,500 new jobs posted today
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
            Work that <span className="text-primary-600">matters</span>,<br /> 
            life that <span className="text-emerald-600">thrives.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl font-medium">
            Join the fastest-growing professional community. Find remote, hybrid, and local opportunities tailored specifically to your skillset.
          </p>

          <div className="w-full max-w-3xl bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 mt-4">
             <div className="flex-1 flex items-center px-4 gap-3 border-r border-slate-100">
                <Search className="w-5 h-5 text-slate-300" />
                <input type="text" placeholder="Job title or keyword" className="w-full bg-transparent border-none outline-none font-medium h-12" />
             </div>
             <div className="flex-1 flex items-center px-4 gap-3">
                <MapPin className="w-5 h-5 text-slate-300" />
                <input type="text" placeholder="Location" className="w-full bg-transparent border-none outline-none font-medium h-12" />
             </div>
             <Link to="/register?role=candidate" className="btn-primary !rounded-xl !px-10">Search Jobs</Link>
          </div>
          
          <div className="flex gap-10 pt-10 flex-wrap justify-center text-xs font-black text-slate-400 uppercase tracking-widest">
             <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4"/> High Growth</span>
             <span className="flex items-center gap-2"><Briefcase className="w-4 h-4"/> Remote Friendly</span>
             <span className="flex items-center gap-2"><Zap className="w-4 h-4"/> Fast Hiring</span>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
         <Link to="/register?role=candidate" className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-primary-600 transition-all card-shadow group">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Build Your Profile</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Complete your professional history and stand out to top recruiters instantly.</p>
            <div className="text-primary-600 font-bold flex items-center gap-2 text-sm uppercase">Get Started <ChevronRight className="w-4 h-4"/></div>
         </Link>
         
         <Link to="/register?role=candidate" className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-emerald-600 transition-all card-shadow group">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Direct Applications</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Apply directly to companies without going through complex external portals.</p>
            <div className="text-emerald-600 font-bold flex items-center gap-2 text-sm uppercase">Learn More <ChevronRight className="w-4 h-4"/></div>
         </Link>

         <Link to="/register?role=candidate" className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-slate-900 transition-all card-shadow group">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Career Insights</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Get AI-driven insights on matching jobs and market salary trends for your role.</p>
            <div className="text-slate-900 font-bold flex items-center gap-2 text-sm uppercase">View Dashboard <ChevronRight className="w-4 h-4"/></div>
         </Link>
      </section>

      {/* Action Footer */}
      <div className="bg-slate-900 mt-auto py-20">
         <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white">Ready to change your career?</h2>
            <p className="text-slate-400 text-lg font-medium">Join over 12 million professionals finding meaningful work today.</p>
            <div className="flex justify-center gap-4">
                <Link to="/register" className="btn-primary !py-4 !px-10">Sign Up Free</Link>
                <Link to="/" className="text-white hover:text-primary-400 font-bold flex items-center gap-2 px-6">Not a candidate? Change Choice</Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CandidateLanding;

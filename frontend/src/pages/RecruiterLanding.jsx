import { Link } from "react-router-dom";
import { Building, Users, BadgeCheck, BarChart3, ArrowRight, MousePointerClick, Zap } from "lucide-react";

const RecruiterLanding = () => {
  return (
    <div className="bg-[#fbfcff] min-h-screen animate-fade-in flex flex-col font-sans">
      {/* Premium Dark Hero */}
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-recruiter-600 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600 rounded-full blur-[120px] opacity-10" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
                <div className="flex items-center gap-2 text-recruiter-500 font-black uppercase tracking-[0.2em] text-xs">
                    <BadgeCheck className="w-4 h-4 text-recruiter-600" /> Enterprise Talent Solution
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05]">
                    Build your <span className="text-recruiter-600">A-Team</span> in record time.
                </h1>
                <p className="text-lg text-slate-400 max-w-xl font-medium leading-relaxed">
                    Access the world’s most active professional database. Post jobs, manage pipelines, and hire top-tier talent with data-driven insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/register?role=recruiter" className="bg-recruiter-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-recruiter-700 transition-all shadow-2xl shadow-recruiter-600/30 flex items-center justify-center gap-3">
                        Start Hiring Now <ArrowRight className="w-6 h-6" />
                    </Link>
                    <Link to="/login" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all flex items-center justify-center">
                        Recruiter Sign In
                    </Link>
                </div>
            </div>
            
            {/* Visual SaaS Mockup Element */}
            <div className="hidden md:block">
                <div className="bg-slate-800 rounded-[2.5rem] p-4 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 animate-float">
                    <div className="bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                            </div>
                            <div className="text-[10px] text-white/20 font-black tracking-widest uppercase">Applicant Pipeline</div>
                        </div>
                        <div className="p-8 space-y-6">
                            <MockupRow name="Sarah Konner" role="Fullstack Dev" status="Interview" color="text-amber-400" />
                            <MockupRow name="John Marcus" role="Product Manager" status="Review" color="text-indigo-400" />
                            <MockupRow name="Emily Chen" role="UI Designer" status="Hired" color="text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
         <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">The Recruiter's Edge</h2>
            <div className="w-20 h-1 bg-recruiter-600 mx-auto rounded-full" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <FeatureBox 
                icon={<Users className="w-10 h-10 text-recruiter-600" />} 
                title="Active Database" 
                desc="Connect with candidates who are actively seeking new challenges." 
            />
            <FeatureBox 
                icon={<BarChart3 className="w-10 h-10 text-recruiter-600" />} 
                title="Analytics Suite" 
                desc="Deep insights into your job posting performance and applicant quality." 
            />
            <FeatureBox 
                icon={<MousePointerClick className="w-10 h-10 text-recruiter-600" />} 
                title="One-Click Sourcing" 
                desc="Save time with unified search and bulk outreach tools." 
            />
            <FeatureBox 
                icon={<Zap className="w-10 h-10 text-recruiter-600" />} 
                title="Rapid Posting" 
                desc="Go live in under 2 minutes with our streamlined job creation flow." 
            />
         </div>
      </section>

      {/* Final Action */}
      <div className="mt-auto bg-slate-50 border-t border-slate-100 py-20">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-4xl font-black text-slate-900 mb-6">Scale your vision today.</h3>
            <p className="text-slate-500 text-lg mb-10 font-medium leading-relaxed">Trusted by over 45,000 corporate partners ranging from innovative startups to global enterprises.</p>
            <Link to="/register?role=recruiter" className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-2xl">
                Create Recruiter Account
            </Link>
         </div>
      </div>
    </div>
  );
};

const MockupRow = ({ name, role, status, color }) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
            <div>
                <p className="text-xs font-bold text-white/90">{name}</p>
                <p className="text-[10px] text-white/40">{role}</p>
            </div>
        </div>
        <div className={`text-[9px] font-black uppercase px-2 py-1 rounded bg-white/5 border border-white/5 ${color}`}>
            {status}
        </div>
    </div>
);

const FeatureBox = ({ icon, title, desc }) => (
    <div className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="p-4 bg-recruiter-50 rounded-2xl">
            {icon}
        </div>
        <div>
            <h4 className="text-xl font-black text-slate-900 mb-2">{title}</h4>
            <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default RecruiterLanding;

import { Link } from "react-router-dom";
import { Briefcase, Users, Building, Search, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-surface-100 min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Welcome to your professional <span className="text-primary-600">community</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-xl">
              Connecting millions of candidates with top companies around the world. Find your next opportunity or hire the best talent today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Link to="/register" className="btn-primary !py-4 !px-8 text-lg"> Get Started Now </Link>
              <Link to="/login" className="btn-secondary !py-4 !px-8 text-lg"> Sign In </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1549692560-5e9a485c39ba?auto=format&fit=crop&q=80&w=1000" 
              alt="Professional Collaboration" 
              className="rounded-full w-full aspect-square object-cover card-shadow border-8 border-white"
            />
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">How would you like to use HireHub?</h2>
            <p className="text-slate-500 text-lg">Choose the path that's right for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Candidate Card */}
          <Link to="/register" className="glass-card group p-10 hover:-translate-y-2 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Find a Job</h3>
            <p className="text-slate-500 mb-6 font-medium">Browse through thousands of open positions and apply with your professional profile.</p>
            <div className="flex items-center gap-2 text-primary-600 font-bold group-hover:gap-4 transition-all">
               Browse Jobs <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          {/* Recruiter Card */}
          <Link to="/register" className="glass-card group p-10 hover:-translate-y-2 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
              <Building className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Post a Job</h3>
            <p className="text-slate-500 mb-6 font-medium">Connect with top-tier talent and build your team globally. Manage applications with ease.</p>
            <div className="flex items-center gap-2 text-primary-600 font-bold group-hover:gap-4 transition-all">
               Start Hiring <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Trust/Banner Section */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureItem 
                icon={<Zap className="w-8 h-8" />} 
                title="Fast Apply" 
                description="Apply to jobs in seconds with our one-click application system."
            />
            <FeatureItem 
                icon={<ShieldCheck className="w-8 h-8" />} 
                title="Secure Identity" 
                description="Your data is protected with enterprise-grade security and JWT encryption."
            />
            <FeatureItem 
                icon={<Globe className="w-8 h-8" />} 
                title="Global Reach" 
                description="Connect with employers and candidates across 150+ countries."
            />
        </div>
      </section>

      {/* Stats Footer */}
      <footer className="bg-slate-900 py-12 text-white/60 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-10 md:gap-32">
            <div>
                <p className="text-4xl font-bold text-white">4M+</p>
                <p className="text-sm font-medium uppercase tracking-widest mt-2">Open Jobs</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-white">450K+</p>
                <p className="text-sm font-medium uppercase tracking-widest mt-2">Companies</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-white">12M+</p>
                <p className="text-sm font-medium uppercase tracking-widest mt-2">Candidates</p>
            </div>
        </div>
        <div className="mt-12 text-xs">© 2026 HireHub. All rights reserved.</div>
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }) => (
    <div className="flex gap-6 items-start">
        <div className="bg-primary-50 p-4 rounded-xl text-primary-600 flex-shrink-0">
            {icon}
        </div>
        <div className="space-y-2">
            <h4 className="text-xl font-bold text-slate-900">{title}</h4>
            <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
        </div>
    </div>
);

export default Home;

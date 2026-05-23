import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Briefcase,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Smart Job Matching",
      description:
        "Our AI-powered algorithm connects you with the perfect opportunities tailored to your skills.",
      gradient: "from-primary-500 to-blue-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Top Recruiters",
      description:
        "Connect with industry-leading companies actively seeking talent like yours.",
      gradient: "from-accent-500 to-teal-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Listings",
      description:
        "Every job posting is verified to ensure quality and legitimacy for all users.",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Jobs", icon: <Briefcase className="w-5 h-5" /> },
    { value: "12K+", label: "Companies", icon: <Globe className="w-5 h-5" /> },
    { value: "98%", label: "Success Rate", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "2M+", label: "Candidates", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm text-primary-300">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 2M+ professionals worldwide</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Find Your{" "}
              <span className="gradient-text">Dream Job</span>
              <br />
              <span className="text-surface-200/80">Start Today</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-200/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you're a candidate looking for your next opportunity or a
              recruiter searching for top talent — we've got you covered.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to={`/${user.role}/dashboard`}
                  className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white transition-all duration-300 shadow-xl shadow-primary-600/25 hover:shadow-primary-500/40"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white transition-all duration-300 shadow-xl shadow-primary-600/25 hover:shadow-primary-500/40"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium text-surface-200 glass hover:bg-white/5 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-5 text-center hover:bg-white/5 transition-colors duration-300">
                <div className="flex justify-center mb-2 text-primary-400">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-surface-200/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">JobPortal</span>?
            </h2>
            <p className="text-surface-200/50 max-w-xl mx-auto">
              We provide the tools and connections you need to accelerate your career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group glass rounded-2xl p-8 hover:bg-white/5 transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-sm text-surface-200/50 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-12 text-center">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 via-primary-800/30 to-accent-900/50" />
            <div className="absolute inset-0 glass" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Take the Next Step?
              </h2>
              <p className="text-surface-200/60 mb-8 max-w-lg mx-auto">
                Join thousands of professionals who found their dream careers through our platform.
              </p>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-white text-surface-900 hover:bg-surface-100 transition-all duration-300 shadow-xl"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold">
              Job<span className="gradient-text">Portal</span>
            </span>
          </div>
          <p className="text-xs text-surface-200/40">
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

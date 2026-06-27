import React, { useState, useEffect } from "react";
import { Sparkles, Briefcase, MapPin, DollarSign, BrainCircuit, Target, CheckCircle2, ChevronRight, Loader2, X, Upload, FileText, RefreshCw } from "lucide-react";
import { getJobRecommendations, applyToJob, getMyApplications } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const JobRecommendations = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Apply modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    fetchRecommendations();
    fetchApplied();
  }, []);

  const fetchApplied = async () => {
    try {
      const { data } = await getMyApplications();
      const ids = new Set((data.applications || []).map(a => a.job?._id?.toString()));
      setAppliedIds(ids);
    } catch (_) {}
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data } = await getJobRecommendations();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setResumeFile(null);
    setShowApplyModal(true);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile) return toast.error("Please upload your resume PDF");
    if (resumeFile.size > 5 * 1024 * 1024) return toast.error("File too large! Max 5MB");

    setIsApplying(true);
    try {
      const formData = new FormData();
      formData.append("resumeFile", resumeFile);
      await applyToJob(selectedJob._id, formData);
      toast.success(`Applied to ${selectedJob.title}! 🎉`);
      setAppliedIds(prev => new Set([...prev, selectedJob._id?.toString()]));
      setShowApplyModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setIsApplying(false);
    }
  };

  const isApplied = (jobId) => appliedIds.has(jobId?.toString());

  // ── Loading State ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
          <BrainCircuit className="w-6 h-6 text-primary-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800">Analyzing Your Profile</h3>
          <p className="text-sm text-slate-500">Scanning jobs to find your perfect match...</p>
        </div>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────────────────
  if (!recommendations.length) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
        <Target className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Recommendations Yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto text-sm">
          Update your <strong>Profile Context</strong> in the sidebar with your bio and skills, then refresh.
        </p>
        <button
          onClick={fetchRecommendations}
          className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  // ── Recommendations List ──────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            Smart Matches
              <span className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-primary-600/20 animate-pulse">
                Beta
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {recommendations.length} personalized opportunities based on your profile
            </p>
          </div>
          <button
            onClick={fetchRecommendations}
            className="text-primary-600 hover:text-primary-700 font-bold text-xs flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl transition-all hover:bg-primary-100"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {recommendations.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-md shadow-slate-200/50 border border-slate-100 hover:border-primary-200 transition-all relative overflow-hidden"
              >
                {/* Match badge */}
                <div className="absolute top-0 right-0">
                  <div className={`flex items-center gap-1.5 font-black text-sm px-4 py-2 rounded-bl-2xl rounded-tr-2xl border-b border-l ${
                    job.matchPercentage >= 70
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : job.matchPercentage >= 40
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-slate-50 text-slate-600 border-slate-100"
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                    {job.matchPercentage}% Match
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 pr-28 md:pr-32">
                  {/* Left – Job Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                        {job.companyId?.logo
                          ? <img src={job.companyId.logo} className="w-full h-full object-cover rounded-xl" alt="" />
                          : <Briefcase className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{job.title}</h4>
                        <p className="text-slate-500 text-sm font-medium">{job.companyId?.name || "Company"}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md">
                        <DollarSign className="w-3 h-3" /> {job.salary}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md">
                        {job.type}
                      </span>
                    </div>

                    {/* Smart Reasoning */}
                    <div className="bg-primary-50/60 rounded-xl p-4 border border-primary-100/60">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                        <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest">Smart Insight</span>
                      </div>
                      <p className="text-sm text-slate-600 italic leading-relaxed">{job.explanation}</p>
                    </div>
                  </div>

                  {/* Right – Skills & Action */}
                  <div className="md:w-56 flex flex-col justify-between gap-4">
                    {job.skills?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Skills Needed</p>
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills.slice(0, 5).map((skill, i) => (
                            <span key={i} className="text-[10px] font-black bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-md shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Apply Button */}
                    {isApplied(job._id) ? (
                      <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-black text-xs py-3 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" /> Applied!
                      </div>
                    ) : (
                      <button
                        onClick={() => openApplyModal(job)}
                        className="w-full bg-slate-900 hover:bg-primary-600 text-white font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary-600/20"
                      >
                        View & Apply <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Apply Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showApplyModal && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowApplyModal(false)} />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary-100 text-xs font-bold uppercase tracking-widest mb-1">Apply Now</p>
                    <h3 className="text-xl font-black">{selectedJob.title}</h3>
                    <p className="text-primary-200 text-sm mt-1">{selectedJob.companyId?.name} · {selectedJob.location}</p>
                  </div>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Match badge in header */}
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedJob.matchPercentage}% Profile Match
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleApply} className="p-6 space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Upload Resume (PDF · Max 5MB)
                  </label>
                  <label className="relative border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center bg-slate-50 hover:bg-primary-50 hover:border-primary-300 transition-all cursor-pointer group">
                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-primary-500 mb-2 transition-colors" />
                    {resumeFile ? (
                      <div className="text-center">
                        <p className="text-sm font-black text-primary-600">{resumeFile.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-500">Click to choose file</p>
                        <p className="text-xs text-slate-400 mt-1">PDF format only</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>

                {/* Insight preview */}
                <div className="bg-primary-50 rounded-xl p-3 border border-primary-100">
                  <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Why you match
                  </p>
                  <p className="text-xs text-slate-600 italic leading-relaxed">{selectedJob.explanation}</p>
                </div>

                <button
                  type="submit"
                  disabled={isApplying || !resumeFile}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                >
                  {isApplying ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                  ) : (
                    <><FileText className="w-5 h-5" /> Submit Application</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobRecommendations;

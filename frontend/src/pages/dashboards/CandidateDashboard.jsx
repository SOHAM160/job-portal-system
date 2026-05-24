import { useState, useEffect } from "react";
import { Briefcase, MapPin, DollarSign, Search, Loader2, CheckCircle2, Bookmark, BookmarkCheck, Sliders, FileText, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { getAllJobs, applyToJob, getMyApplications, toggleSavedJob } from "../../api";
import { useAuth } from "../../context/AuthContext";

const CandidateDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: "", location: "", skills: "", salary: "", type: "All" });
  
  // Application modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeData, setResumeData] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const fetchData = async (searchParams = {}) => {
    try {
      const [jobsRes, appsRes] = await Promise.all([getAllJobs(searchParams), getMyApplications()]);
      setJobs(jobsRes.data.jobs);
      setApplications(appsRes.data.applications);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData(filters);
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setResumeData("");
    setResumeFile(null);
    setShowApplyModal(true);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeData && !resumeFile) {
      return toast.error("Please provide a resume link or upload a file");
    }
    
    setIsApplying(true);
    try {
      let finalResumePayload = resumeData; // Default to link

      if (resumeFile) {
        if (resumeFile.size > 5 * 1024 * 1024) {
           setIsApplying(false);
           return toast.error("File is too large! Maximum allowed is 5MB");
        }
        finalResumePayload = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject("File reading failed");
          reader.readAsDataURL(resumeFile);
        });
      }
      
      await applyToJob(selectedJob._id, { resume: finalResumePayload });
      toast.success("Applied successfully!");
      setShowApplyModal(false);
      fetchData(filters);
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveToggle = async (jobId) => {
    try {
      await toggleSavedJob(jobId);
      await refreshUser();
      toast.success("Updated library");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const isApplied = (jobId) => applications.some(app => app.job?._id === jobId);
  const isSaved = (jobId) => user?.savedJobs?.includes(jobId);

  if (loading && jobs.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-6">
      
      {/* Search Header */}
      <div className="bg-white p-6 md:p-10 rounded-2xl card-shadow border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Find your next job opportunity</h1>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
           {/* Row 1: Core Search */}
           <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Job title, keywords..." 
                    className="input-field pl-10"
                    value={filters.keyword}
                    onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                  />
               </div>
               <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Location or remote" 
                    className="input-field pl-10"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
               </div>
           </div>
           
           {/* Row 2: Advanced Filters */}
           <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 relative">
                  <Sliders className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Skills (react, node...)" 
                    className="input-field pl-10"
                    value={filters.skills}
                    onChange={(e) => setFilters({...filters, skills: e.target.value})}
                  />
               </div>
               <div className="w-full md:w-48 relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Target Salary" 
                    className="input-field pl-10"
                    value={filters.salary}
                    onChange={(e) => setFilters({...filters, salary: e.target.value})}
                  />
               </div>
               <div className="w-full md:w-48">
                  <select 
                    value={filters.type} 
                    onChange={(e) => setFilters({...filters, type: e.target.value})} 
                    className="input-field bg-white"
                  >
                    <option value="All">All Roles</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
               </div>
               <button type="submit" className="btn-primary !rounded-lg !px-8">Filter</button>
           </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl card-shadow border border-slate-200 overflow-hidden">
                <div className="h-16 bg-gradient-to-r from-primary-600 to-primary-700" />
                <div className="px-6 pb-6 -mt-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full border-4 border-white shadow shadow-sm flex items-center justify-center font-bold text-xl text-primary-600 mb-3 overflow-hidden">
                        {user.profilePicture ? <img src={user.profilePicture} alt="Profile" /> : user.name[0]}
                    </div>
                    <h3 className="font-bold text-slate-900">{user.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Aspiring {user.role}</p>
                    <div className="w-full h-px bg-slate-100 my-4" />
                    <div className="w-full flex justify-between text-xs font-bold text-slate-500">
                        <span>Jobs Saved</span>
                        <span className="text-primary-600">{user.savedJobs?.length || 0}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Middle: Job Feed */}
        <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-900 italic">Recommended for you</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{jobs.length} Results Found</span>
            </div>

            {jobs.length > 0 ? (
                jobs.map((job) => (
                    <div key={job._id} className="bg-white card-shadow rounded-xl p-6 border border-slate-100 hover:border-primary-100 transition-all group">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded border border-slate-200 flex items-center justify-center text-xl font-black text-slate-300">
                                {job.companyId?.logo ? <img src={job.companyId.logo} className="w-full h-full object-cover" /> : job.companyId?.name?.[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-primary-600 text-lg group-hover:underline cursor-pointer">{job.title}</h3>
                                    <button onClick={() => handleSaveToggle(job._id)} className="text-slate-400 hover:text-primary-600 transition-colors">
                                        {isSaved(job._id) ? <BookmarkCheck className="w-6 h-6 text-primary-600" /> : <Bookmark className="w-6 h-6" />}
                                    </button>
                                </div>
                                <p className="text-sm font-bold text-slate-900">{job.companyId?.name}</p>
                                <p className="text-sm text-slate-500 mb-3">{job.location} ({job.type})</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills?.slice(0, 4).map((skill, i) => (
                                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded-full uppercase">{skill}</span>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center sm:items-end flex-col sm:flex-row gap-4">
                                    <div className="flex items-center gap-4 text-xs font-bold text-emerald-600 uppercase">
                                        <DollarSign className="w-4 h-4" /> {job.salary}
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        {isApplied(job._id) ? (
                                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100 italic">
                                                <CheckCircle2 className="w-4 h-4" /> Applied
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => openApplyModal(job)}
                                                className="btn-primary !px-6 !text-sm !py-2 !rounded-full shadow-lg shadow-primary-600/10"
                                            >
                                                Apply Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white p-20 rounded-xl card-shadow text-center text-slate-400">
                    No jobs found matching your search criteria.
                </div>
            )}
        </div>
      </div>

      {/* ── Apply Modal ────────────────────────────────────────── */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowApplyModal(false)} />
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative animate-fade-in overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Application </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedJob.title}</p>
                </div>
                <button onClick={() => setShowApplyModal(false)} className="bg-white p-2 rounded-full border border-slate-200"><X className="w-4 h-4 text-slate-400 hover:text-slate-600"/></button>
            </div>
            <form onSubmit={handleApply} className="p-6 space-y-6 bg-white shrink-0">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 font-medium">To apply to <span className="font-bold text-primary-600">{selectedJob.companyId?.name}</span>, please provide your resume. You can either upload a PDF or provide a Google Drive / Portfolio link.</p>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-800 uppercase tracking-wide">Upload PDF Resume</label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary-600 mb-2 transition-colors" />
                            <span className="text-sm font-bold text-slate-600">
                              {resumeFile ? resumeFile.name : "Click to select local file"}
                            </span>
                            <span className="text-xs text-slate-400">(Max 5MB)</span>
                            <input 
                              type="file" 
                              accept=".pdf,application/pdf"
                              onChange={(e) => setResumeFile(e.target.files[0])}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-800 uppercase tracking-wide">Resume Link</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                          <input 
                            type="url" 
                            className="input-field pl-10" 
                            placeholder="https://drive.google.com/..." 
                            value={resumeData}
                            onChange={(e) => setResumeData(e.target.value)}
                            disabled={!!resumeFile}
                          />
                        </div>
                    </div>
                </div>

                <button disabled={isApplying || (!resumeData && !resumeFile)} type="submit" className="btn-primary w-full !py-3">
                    {isApplying ? <Loader2 className="animate-spin w-5 h-5 mx-auto"/> : "Submit Application"}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;

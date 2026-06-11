import { useState, useEffect } from "react";
import { Plus, Users, Briefcase, Trash2, Edit3, Loader2, X, Bell, Building, Eye, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, UserCircle, FileText, Mail, Calendar, Video, Send, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getRecruiterJobs, createJob, deleteJob, getCompanies, updateJob, registerCompany, getJobApplications, updateApplicationStatus, scheduleInterview } from "../../api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyLoading, setNewCompanyLoading] = useState(false);

  // Applicant viewer state
  const [viewingJobId, setViewingJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // Interview scheduling state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewTarget, setInterviewTarget] = useState(null); // the application object
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    skills: "",
  });

  const fetchData = async () => {
    try {
      const [jobsRes, compRes] = await Promise.all([getRecruiterJobs(), getCompanies()]);
      setJobs(jobsRes.data.jobs);
      setCompanies(compRes.data.companies);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Inline Company Creation ──────────────────────────────
  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) return toast.error("Enter a company name");
    setNewCompanyLoading(true);
    try {
      const { data } = await registerCompany({ name: newCompanyName.trim(), location: "N/A" });
      if (data.success) {
        toast.success(`"${data.company.name}" registered!`);
        setCompanies((prev) => [...prev, data.company]);
        setFormData((prev) => ({ ...prev, companyId: data.company._id }));
        setNewCompanyName("");
        setShowNewCompany(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create company");
    } finally {
      setNewCompanyLoading(false);
    }
  };

  // ── Job CRUD ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyId) return toast.error("Please select or create a company first");

    setFormLoading(true);
    try {
      const skillsArray = formData.skills ? formData.skills.split(",").map(s => s.trim().toLowerCase()) : [];
      const data = { ...formData, skills: skillsArray };
      if (editingJob) {
        await updateJob(editingJob._id, data);
        toast.success("Job updated");
      } else {
        await createJob(data);
        toast.success("Job posted successfully!");
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      companyId: job.companyId?._id || "",
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      skills: job.skills?.join(", ") || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({ title: "", companyId: "", location: "", type: "Full-time", salary: "", description: "", skills: "" });
    setShowNewCompany(false);
    setNewCompanyName("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job listing?")) return;
    try {
      await deleteJob(id);
      toast.success("Job deleted");
      if (viewingJobId === id) setViewingJobId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // ── Applicant Viewer ─────────────────────────────────────
  const toggleApplicants = async (jobId) => {
    if (viewingJobId === jobId) {
      setViewingJobId(null);
      setApplicants([]);
      return;
    }
    setViewingJobId(jobId);
    setApplicantsLoading(true);
    try {
      const { data } = await getJobApplications(jobId);
      setApplicants(data.applications);
    } catch (error) {
      toast.error("Failed to fetch applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success(`Application ${newStatus.toLowerCase()}`);
      if (viewingJobId) {
        const { data } = await getJobApplications(viewingJobId);
        setApplicants(data.applications);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // ── Interview Scheduling ─────────────────────────────────
  const openInterviewModal = (app) => {
    setInterviewTarget(app);
    setInterviewDate("");
    setInterviewLink("");
    setShowInterviewModal(true);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewDate || !interviewLink) return toast.error("Date and meeting link are required");

    setInterviewLoading(true);
    try {
      await scheduleInterview(interviewTarget._id, {
        date: interviewDate,
        meetingLink: interviewLink,
      });
      toast.success("Interview scheduled & email sent to candidate!");
      setShowInterviewModal(false);
      // Refresh applicants
      if (viewingJobId) {
        const { data } = await getJobApplications(viewingJobId);
        setApplicants(data.applications);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule interview");
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleViewResume = (applicationId) => {
    if (!applicationId) return toast.error("Document not found");
    const url = `/api/applications/${applicationId}/resume`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-600 w-8 h-8" /></div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto px-4 py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white p-8 rounded-2xl card-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Manage Your Opportunities</h1>
            <p className="text-slate-500 font-medium">Post jobs and find the best talent for your companies.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
              <Link to="/recruiter/companies" className="btn-secondary !rounded-lg"><Building className="w-4 h-4" /> Companies</Link>
              <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary !rounded-lg"><Plus className="w-4 h-4" /> Post Job</button>
          </div>
        </div>
        <div className="bg-primary-600 text-white p-8 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
           <p className="text-sm font-bold uppercase tracking-widest opacity-80">Live Jobs</p>
           <p className="text-5xl font-black mt-2">{jobs.length}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2"><Briefcase className="w-5 h-5" /> Your Postings</h2>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-2xl card-shadow overflow-hidden">
              {/* Job Row */}
              <div className="p-6 flex justify-between items-center group">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-primary-600 font-black text-xl flex-shrink-0">
                    {job.companyId?.name?.[0] || 'J'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{job.companyId?.name || 'Company'}</p>
                    <div className="flex gap-3 mt-2 text-[10px] items-center flex-wrap">
                        <span className="bg-slate-100 px-2 py-1 rounded font-bold uppercase">{job.location}</span>
                        <span className="bg-primary-50 text-primary-600 px-2 py-1 rounded font-bold uppercase">{job.type}</span>
                        <span className="text-slate-400 font-medium">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <button onClick={() => toggleApplicants(job._id)} className={`p-2 rounded-lg transition-colors ${viewingJobId === job._id ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`} title="View Applicants">
                    <Users className="w-5 h-5"/>
                  </button>
                  <button onClick={() => handleEdit(job)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit"><Edit3 className="w-5 h-5"/></button>
                  <button onClick={() => handleDelete(job._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>

              {/* Applicant Panel (Toggle) */}
              {viewingJobId === job._id && (
                <div className="border-t border-slate-100 bg-slate-50 p-6 animate-fade-in">
                  <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Applicants for "{job.title}"
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold ml-2">{applicants.length}</span>
                  </h4>

                  {applicantsLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary-600 w-6 h-6" /></div>
                  ) : applicants.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-bold">No applications yet</p>
                      <p className="text-xs mt-1">Share this job listing to attract talent.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applicants.map((app) => (
                        <div key={app._id} className="bg-white rounded-xl p-5 border border-slate-200">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                              {app.candidate?.profilePicture ? (
                                <img src={app.candidate.profilePicture} alt={app.candidate.name} className="w-12 h-12 rounded-full border-2 border-slate-200 object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-black text-lg border-2 border-primary-200">
                                  {app.candidate?.name?.[0]?.toUpperCase() || '?'}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-slate-900">{app.candidate?.name || 'Unknown'}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {app.candidate?.email || 'N/A'}</p>
                                <div className="flex gap-2 mt-1.5 items-center flex-wrap">
                                  {app.resume && (
                                    <button type="button" onClick={() => handleViewResume(app._id)} className="text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors px-2 py-0.5 rounded font-bold flex items-center gap-1 uppercase">
                                      <FileText className="w-3 h-3" /> View Resume
                                    </button>
                                  )}
                                  {app.candidate?._id && (
                                    <button type="button" onClick={async () => {
                                      try {
                                        const { sendMessageApi } = await import("../../api/chat");
                                        await sendMessageApi(app.candidate._id, `Hi ${app.candidate.name.split(' ')[0]}, thanks for applying to ${job.title}!`);
                                        toast.success("Message started!");
                                        window.dispatchEvent(new CustomEvent("open-chat"));
                                      } catch(err) {
                                        toast.error("Failed to start chat.");
                                      }
                                    }} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors px-2 py-0.5 rounded font-bold flex items-center gap-1 uppercase">
                                      <MessageSquare className="w-3 h-3" /> Message
                                    </button>
                                  )}
                                  <span className="text-[10px] text-slate-400">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <StatusBadge status={app.status} />
                              {app.status === 'Pending' && (
                                <>
                                  <button onClick={() => handleStatusChange(app._id, 'Accepted')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Accept">
                                    <CheckCircle2 className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => handleStatusChange(app._id, 'Rejected')} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Reject">
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                              {app.status === 'Accepted' && (
                                <button onClick={() => openInterviewModal(app)} className="flex items-center gap-1.5 text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-lg border border-indigo-200 transition-colors" title="Schedule Interview">
                                  <Calendar className="w-4 h-4" /> {app.interview?.date ? "Reschedule" : "Schedule"}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Interview Info (if scheduled) */}
                          {app.interview?.date && (
                            <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                              <div className="flex-1 text-xs">
                                <span className="font-bold text-indigo-800">Interview: </span>
                                <span className="text-indigo-700">{new Date(app.interview.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {new Date(app.interview.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                              <a href={app.interview.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
                                <Video className="w-3 h-3" /> Meeting Link
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-2xl card-shadow text-center text-slate-400">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-bold">You haven't posted any jobs yet.</p>
              <p className="text-xs mt-1">Click "Post Job" to get started.</p>
          </div>
        )}
      </div>

      {/* ── Post / Edit Job Modal ──────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative animate-fade-in overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold">{editingJob ? "Edit Job Listing" : "Create New Opportunity"}</h3>
                <button onClick={() => setShowModal(false)}><X className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-slate-500">Job Title</label>
                        <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="Software Engineer" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-slate-500">Company</label>
                        {!showNewCompany ? (
                          <>
                            <select 
                                value={formData.companyId} 
                                onChange={(e) => setFormData({...formData, companyId: e.target.value})} 
                                className="input-field bg-[#f8fafc]"
                            >
                                <option value="">Select Company</option>
                                {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <button type="button" onClick={() => setShowNewCompany(true)} className="text-[11px] text-primary-600 font-bold mt-1 hover:underline flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Register New Company
                            </button>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <input value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} className="input-field" placeholder="e.g. Acme Corp" autoFocus />
                            <div className="flex gap-2">
                              <button type="button" onClick={handleCreateCompany} disabled={newCompanyLoading} className="btn-primary !py-1.5 !px-4 !text-xs !rounded-lg">
                                {newCompanyLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Create"}
                              </button>
                              <button type="button" onClick={() => { setShowNewCompany(false); setNewCompanyName(""); }} className="btn-secondary !py-1.5 !px-4 !text-xs !rounded-lg">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-slate-500">Location</label>
                        <input required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input-field" placeholder="London / Remote" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-black uppercase text-slate-500">Job Type</label>
                        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="input-field bg-[#f8fafc]">
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500">Required Skills (Comma separated)</label>
                    <input value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} className="input-field" placeholder="react, nodejs, tailwind" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500">Salary</label>
                    <input required value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="input-field" placeholder="$80k - $120k" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500">Description</label>
                    <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field" placeholder="Role details..." />
                </div>
                <button disabled={formLoading} type="submit" className="btn-primary w-full !py-4 shadow-xl">
                    {formLoading ? <Loader2 className="animate-spin"/> : (editingJob ? "Update Listing" : "Publish Opportunity")}
                </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Interview Scheduling Modal ──────────────────────── */}
      {showInterviewModal && interviewTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowInterviewModal(false)} />
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-fade-in overflow-hidden">
            <div className="p-6 border-b bg-indigo-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-indigo-900 flex items-center gap-2"><Calendar className="w-5 h-5" /> Schedule Interview</h3>
                <p className="text-xs text-indigo-600 font-bold mt-1">For: {interviewTarget.candidate?.name || "Candidate"}</p>
              </div>
              <button onClick={() => setShowInterviewModal(false)} className="bg-white p-2 rounded-full border border-indigo-200"><X className="w-4 h-4 text-indigo-400" /></button>
            </div>
            <form onSubmit={handleScheduleInterview} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">Interview Date & Time</label>
                <input required type="datetime-local" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">Meeting Link</label>
                <div className="relative">
                  <Video className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                  <input required type="url" value={interviewLink} onChange={(e) => setInterviewLink(e.target.value)} className="input-field pl-10" placeholder="https://meet.google.com/..." />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
                <p className="font-bold mb-1">📧 Email Notification</p>
                <p>An email with the interview date, time, and meeting link will be automatically sent to <strong>{interviewTarget.candidate?.email}</strong>.</p>
              </div>
              <button disabled={interviewLoading} type="submit" className="btn-primary w-full !py-3 flex items-center justify-center gap-2">
                {interviewLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Schedule & Notify Candidate</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-200",
    Accepted: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Rejected: "bg-red-50 text-red-500 border-red-200",
  };
  const icons = {
    Pending: <Clock className="w-3 h-3" />,
    Accepted: <CheckCircle2 className="w-3 h-3" />,
    Rejected: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border flex items-center gap-1 ${styles[status] || styles.Pending}`}>
      {icons[status]} {status}
    </span>
  );
};

export default RecruiterDashboard;

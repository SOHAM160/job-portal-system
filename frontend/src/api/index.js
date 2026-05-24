import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ── Auth endpoints ─────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const googleLoginUser = (tokenId, role) => API.post("/auth/google", { tokenId, role });
export const logoutUser = () => API.post("/auth/logout");
export const getMe = () => API.get("/auth/me");

// ── User endpoints ─────────────────────────────────────────
export const getAllUsers = () => API.get("/users");
export const updateProfile = (data) => API.put("/users/profile", data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const toggleSavedJob = (jobId) => API.post(`/users/save-job/${jobId}`);

// ── Company endpoints ──────────────────────────────────────
export const registerCompany = (data) => API.post("/companies/register", data);
export const getCompanies = () => API.get("/companies");
export const getCompanyById = (id) => API.get(`/companies/${id}`);
export const updateCompany = (id, data) => API.put(`/companies/${id}`, data);

// ── Job endpoints ──────────────────────────────────────────
export const createJob = (data) => API.post("/jobs", data);
export const getAllJobs = (params) => API.get("/jobs", { params });
export const getRecruiterJobs = () => API.get("/jobs/recruiter/my-jobs");
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// ── Application endpoints ──────────────────────────────────
export const applyToJob = (jobId, data) => API.post(`/applications/apply/${jobId}`, data);
export const getMyApplications = () => API.get("/applications/my-applications");
export const getJobApplications = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) => API.put(`/applications/${id}/status`, { status });

export default API;

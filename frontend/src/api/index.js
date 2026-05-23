import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ── Auth endpoints ─────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const googleLoginUser = (tokenId) => API.post("/auth/google", { tokenId });
export const logoutUser = () => API.post("/auth/logout");
export const getMe = () => API.get("/auth/me");

// ── User endpoints ─────────────────────────────────────────
export const getAllUsers = () => API.get("/users");
export const updateProfile = (data) => API.put("/users/profile", data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;

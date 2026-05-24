import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleSelection from "./pages/RoleSelection";
import CandidateLanding from "./pages/CandidateLanding";
import RecruiterLanding from "./pages/RecruiterLanding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/dashboards/CandidateDashboard";
import RecruiterDashboard from "./pages/dashboards/RecruiterDashboard";
import CompanyManagement from "./pages/dashboards/CompanyManagement";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE"}>
      <Router>
        <AuthProvider>
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(30, 41, 59, 0.95)",
                color: "#f1f5f9",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/candidate" element={<CandidateLanding />} />
            <Route path="/recruiter" element={<RecruiterLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/companies"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <CompanyManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={["candidate", "recruiter", "admin"]}>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

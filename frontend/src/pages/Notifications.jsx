import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Bell, Briefcase, CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react";
import { getMyApplications } from "../api";
// For recruiter notifications, we would ideally fetch job applications, but let's mock it based on role if no data is found, or fetch candidate data.

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user.role === "candidate") {
          const { data } = await getMyApplications();
          // Synthesize notifications from applications
          const notifs = data.applications.map(app => {
            let message = `You applied for ${app.job.title} at ${app.job.companyId?.name || "Company"}.`;
            let type = "info";
            let icon = <FileText className="w-5 h-5 text-blue-500" />;

            if (app.status === "Accepted") {
              message = `Congratulations! Your application for ${app.job.title} was ACCEPTED!`;
              type = "success";
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            } else if (app.status === "Rejected") {
              message = `Your application for ${app.job.title} was rejected.`;
              type = "error";
              icon = <XCircle className="w-5 h-5 text-red-500" />;
            }

            return {
              id: app._id,
              date: app.updatedAt,
              message,
              type,
              icon
            };
          });
          setNotifications(notifs.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else if (user.role === "recruiter") {
          // Typically recruiters see when people apply to their jobs. 
          // We don't have a global "get all applications for my jobs" endpoint without passing jobId.
          // So we'll display a generic empty state or prompt them.
          setNotifications([
            {
              id: "welcome",
              date: new Date().toISOString(),
              message: "Welcome to your Recruiter Notifications! Check your dashboard for applicant updates.",
              type: "info",
              icon: <Briefcase className="w-5 h-5 text-indigo-500" />
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user.role]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
            <p className="text-sm font-medium text-slate-500">Stay updated on your {user.role === 'candidate' ? 'applications' : 'talent pool'}</p>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="p-6 flex gap-4 hover:bg-slate-50 transition-colors">
                <div className="mt-1">{notif.icon}</div>
                <div>
                  <p className="text-slate-800 font-medium">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1 font-bold tracking-wider uppercase">
                    {new Date(notif.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold">You're all caught up!</p>
              <p className="text-sm">No new notifications at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

import { useState, useEffect } from "react";
import { Plus, Building, MapPin, Globe, Edit3, Loader2, X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getCompanies, registerCompany, updateCompany } from "../../api";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logo: "",
  });

  const fetchCompanies = async () => {
    try {
      const { data } = await getCompanies();
      setCompanies(data.companies);
    } catch (error) {
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editCompany) {
        await updateCompany(editCompany._id, formData);
        toast.success("Company updated");
      } else {
        await registerCompany(formData);
        toast.success("Company registered");
      }
      setShowModal(false);
      setEditCompany(null);
      setFormData({ name: "", description: "", website: "", location: "", logo: "" });
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (company) => {
    setEditCompany(company);
    setFormData({
      name: company.name,
      description: company.description || "",
      website: company.website || "",
      location: company.location || "",
      logo: company.logo || "",
    });
    setShowModal(true);
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-8 rounded-xl card-shadow">
        <div>
          <h2 className="text-2xl font-bold">Company Profiles</h2>
          <p className="text-slate-500">Manage your company identities for job postings</p>
        </div>
        <button 
          onClick={() => { setEditCompany(null); setFormData({ name: "", description: "", website: "", location: "", logo: "" }); setShowModal(true); }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" /> Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.length > 0 ? (
          companies.map((company) => (
            <div key={company._id} className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200 overflow-hidden">
                {company.logo ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" /> : <Building className="w-10 h-10 text-slate-400" />}
              </div>
              <h3 className="text-lg font-bold">{company.name}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {company.location || 'N/A'}</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Website</span>
              </div>
              <button 
                onClick={() => handleEdit(company)}
                className="mt-6 text-primary-600 font-bold flex items-center gap-2 hover:underline"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full p-20 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
            No companies registered yet.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative animate-fade-in overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold">{editCompany ? "Edit Company" : "Register Company"}</h3>
              <button onClick={() => setShowModal(false)}><X className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Company Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="Acme Corp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Location</label>
                  <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input-field" placeholder="NY, USA" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Website URL</label>
                  <input value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="input-field" placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Logo URL</label>
                <input value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} className="input-field" placeholder="Image link" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field" placeholder="About your company..." />
              </div>
              <button disabled={formLoading} type="submit" className="btn-primary w-full mt-4">
                {formLoading ? <Loader2 className="animate-spin" /> : (editCompany ? "Save Changes" : "Register Business")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;

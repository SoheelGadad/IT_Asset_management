import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Globe, RefreshCcw, ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { getApiUrl } from "../api"; // 🌟 Connected your central API utility file (adjust path if needed)

// ✨ Set default to include cookies for Render/Security
axios.defaults.withCredentials = true;

const EditUserPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTargetAdmin, setIsTargetAdmin] = useState(false); 

  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    email: "",
    role: "Employee",
    password: "",
    status: "approved" // ✨ New Flow: Admins create 'approved' users by default
  });

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          // 🌟 Updated Axios call to pass through your environment wrapper
          const res = await axios.get(getApiUrl(`api/users/${id}`));
          setUserData({
            ...res.data,
            password: "", 
          });
          
          if (res.data.role?.toLowerCase() === 'admin') {
            setIsTargetAdmin(true);
          }
        } catch (err) {
          toast.error("Failed to load user data");
          navigate("/user-management");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, navigate]); // 🌟 Cleaned up API_BASE_URL from tracking parameters

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleGenerateOTP = () => {
    setUserData({ ...userData, password: Math.random().toString(36).slice(-8) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...userData };
      
      // 🔐 Security Check
      if (isTargetAdmin) {
        delete submitData.password;
        delete submitData.role; 
      }

      if (id) {
        // 🌟 Updated Axios PUT target with central utility
        await axios.put(getApiUrl(`api/users/${id}`), submitData);
        toast.success("Identity updated successfully!");
      } else {
        // 🌟 Updated Axios POST target with central utility
        await axios.post(getApiUrl("api/users"), submitData);
        toast.success("New account initialized!");
      }
      navigate("/user-management");
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error("Process failed. Please verify network connectivity.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Syncing Identity Records...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      <main className="flex-grow flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-slate-900 p-10 text-center text-white">
            <h2 className="text-3xl font-black tracking-tight">{id ? "Edit User Identity" : "Initialize New Profile"}</h2>
            <p className="text-slate-400 text-[10px] mt-2 uppercase font-black tracking-[0.2em]">{id ? `Global ID: ${id}` : "Register a new entity in the workspace"}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">System Identity ID</label>
                <input 
                  type="text" name="userId" value={userData.userId} onChange={handleInputChange} 
                  readOnly={!!id} 
                  className={`w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none transition font-mono font-bold ${id ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'focus:ring-4 focus:ring-blue-50 focus:border-blue-500'}`} 
                  placeholder="e.g. EMP-2026"
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Display Full Name</label>
                <input 
                  type="text" name="username" value={userData.username} onChange={handleInputChange} 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-bold" 
                  placeholder="Employee Name"
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Corporate Email Address</label>
                <input 
                  type="email" name="email" value={userData.email} onChange={handleInputChange} 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-bold" 
                  placeholder="user@peopledesk.com"
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Permissions Role</label>
                {isTargetAdmin ? (
                   <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 font-black text-xs uppercase tracking-widest">
                      <ShieldCheck size={18} /> Administrative Access
                   </div>
                ) : (
                  <select name="role" value={userData.role} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition bg-white font-black text-gray-700 uppercase text-xs tracking-widest" required>
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                )}
              </div>

              <div className="md:col-span-2 pt-4">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 mb-2 block">Security Credentials</label>
                {isTargetAdmin ? (
                    <div className="flex items-center gap-3 p-5 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-xs font-bold leading-relaxed">
                        <Lock size={20} className="shrink-0" />
                        Admin security protocols restrict credential modification via the portal. Direct database access is required for Admin resets.
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            name="password" 
                            value={userData.password} 
                            onChange={handleInputChange} 
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-mono" 
                            placeholder={id ? "Enter new key to reset (optional)..." : "Set initial password..."}
                            required={!id} 
                        />
                        <button 
                            type="button" 
                            onClick={handleGenerateOTP} 
                            className="bg-blue-50 text-blue-600 px-6 rounded-2xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all group shadow-sm shadow-blue-100"
                            title="Generate Secure Key"
                        >
                            <RefreshCcw size={20} className="group-active:rotate-180 transition-transform duration-500"/>
                        </button>
                    </div>
                )}
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-200 transition-all transform active:scale-95 uppercase tracking-widest text-xs mt-6">
              {id ? "Commit Identity Changes" : "Initialize Access Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditUserPage;
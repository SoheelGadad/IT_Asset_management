import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Globe, User, Mail, Shield, Key, Copy, Check, RefreshCcw, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Logout from "./Logout";
import { getApiUrl } from "../api"; // 🌟 Connected your central API utility file (adjust path if needed)

const EditUsers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    email: "",
    role: "employee",
    password: "",
    status: "approved" // ✨ Default to approved as Admin is creating them
  });

  // 🔄 Fetch user data if in Edit Mode
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          // 🌟 Updated raw URL string to use getApiUrl
          const response = await fetch(getApiUrl(`api/users/${id}`), { credentials: "include" });
          const data = await response.json();
          if (response.ok) {
            setUserData({ ...data, password: "" }); // Don't fetch/show hashed passwords
          }
        } catch (err) {
          toast.error("Failed to load user details");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]); // 🌟 Cleaned up global variables from dependencies

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleGenerateOTP = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setUserData({ ...userData, password: randomPassword });
    setCopied(false);
  };

  const handleCopy = () => {
    if (userData.password) {
      navigator.clipboard.writeText(userData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.info("Security key copied!");
    } else {
      toast.warning("Generate a password first!");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const method = id ? "PUT" : "POST";
    // 🌟 Replaced the hardcoded URL routing assignments with your secure utility wrapper
    const url = id ? getApiUrl(`api/users/${id}`) : getApiUrl("api/users");

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include", 
      });

      if (!response.ok) throw new Error("Operation failed");

      toast.success(id ? "User profile updated!" : "New user registered successfully!");
      navigate("/user-management");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to process request.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">Loading profile data...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      <main className="flex-grow flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-center text-white">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-4 border border-white/10">
              <User size={32} className="text-blue-400" />
            </div>
            <h2 className="text-3xl font-black">{id ? "Edit User Profile" : "Register New Account"}</h2>
            <p className="text-slate-400 text-[10px] mt-2 uppercase font-black tracking-widest">
              Identity & Access Management Node
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System ID</label>
                <input
                  type="text" name="userId" placeholder="e.g. EMP-101"
                  value={userData.userId} onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
                <input
                  type="text" name="username" placeholder="Full Name"
                  value={userData.username} onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email" name="email" placeholder="name@company.com"
                  value={userData.email} onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Role</label>
                <select
                  name="role" value={userData.role} onChange={handleInputChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition bg-white font-bold text-gray-700"
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 pt-4">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Security Credential</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text" name="password" placeholder={id ? "Leave blank to keep current" : "Set login password"}
                  value={userData.password} onChange={handleInputChange}
                  className="flex-grow px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition font-mono"
                  required={!id}
                />
                <div className="flex gap-2">
                  <button type="button" onClick={handleGenerateOTP} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition border border-blue-100 text-xs">
                    <RefreshCcw size={14} /> Generate
                  </button>
                  <button type="button" onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-100 text-xs">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? "Done!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-8 mt-6">
              <button type="submit" className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs">
                {id ? "Commit Updates" : "Initialize User"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditUsers;
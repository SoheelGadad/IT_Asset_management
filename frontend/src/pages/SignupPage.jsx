import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Globe, UserPlus, Mail, Lock, ShieldCheck } from "lucide-react";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("employee");
  const navigate = useNavigate();

  // --- THE FIX: Define the API Base URL ---
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const submitForm = async (e) => {
    e.preventDefault();
    const userDetails = { username, password, email, userType };

    try {
      // --- THE FIX: Use the full URL here ---
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Signup success! Waiting for admin approval.");
        navigate("/login");
      } else {
        toast.error(data.error || "Please check the input data");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Server connection failed");
    }
  };

  // ... (Rest of your UI code remains exactly the same)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* 🚀 Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          
          <div className="bg-blue-600 p-8 text-center">
            <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
            <p className="text-blue-100 text-sm mt-2">Join PeopleDesk IT Management</p>
          </div>

          <form onSubmit={submitForm} className="p-8 space-y-5">
            {/* Username Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700" htmlFor="username">
                <UserPlus size={16} className="text-blue-600" /> Username
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                type="text"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                <Mail size={16} className="text-blue-600" /> Email Address
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                type="email"
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                <Lock size={16} className="text-blue-600" /> Password
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Role Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700" htmlFor="userType">
                <ShieldCheck size={16} className="text-blue-600" /> Preferred Role
              </label>
              <select
                id="userType"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 bg-white"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition duration-300 transform active:scale-[0.98]"
            >
              Request Access
            </button>

            <div className="text-center mt-6">
              <Link to="/login" className="text-blue-600 hover:underline text-sm font-semibold">
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
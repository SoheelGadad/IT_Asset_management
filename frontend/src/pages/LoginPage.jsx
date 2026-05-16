import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Globe, Mail, Lock, LogIn, Loader2 } from "lucide-react"; // Added Loader2

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✨ New state for loading
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const loginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // 🚀 Start loading
    
    const loginDetails = { email, password };

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginDetails),
        credentials: "include", 
      });

      const data = await res.json();

      if (res.ok) {
        if (!data.token) {
          toast.error("Login failed: No security token received.");
          setIsLoading(false);
          return;
        }
        
        const role = data.userType ? data.userType.toLowerCase() : "";
        
        localStorage.setItem("Authtoken", String(data.token));
        localStorage.setItem("UserRole", String(role));
        localStorage.setItem("UserId", String(data.userId));
        localStorage.setItem("UserName", String(data.username));

        toast.success(`Welcome back, ${data.username || role}`);
        
        setTimeout(() => {
            navigate(role === 'admin' ? "/admin-dashboard" : "/employee-dashboard");
        }, 1500); // 🕒 Slightly longer delay so they see the success state
      } else {
        toast.error(data.error || "Please check your credentials");
        setIsLoading(false); // 🛑 Stop loading on error
      }
    } catch (error) {
      console.error("Login fetch error:", error);
      toast.error("Server connection failed");
      setIsLoading(false); // 🛑 Stop loading on error
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {/* ✨ Loading Overlay Pop-up */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-100">
            <Loader2 className="text-blue-600 animate-spin mb-4" size={48} />
            <p className="text-gray-700 font-bold">Authenticating...</p>
            <p className="text-gray-400 text-sm">Please wait a moment</p>
          </div>
        </div>
      )}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                <LogIn className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
            <p className="text-blue-100 text-sm mt-2">Sign in to manage your assets</p>
          </div>

          <form onSubmit={loginSubmit} className="p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                <Mail size={16} className="text-blue-600" /> Email Address
              </label>
              <input
                disabled={isLoading} // Disable input while loading
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-50"
                type="email" id="email" placeholder="Enter your email"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                <Lock size={16} className="text-blue-600" /> Password
              </label>
              <input
                disabled={isLoading} // Disable input while loading
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-50"
                type="password" id="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading} // Prevent double clicks
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Don't have an account? <Link to="/sign-up" className="text-blue-600 hover:underline font-bold">Create Account</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

// ... (Rest of your helper functions stay the same)
export const getUserType = () => { /* ... same code ... */ };
export const getUserId = () => { /* ... same code ... */ };

export default LoginPage;
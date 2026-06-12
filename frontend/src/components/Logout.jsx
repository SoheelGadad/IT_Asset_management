import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react';
import { getApiUrl } from '../api'; // 🌟 Connected your central API utility file (adjust path if needed)

const Logout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        if (!window.confirm("Are you sure you want to terminate your session?")) return;

        try {
            // 1. Backend Sync: Clear the HttpOnly session cookie safely on your cloud domain
            // 🌟 Replaced the hardcoded template literal with your secure utility wrapper
            await fetch(getApiUrl("api/logout"), {
                method: 'GET',
                credentials: 'include' 
            });

            // 2. 🧹 CLEAR LOCAL STATE
            // We clear everything we set during the Login process
            const itemsToRemove = ["Authtoken", "UserRole", "UserId", "UserName"];
            itemsToRemove.forEach(item => localStorage.removeItem(item));

            // Optional: Manually expire the client-side cookie if it exists
            document.cookie = "Authtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";

            toast.success('Session ended successfully');
            
            // 3. Redirect to Public Homepage
            navigate('/'); 

        } catch (error) {
            console.error("Logout error:", error);
            
            // 🚨 Fallback: If network fails, force clear everything locally 
            // so the user isn't stuck "logged in" on their own screen.
            localStorage.clear(); 
            navigate('/login');
        }
    };

    return (
        <button 
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-100 hover:border-rose-500 rounded-xl transition-all duration-300 group shadow-sm shadow-rose-50"
        >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
        </button>
    );
};

export default Logout;
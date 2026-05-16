import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LogOut, Globe, LayoutDashboard, Box, 
  Users, Settings, Bell, Wrench, UserCircle 
} from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("UserRole")?.toLowerCase();
  const userName = localStorage.getItem("UserName") || "User";

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getLinkStyle = (path) => 
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
      location.pathname === path 
      ? "bg-blue-600 text-white shadow-md" 
      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo */}
          <Link to="#" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Globe className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              People<span className="text-blue-600">Desk</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {/* --- ADMIN ONLY LINKS --- */}
            {role === "admin" && (
              <>
                <Link to="/admin-dashboard" className={getLinkStyle("/admin-dashboard")}>
                  <LayoutDashboard size={18} /> Admin Panel
                </Link>
                <Link to="/asset-inventory" className={getLinkStyle("/asset-inventory")}>
                  <Box size={18} /> Inventory
                </Link>
                <Link to="/user-management" className={getLinkStyle("/user-management")}>
                  <Users size={18} /> Users
                </Link>
                <Link to="/manage-requests" className={getLinkStyle("/manage-requests")}>
                  <Bell size={18} /> Requests
                </Link>
                {/* Visual Separator for Admin */}
                <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
              </>
            )}

            {/* --- EMPLOYEE DASHBOARD (Visible to Admin & Employee) --- */}
            {(role === "employee" || role === "admin") && (
              <>
                <Link to="/employee-dashboard" className={getLinkStyle("/employee-dashboard")}>
                  <UserCircle size={18} /> {role === "admin" ? "View as Emp" : "My Assets"}
                </Link>
                <Link to="/ComingSoons" className={getLinkStyle("/ComingSoons")}>
                  <Settings size={18} /> Support
                </Link>
              </>
            )}

            {/* --- TECHNICIAN ONLY LINKS --- */}
            {role === "technician" && (
              <Link to="/technician-dashboard" className={getLinkStyle("/technician-dashboard")}>
                <Wrench size={18} /> Work Orders
              </Link>
            )}
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{role}</p>
              <p className="text-sm font-semibold text-gray-700">{userName}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-semibold text-sm"
            >
              <LogOut size={18} />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
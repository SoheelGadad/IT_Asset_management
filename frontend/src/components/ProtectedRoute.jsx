import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  
  // 1. Helper to safely extract cookies
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    // Remove potential wrapping quotes added by some server-side cookie parsers
    return match ? decodeURIComponent(match[2]).replace(/^"|"$/g, '') : null;
  };

  /**
   * 🔍 TOKEN SEARCH:
   * Checks LocalStorage first, then fallbacks to Cookies.
   */
  const token = localStorage.getItem("Authtoken") || getCookie("Authtoken");

  /**
   * 🛡️ JWT STRUCTURE VALIDATOR:
   * Prevents "InvalidTokenError: missing part #2" by ensuring 
   * the string actually looks like a JWT (header.payload.signature).
   */
  const isValidJwt = (t) => t && typeof t === 'string' && t.split('.').length === 3;

  if (!token || !isValidJwt(token)) {
    console.warn("🔐 Access Denied: Missing or malformed JWT format.");
    // Clear out any "garbage" values to prevent infinite loops
    localStorage.removeItem("Authtoken"); 
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    
    // Normalize user role from various possible JWT payload keys
    const rawRole = decoded.userType || decoded.role || decoded.userRole || "";
    const userRole = rawRole.toLowerCase();

    // 2. CHECK EXPIRATION (JWT 'exp' is in seconds)
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      console.warn("⏰ Session Expired: Clearing storage.");
      localStorage.clear(); 
      return <Navigate to="/login" replace />;
    }

    // 3. ROLE-BASED ACCESS CONTROL (RBAC)
    if (allowedRoles) {
      const formattedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
      
      if (!formattedAllowedRoles.includes(userRole)) {
        console.warn(`🚫 Unauthorized: [${userRole}] cannot access [${allowedRoles}]`);
        
        // Redirect user to their own valid dashboard based on their real role
        const redirectPath = userRole === 'admin' ? "/admin-dashboard" : "/employee-dashboard";
        return <Navigate to={redirectPath} replace />; 
      }
    }

    // ✅ Everything passed! Render the child component
    return <Outlet />;

  } catch (error) {
    console.error("🔥 Critical Auth Error:", error.message);
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
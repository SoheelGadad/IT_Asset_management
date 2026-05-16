import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Layouts ---
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute"; 

// --- Public Pages ---
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

// --- Admin Pages ---
import { Admin } from "./pages/Admin";
import Asset from "./pages/Asset";
import UserManagementPage from "./pages/UserManagementPage";
import AddNewAssetPage from "./pages/AddNewAssetPage";
import EditAssetPage from "./components/EditAsset";
import EditUserPage from "./pages/EditUserPage"; 
import AssignedAssetPage from "./pages/AssignedAssetPage";
import ManageRequests from "./pages/ManageRequests"; // ✨ NEW: Import the request manager
import MaintenanceDashboard  from "./components/MaintenanceDashboard";

// --- Employee Pages ---
import Employee from "./pages/Employee";

// --- Technician Pages ---
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AddNewTechnicianstatus from "./pages/AddNewTechnicianstatus"

import ComingSoons from "./components/ComingSoon";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                
                {/* 🔓 PUBLIC ROUTES */}
                <Route element={<AuthLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="sign-up" element={<SignupPage />} />
                </Route>

                {/* 🛡️ PROTECTED DASHBOARD ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        
                        {/* 🏢 Admin Modules */}
                        <Route path="admin-dashboard" element={<Admin />} />
                        <Route path="asset-inventory" element={<Asset />} />
                        <Route path="user-management" element={<UserManagementPage />} />
                        <Route path="add-newAsset" element={<AddNewAssetPage />} />
                        <Route path="edit-asset/:id" element={<EditAssetPage />} />
                        <Route path="assigned-assets" element={<AssignedAssetPage />} />
                        <Route path="maintenance-dashboard" element={<MaintenanceDashboard />} />
                        <Route path="manage-requests" element={<ManageRequests />} /> {/* ✨ NEW: Route for Admin Approval */}
                        
                        {/* 👥 User Management (Add & Edit) */}
                        <Route path="create-user" element={<EditUserPage />} />
                        <Route path="edit-user/:id" element={<EditUserPage />} />

                        {/* 👤 Employee Modules */}
                        <Route path="employee-dashboard" element={<Employee />} />
                        
                        {/* 🛠️ Technician & Status Modules */}
                        <Route path="technician-dashboard" element={<TechnicianDashboard />} />
                        <Route path="technician-dashboard/:assetId" element={<TechnicianDashboard />} />
                        <Route path="add-new-technician-status/:id" element={<AddNewTechnicianstatus />} />

                        <Route path="/ComingSoons" element={<ComingSoons />} />
                    </Route>
                </Route>

                {/* 🚨 Catch-all 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
                
            </Route>
        )
    );

    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                theme="light"
                role="alert"
                pauseOnHover
                draggable
            />
        </>
    );
}

export default App;
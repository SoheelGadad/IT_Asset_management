import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 Added useNavigate
import axios from 'axios';
import { 
  Globe, 
  Package, 
  Users, 
  ClipboardList, 
  UserCog, 
  ArrowUpRight, 
  Activity,
  ChevronRight,
  Wrench,
  Clock,
  Eye,
  LayoutDashboard,
  AlertCircle // 👈 Added for notifications
} from 'lucide-react';
import Logout from './Logout';

// ✨ AXIOS CREDENTIALS
axios.defaults.withCredentials = true;

const AdminDashboard = () => {
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0); // 👈 New state for claims
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ✨ Sub-menu state management
    const [showInventoryMenu, setShowInventoryMenu] = useState(false);
    const [showTrackingMenu, setShowTrackingMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 🔄 Added fetch for pending requests
                const [assetRes, userRes, requestRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/assets`),
                    axios.get(`${API_BASE_URL}/api/users`),
                    axios.get(`${API_BASE_URL}/api/requests/pending`)
                ]);
                
                setTotalAssets(Array.isArray(assetRes.data) ? assetRes.data.length : 0);
                setTotalUsers(Array.isArray(userRes.data) ? userRes.data.length : 0);
                setPendingRequests(Array.isArray(requestRes.data) ? requestRes.data.length : 0);
            } catch (error) {
                console.error('Dashboard sync error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [API_BASE_URL]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">

            <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                
                <header className="mb-10 text-left">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Management Console</h2>
                    <p className="text-gray-500 font-medium mt-1">Full control over organization hardware and user permissions.</p>
                </header>

                {/* 🔔 NEW: Pending Requests Notification Bar */}
                {pendingRequests > 0 && (
                    <div 
                        onClick={() => navigate('/manage-requests')}
                        className="mb-8 bg-amber-50 border border-amber-200 p-5 rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-all group animate-in slide-in-from-top-4 duration-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-500 text-white p-3 rounded-2xl shadow-lg shadow-amber-200">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest">Action Required</h4>
                                <p className="text-amber-700 font-bold">{pendingRequests} Pending Asset Claims are waiting for your approval.</p>
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded-full text-amber-500 group-hover:translate-x-1 transition-transform">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                )}

                {/* 📊 High-Level Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-gray-50 flex items-center gap-6">
                        <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
                            <Package size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Assets</p>
                            <h3 className="text-3xl font-black">{loading ? '...' : totalAssets}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-emerald-100/50 border border-gray-50 flex items-center gap-6">
                        <div className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Users</p>
                            <h3 className="text-3xl font-black">{loading ? '...' : totalUsers}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-gray-50 flex items-center gap-6">
                        <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Server Status</p>
                            <h3 className="text-xl font-black text-indigo-600 uppercase">Operational</h3>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-gray-800">
                    <LayoutDashboard className="text-blue-600" size={24} /> 
                    Operational Modules
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* ✨ Module 1: Asset Inventory Hub */}
                    <div 
                        onMouseEnter={() => setShowInventoryMenu(true)}
                        onMouseLeave={() => setShowInventoryMenu(false)}
                        className="group relative bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="bg-pink-50 text-pink-600 p-5 rounded-[1.5rem] w-fit mb-6 group-hover:bg-pink-600 group-hover:text-white transition-all duration-500">
                            <ClipboardList size={32} />
                        </div>
                        <h4 className="text-2xl font-black mb-2">Hardware Hub</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">Manage central inventory and maintenance logs.</p>
                        
                        {!showInventoryMenu ? (
                            <div className="flex items-center text-pink-600 font-bold text-xs uppercase tracking-widest">
                                Expand Portal <ArrowUpRight size={14} className="ml-1" />
                            </div>
                        ) : (
                            <div className="space-y-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <Link to="/asset-inventory" className="flex items-center justify-between p-3.5 bg-pink-50 text-pink-700 rounded-2xl font-bold hover:bg-pink-600 hover:text-white transition-all text-xs">
                                    1. Full Inventory <ChevronRight size={16} />
                                </Link>
                                <Link to="/maintenance-dashboard" className="flex items-center justify-between p-3.5 bg-amber-50 text-amber-700 rounded-2xl font-bold hover:bg-amber-600 hover:text-white transition-all text-xs">
                                    2. Maintenance Portal <Activity size={16} />
                                </Link>
                                <Link to="/add-new-technician-status/search" className="flex items-center justify-between p-3.5 bg-blue-50 text-blue-700 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all text-xs border border-blue-100">
                                    3. New Status Entry <Wrench size={16} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ✨ Module 2: User Access Hub */}
                    <div 
                        onMouseEnter={() => setShowUserMenu(true)}
                        onMouseLeave={() => setShowUserMenu(false)}
                        className="group relative bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="bg-blue-50 text-blue-600 p-5 rounded-[1.5rem] w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                            <UserCog size={32} />
                        </div>
                        <h4 className="text-2xl font-black mb-2">User Access</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">Manage accounts, roles, and employee permissions.</p>
                        
                        {!showUserMenu ? (
                            <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest">
                                Configure Users <ArrowUpRight size={14} className="ml-1" />
                            </div>
                        ) : (
                            <div className="space-y-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <Link to="/user-management" className="flex items-center justify-between p-3.5 bg-blue-50 text-blue-700 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all text-xs">
                                    Manage Profiles <ChevronRight size={16} />
                                </Link>
                                <Link to="/manage-requests" className="flex items-center justify-between p-3.5 bg-amber-50 text-amber-700 rounded-2xl font-bold hover:bg-amber-600 hover:text-white transition-all text-xs">
                                    Pending Claims <AlertCircle size={16} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ✨ Module 3: Tracking Hub */}
                    <div 
                        onMouseEnter={() => setShowTrackingMenu(true)}
                        onMouseLeave={() => setShowTrackingMenu(false)}
                        className="group relative bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="bg-violet-50 text-violet-600 p-5 rounded-[1.5rem] w-fit mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                            <Package size={32} />
                        </div>
                        <h4 className="text-2xl font-black mb-2">Asset Tracking</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">Monitor location shifts and current assignments.</p>
                        
                        {!showTrackingMenu ? (
                            <div className="flex items-center text-violet-600 font-bold text-xs uppercase tracking-widest">
                                Track Moves <ArrowUpRight size={14} className="ml-1" />
                            </div>
                        ) : (
                            <div className="space-y-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <Link to="/assigned-assets" className="flex items-center justify-between p-3.5 bg-violet-50 text-violet-700 rounded-2xl font-bold hover:bg-violet-600 hover:text-white transition-all text-xs">
                                    Current Assignments <ChevronRight size={16} />
                                </Link>
                                <Link to="/ComingSoons" className="flex items-center justify-between p-3.5 bg-gray-50 text-gray-400 rounded-2xl font-bold border border-dashed border-gray-200 text-[10px]">
                                    <span className="flex items-center gap-2"><Clock size={14}/> GPS Mapping</span>
                                    <span className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-500 font-black uppercase text-[8px]">Soon</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
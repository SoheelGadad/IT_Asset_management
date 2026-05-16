import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, User, Calendar, ExternalLink, Plus, Save, X, Settings, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ClaimAsset from '../components/ClaimAsset';

const EmployeeDashboard = () => {
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [allAssetDetails, setAllAssetDetails] = useState([]);
    const [pendingClaims, setPendingClaims] = useState([]); 
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showClaimForm, setShowClaimForm] = useState(false);
    
    // ✨ Edit Profile States
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editData, setEditData] = useState({ username: "", email: "" });

    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const profileRes = await fetch(`${API_BASE_URL}/api/getEmployees`, { credentials: 'include' });
            if (!profileRes.ok) throw new Error('Auth failed');
            const empData = await profileRes.json();
            setEmployee(empData);
            setEditData({ username: empData.username, email: empData.email });

            const [assignRes, masterRes, requestsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/assigned-assets/employee/${empData.userId}`, { credentials: 'include' }),
                fetch(`${API_BASE_URL}/api/assets`, { credentials: 'include' }),
                fetch(`${API_BASE_URL}/api/requests/pending`, { credentials: 'include' }) 
            ]);

            const assignedData = await assignRes.json();
            const masterData = await masterRes.json();
            const requestsData = await requestsRes.json();

            setAssignedAssets(Array.isArray(assignedData) ? assignedData : []);
            setAllAssetDetails(Array.isArray(masterData) ? masterData : []);
            if (Array.isArray(requestsData)) {
                setPendingClaims(requestsData.filter(req => req.userId === empData.userId));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/api/users/${employee.userId}`, editData);
            setEmployee({ ...employee, ...editData });
            localStorage.setItem("UserName", editData.username); 
            setIsEditingProfile(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <LayoutDashboard className="text-blue-600" size={28} /> Dashboard
                        </h2>
                        <p className="text-gray-500 font-medium italic">Welcome back, {employee?.username}</p>
                    </div>
                    
                    {!showClaimForm && (
                        <button 
                            onClick={() => setShowClaimForm(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
                        >
                            <Plus size={18} /> Claim New Asset
                        </button>
                    )}
                </div>

                {!showClaimForm ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* 👤 LEFT SIDEBAR: PROFILE */}
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><User size={32} /></div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900">Profile</h3>
                                            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Verified Identity</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                                        className={`p-2 rounded-xl transition-colors ${isEditingProfile ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:text-blue-600'}`}
                                    >
                                        {isEditingProfile ? <X size={20} /> : <Settings size={20} />}
                                    </button>
                                </div>

                                {isEditingProfile ? (
                                    <form onSubmit={handleUpdateProfile} className="space-y-4 animate-in fade-in duration-300">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full mt-1 px-4 py-2 bg-slate-50 border border-gray-100 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                                value={editData.username}
                                                onChange={(e) => setEditData({...editData, username: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                            <input 
                                                type="email" 
                                                className="w-full mt-1 px-4 py-2 bg-slate-50 border border-gray-100 rounded-xl font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                                value={editData.email}
                                                onChange={(e) => setEditData({...editData, email: e.target.value})}
                                            />
                                        </div>
                                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition">
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-5 animate-in fade-in duration-300">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Name</p>
                                            <p className="font-bold text-gray-700">{employee?.username}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                            <p className="font-bold text-gray-700">{employee?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">User ID</p>
                                            <p className="font-mono font-bold text-gray-400 bg-slate-50 px-2 py-1 rounded w-fit text-xs">{employee?.userId}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* 📦 RIGHT SECTION: ASSET TABLE */}
                        <section className="lg:col-span-2">
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Package className="text-blue-600" size={20} /> My IT Inventory
                                    </h3>
                                    <span className="px-4 py-1 bg-white border border-gray-100 shadow-sm text-gray-500 text-xs font-black rounded-full">
                                        {assignedAssets.length} Assets
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hardware Unit</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned On</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {assignedAssets.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="px-8 py-16 text-center text-gray-400 italic font-medium">
                                                        No hardware assets found under your profile.
                                                    </td>
                                                </tr>
                                            ) : (
                                                assignedAssets.map(asset => {
                                                    const master = allAssetDetails.find(a => a.assetId === asset.assetId);
                                                    return (
                                                        <tr key={asset.assetId} className="group hover:bg-blue-50/30 transition-all">
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                        <Package size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-black text-gray-900">{master?.assetName || 'System Device'}</div>
                                                                        <div className="text-[10px] font-mono text-gray-400 font-bold uppercase">{asset.assetId}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5">
                                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                                                    <Calendar size={14} className="text-gray-300" />
                                                                    {new Date(asset.assignmentDate).toLocaleDateString()}
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-5 text-right">
                                                                <button 
                                                                    onClick={() => navigate(`/technician-dashboard/${asset.assetId}`)}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-blue-600 text-xs font-black uppercase rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                                >
                                                                    History <ExternalLink size={12} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    /* CLAIM FORM */
                    <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-black text-xl tracking-tight text-gray-800">New Asset Registration</h3>
                            <button 
                                onClick={() => setShowClaimForm(false)} 
                                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                        </div>
                        <ClaimAsset userId={employee?.userId} onComplete={() => { setShowClaimForm(false); fetchDashboardData(); }} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default EmployeeDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Globe, Plus, Edit3, Trash2, User, Package, X, Calendar, ChevronRight, CheckCircle } from "lucide-react";
import Logout from "./Logout";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// ✨ AXIOS CREDENTIALS
axios.defaults.withCredentials = true;

const AssignedAssets = () => {
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);

    const [userId, setUserId] = useState("");
    const [assetId, setAssetId] = useState("");
    const [assignmentDate, setAssignmentDate] = useState("");

    const [users, setUsers] = useState([]);
    const [assets, setAssets] = useState([]);

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const fetchAllData = async () => {
        try {
            const [assignRes, userRes, assetRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/assignments`),
                axios.get(`${API_BASE_URL}/api/users`),
                axios.get(`${API_BASE_URL}/api/assets`)
            ]);
            setAssignedAssets(assignRes.data);
            setUsers(userRes.data);
            setAssets(assetRes.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            toast.error("Failed to sync with cloud database");
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [API_BASE_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !assetId || !assignmentDate) return;

        // Check for duplicate assignment
        const existingAssignment = assignedAssets.find(
            (a) => a.assetId === assetId && a._id !== currentAssignment?._id
        );

        if (existingAssignment) {
            const assignedTo = users.find(u => (u.userId || u._id) === existingAssignment.userId);
            toast.warning(`⚠️ This hardware is already held by ${assignedTo ? assignedTo.username : 'another user'}`);
            return;
        }

        try {
            if (editMode) {
                const res = await axios.put(`${API_BASE_URL}/api/assignments/${currentAssignment._id}`, { userId, assetId, assignmentDate });
                setAssignedAssets(prev => prev.map(a => a._id === currentAssignment._id ? res.data : a));
                toast.success("Deployment details updated");
            } else {
                const res = await axios.post(`${API_BASE_URL}/api/assignments`, { userId, assetId, assignmentDate });
                
                // 🤖 AUTOMATION STEP: Also update the master asset status to 'Active'
                await axios.put(`${API_BASE_URL}/api/assets/${assetId}`, { assignedUser: userId, status: 'Active' });
                
                setAssignedAssets(prev => [...prev, res.data]);
                toast.success("Hardware deployed successfully!");
            }
            closeModal();
            fetchAllData(); // Refresh all data to sync status
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Cloud deployment failed");
        }
    };

    const closeModal = () => {
        setUserId("");
        setAssetId("");
        setAssignmentDate("");
        setEditMode(false);
        setCurrentAssignment(null);
        setModalOpen(false);
    };

    const handleEdit = (assignment) => {
        setCurrentAssignment(assignment);
        setUserId(assignment.userId);
        setAssetId(assignment.assetId);
        setAssignmentDate(new Date(assignment.assignmentDate).toISOString().split("T")[0]);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleDelete = async (id, currentAssetId) => {
        if (!window.confirm("Terminate this assignment? Hardware will return to warehouse.")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/assignments/${id}`);
            
            // 🤖 AUTOMATION: Set asset back to Unassigned
            await axios.put(`${API_BASE_URL}/api/assets/${currentAssetId}`, { assignedUser: 'Unassigned' });
            
            setAssignedAssets(prev => prev.filter(a => a._id !== id));
            toast.info("Hardware recovered to stock");
            fetchAllData();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Recovery process failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Asset Tracking</h2>
                        <p className="text-gray-500 mt-1 font-medium">Monitoring {assignedAssets.length} active hardware deployments</p>
                    </div>
                    <button
                        onClick={() => { setEditMode(false); setModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 uppercase text-xs tracking-widest"
                    >
                        <Plus size={18} /> New Deployment
                    </button>
                </header>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-8 py-5">Employee Context</th>
                                    <th className="px-8 py-5">Hardware Logic</th>
                                    <th className="px-8 py-5">Assigned Date</th>
                                    <th className="px-8 py-5 text-right">Action Hub</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {assignedAssets.map(a => {
                                    const user = users.find(u => (u.userId || u._id) === a.userId);
                                    const asset = assets.find(ast => (ast.assetId || ast._id) === a.assetId);
                                    
                                    return (
                                        <tr key={a._id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900">{user ? user.username : "External Entity"}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{a.userId}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                                                        <Package size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900">{asset ? asset.assetName : "Orphaned Reference"}</div>
                                                        <div className="text-[10px] font-mono font-bold text-violet-400 uppercase">{a.assetId}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                                                    <Calendar size={14} className="text-blue-400" />
                                                    {new Date(a.assignmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>

                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(a)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition" title="Edit Assignment"><Edit3 size={16} /></button>
                                                    <button onClick={() => handleDelete(a._id, a.assetId)} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-600 hover:text-white transition" title="Terminate"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {assignedAssets.length === 0 && (
                        <div className="py-24 text-center">
                             <Package className="mx-auto text-gray-100 mb-4" size={80} />
                             <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Deployment Log is Empty</p>
                        </div>
                    )}
                </div>
            </main>

            {/* 📝 Deployment Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
                        <button onClick={closeModal} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
                        
                        <div className="text-center mb-10">
                            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 border border-blue-100">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{editMode ? "Update Deployment" : "Hardware Deployment"}</h3>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Assignment Verification Protocol</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Target Employee</label>
                                <select 
                                    value={userId} 
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 bg-white font-bold text-gray-700 transition-all"
                                    required
                                >
                                    <option value="">Select Account...</option>
                                    {users.map(u => <option key={u._id} value={u.userId || u._id}>{u.username} [{u.userId}]</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Hardware Unit</label>
                                <select 
                                    value={assetId} 
                                    onChange={(e) => setAssetId(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 bg-white font-bold text-gray-700 transition-all"
                                    required
                                >
                                    <option value="">Select Asset...</option>
                                    {assets.map(asset => {
                                        const isAssigned = assignedAssets.find(a => a.assetId === (asset.assetId || asset._id));
                                        return (
                                            <option key={asset._id} value={asset.assetId || asset._id} disabled={isAssigned && !editMode}>
                                                {asset.assetName} {isAssigned ? "🔒" : "🔓"}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Effective Deployment Date</label>
                                <input 
                                    type="date" 
                                    value={assignmentDate} 
                                    onChange={(e) => setAssignmentDate(e.target.value)}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-50 bg-white font-bold text-gray-700 transition-all"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] uppercase text-xs tracking-widest mt-4">
                                {editMode ? "Push Updates to Cloud" : "Confirm Deployment"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignedAssets;
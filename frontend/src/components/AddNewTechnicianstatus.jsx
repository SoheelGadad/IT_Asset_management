import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Globe, Package, Calendar, Activity, Save, Tag, Hash, User, ShieldCheck, Loader2, Search, History, MessageSquare, Edit, ArrowLeft } from 'lucide-react';
import Logout from './Logout';
import { toast } from 'react-toastify';

const AddNewTechnicianstatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(false);
    const [manualId, setManualId] = useState("");
    const [recentUpdates, setRecentUpdates] = useState([]);

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const [formData, setFormData] = useState({
        assetId: id && id !== 'search' ? id : '',
        assetName: '',
        userName: '',
        warranty: '',
        scheduledDate: '',
        status: '',
        notes: ''
    });

    useEffect(() => {
        fetchRecentUpdates();
        if (id && id !== 'search') {
            fetchDetails();
        }
    }, [id]);

    const fetchDetails = async () => {
        setFetching(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/assets/${id}`, { withCredentials: true });
            setFormData({
                assetId: res.data.assetId || id,
                assetName: res.data.assetName || '',
                userName: res.data.assignedUser || 'Unassigned',
                warranty: res.data.warranty || 'Standard',
                status: res.data.status || 'Active',
                notes: res.data.notes || '',
                scheduledDate: res.data.scheduledDate 
                    ? res.data.scheduledDate.split('T')[0] 
                    : new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            toast.error("Asset not found in inventory");
            navigate('/add-new-technician-status/search');
        } finally {
            setFetching(false);
        }
    };

    const fetchRecentUpdates = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/assets`, { withCredentials: true });
            const sorted = Array.isArray(res.data) 
                ? [...res.data].reverse().slice(0, 5) 
                : [];
            setRecentUpdates(sorted);
        } catch (err) {
            console.error("Failed to load history");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/api/assets/${id}`, formData, { withCredentials: true });
            toast.success("Maintenance records synchronized!");
            fetchRecentUpdates();
            setTimeout(() => navigate('/admin-dashboard'), 1000);
        } catch (error) {
            toast.error("Cloud sync failed. Check connectivity.");
        }
    };

    // 🔍 SEARCH VIEW: Shown when the Admin enters the module from the Dashboard
    if (!id || id === 'search') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full text-center border border-gray-100">
                    <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Search size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Maintenance Portal</h2>
                    <p className="text-gray-400 text-sm mb-8">Identify the asset to modify health records.</p>
                    <input 
                        type="text" 
                        placeholder="Enter Asset ID (e.g. AST-102)" 
                        className="w-full p-4 rounded-xl border border-gray-200 mb-4 text-center uppercase font-bold outline-none focus:border-blue-500 transition"
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && navigate(`/add-new-technician-status/${manualId}`)}
                    />
                    <button 
                        onClick={() => navigate(`/add-new-technician-status/${manualId}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black shadow-lg transition-all active:scale-95"
                    >
                        Access Records
                    </button>
                    <Link to="/admin-dashboard" className="inline-flex items-center gap-2 mt-6 text-xs font-black uppercase text-gray-400 hover:text-blue-600 transition tracking-widest">
                        <ArrowLeft size={12} /> Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // 📝 FORM VIEW: Shown when a specific Asset ID is provided
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-100">
                        <Globe className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">PeopleDesk</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/admin-dashboard" className="text-xs font-black uppercase text-gray-400 hover:text-blue-600 transition tracking-tighter">Dashboard</Link>
                    <Logout />
                </div>
            </nav>

            <main className="p-6 py-12 max-w-5xl mx-auto w-full space-y-12">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-slate-900 p-8 text-center text-white relative">
                        {fetching && <Loader2 className="absolute top-4 right-4 animate-spin opacity-50" size={20} />}
                        <h2 className="text-3xl font-black tracking-tight">Maintenance Log Entry</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Official Hardware Service Node</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Read Only Fields */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset ID</label>
                                <input type="text" value={formData.assetId} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 font-mono text-sm cursor-not-allowed text-gray-400 font-bold" readOnly />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Holder</label>
                                <input type="text" value={formData.userName} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 text-sm cursor-not-allowed text-gray-400 font-bold" readOnly />
                            </div>

                            {/* Editable Fields */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Service Date</label>
                                <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition font-medium" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Health Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none bg-white transition font-bold text-gray-700" required>
                                    <option value="Active">Active (Functional)</option>
                                    <option value="Repair">Under Repair</option>
                                    <option value="Inactive">Decommissioned</option>
                                </select>
                            </div>

                            {/* Notes Field */}
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MessageSquare size={14} /> Technician Remarks / Observation
                                </label>
                                <textarea 
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Enter details of service, repairs, or discovered faults..."
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition min-h-[120px] resize-none font-medium"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            <Save size={18} /> Update Cloud Records
                        </button>
                    </form>
                </div>

                {/* History Section */}
                <section className="space-y-4">
                    <h3 className="text-xl font-black flex items-center gap-2 text-gray-800">
                        <History className="text-blue-600" size={24} /> 
                        Latest Maintenance Activity
                    </h3>
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-6 py-5">Asset Reference</th>
                                        <th className="px-6 py-5">System Health</th>
                                        <th className="px-6 py-5">Technician Notes</th>
                                        <th className="px-6 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-xs">
                                    {recentUpdates.map((asset) => (
                                        <tr key={asset.assetId} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="font-black text-gray-900">{asset.assetName}</div>
                                                <div className="text-[10px] text-gray-400 font-mono font-bold">{asset.assetId}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full font-black uppercase text-[9px] tracking-widest ${
                                                    asset.status === 'Active' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-amber-600 bg-amber-50 border border-amber-100'
                                                }`}>
                                                    {asset.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500 font-medium max-w-[250px] truncate italic">
                                                {asset.notes || 'No remarks logged'}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button onClick={() => navigate(`/add-new-technician-status/${asset.assetId}`)} className="p-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">
                                                    <Edit size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AddNewTechnicianstatus;
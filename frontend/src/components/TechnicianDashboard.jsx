import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Globe, Package, Calendar, Activity, ShieldCheck, 
    Printer, Search, X, MessageSquare, User, 
    Clock, AlertCircle, ChevronRight, History, AlertTriangle,
    Undo2, ShoppingCart, UserMinus
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getApiUrl } from '../api'; // 🌟 Connected your central API utility file (adjust path if needed)

const TechnicianDashboard = () => {
    const { assetId: urlId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState(urlId || "");
    const [assetData, setAssetData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (urlId && urlId !== 'search') {
            fetchAssetData(urlId);
            setSearchId(urlId);
        }
    }, [urlId]);

    const fetchAssetData = async (id) => {
        if (!id) return;
        setLoading(true);
        setError(false);
        try {
            // 🌟 Updated raw URL template literal string to utilize the getApiUrl configuration
            const res = await axios.get(getApiUrl(`api/assets/${id.toUpperCase()}?t=${Date.now()}`), { withCredentials: true });
            const data = res.data;

            // Sort history to show most recent at top
            const recentUpdates = data.statusHistory ? [...data.statusHistory].reverse().slice(0, 4) : [];
            
            // Filter old assignments (past users)
            const oldAssignments = data.assignmentHistory ? data.assignmentHistory.filter(h => h.status === 'returned' || h.status === 'reassigned') : [];

            setAssetData({
                ...data,
                assetName: data.name || data.assetName || 'Hardware Asset',
                userName: data.assignedUser || 'Unassigned',
                updates: recentUpdates,
                legacy: oldAssignments, // 🆕 Old Assets/Past Users
                notes: data.notes || "No current maintenance remarks."
            });
        } catch (err) {
            console.error("Fetch error:", err);
            assetData(null);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleNewAssetRequest = async () => {
        const confirm = window.confirm("Are you sure you want to request a new asset procurement from the Admin?");
        if(!confirm) return;

        try {
            // 🌟 Converted the POST operation endpoint to leverage the environment wrapper
            await axios.post(getApiUrl('api/requests'), {
                requestType: 'procurement',
                assetName: 'NEW ASSET REQUEST',
                status: 'pending',
                notes: `Technician requested new hardware on ${new Date().toLocaleDateString()}`
            }, { withCredentials: true });
            toast.success("Procurement request sent to Admin");
        } catch (err) {
            toast.error("Failed to send request");
        }
    };

    const handleReportIssue = async () => {
        try {
            // 🌟 Updated the database state patch mutation to pipe through your proxy configuration
            await axios.put(getApiUrl(`api/assets/${assetData._id}`), {
                status: 'Maintenance',
                notes: `USER REPORTED ISSUE: Hardware check requested on ${new Date().toLocaleDateString()}`
            }, { withCredentials: true });
            toast.warning("Issue reported to IT Support");
            fetchAssetData(assetData.assetId);
        } catch (err) {
            toast.error("Failed to submit report");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/technician-dashboard/${searchId.trim().toUpperCase()}`);
            fetchAssetData(searchId.trim());
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            <main className="flex-grow p-6 py-12 max-w-6xl mx-auto w-full">
                
                {/* 🔍 Search Header */}
                <section className="mb-8 no-print flex flex-col md:flex-row gap-4 items-center">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-grow w-full">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Track System ID..." 
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none font-bold uppercase shadow-sm"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="px-8 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition uppercase text-xs">Track</button>
                    </form>
                    
                    {/* 🆕 New Asset Request Button */}
                    <button 
                        onClick={handleNewAssetRequest}
                        className="w-full md:w-auto px-6 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 uppercase text-xs shadow-lg"
                    >
                        <ShoppingCart size={16} /> Request New Asset
                    </button>
                </section>

                {loading ? (
                    <div className="text-center py-20"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div></div>
                ) : assetData ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* 🟦 Top Card */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-center text-white">
                            <h2 className="text-3xl font-black">{assetData.assetName}</h2>
                            <p className="text-blue-400 text-xs font-mono font-bold uppercase tracking-widest mt-1">{assetData.assetId}</p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Status Overview */}
                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm grid grid-cols-2 gap-6">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                        <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm"><User size={20} /></div>
                                        <div><p className="text-[9px] font-black text-gray-400 uppercase">Current User</p><p className="font-bold text-sm">{assetData.userName}</p></div>
                                    </div>
                                    <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${assetData.status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                                        <div className="p-3 bg-white rounded-xl shadow-sm"><Activity size={20} /></div>
                                        <div><p className="text-[9px] font-black opacity-60 uppercase">Status</p><p className="font-black text-sm uppercase">{assetData.status}</p></div>
                                    </div>
                                </div>

                                {/* 🕒 Legacy & History Section */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Admin Update History */}
                                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                            <History size={16} className="text-blue-600" /> Recent Logs
                                        </h3>
                                        <div className="space-y-4">
                                            {assetData.updates.map((upd, i) => (
                                                <div key={i} className="pl-4 border-l-2 border-blue-100 py-1">
                                                    <p className="text-[10px] font-bold text-blue-600">{new Date(upd.date).toLocaleDateString()}</p>
                                                    <p className="text-xs text-gray-600 italic font-medium">"{upd.note}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Past Assignments */}
                                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                            <UserMinus size={16} className="text-indigo-600" /> Legacy Owners
                                        </h3>
                                        <div className="space-y-4">
                                            {assetData.legacy && assetData.legacy.length > 0 ? assetData.legacy.map((owner, i) => (
                                                <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                                    <div>
                                                        <p className="text-xs font-black text-gray-700">{owner.userName}</p>
                                                        <p className="text-[9px] text-gray-400">{new Date(owner.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className="text-[8px] bg-slate-200 px-2 py-0.5 rounded uppercase font-bold">{owner.status}</span>
                                                </div>
                                            )) : (
                                                <p className="text-center text-[10px] text-slate-300 italic py-4">No previous assignment history.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1 space-y-4">
                                {/* Operations */}
                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                                    <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black shadow-lg">
                                        <Printer size={16} /> Print Asset Report
                                    </button>

                                    <button 
                                        onClick={handleReportIssue}
                                        className="w-full py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all"
                                    >
                                        <AlertTriangle size={16} /> Mark for Maintenance
                                    </button>
                                </div>

                                <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                                    <h4 className="font-black text-xs mb-2">Technician Protocol</h4>
                                    <p className="text-[10px] font-medium text-indigo-100 leading-relaxed">
                                        Always verify physical Serial Numbers against the System ID before submitting maintenance logs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <AlertCircle className="mx-auto text-slate-200 mb-4" size={64} />
                        <h3 className="text-xl font-black text-slate-300 tracking-tight">Track a Hardware Node</h3>
                        <p className="text-slate-400 font-medium text-sm mt-2">Enter an ID to view assignment history and lifecycle status.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TechnicianDashboard;
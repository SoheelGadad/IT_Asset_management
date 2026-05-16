import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Inbox, 
    CheckCircle2, 
    XCircle, 
    User, 
    Package, 
    Calendar, 
    Globe, 
    Search, 
    Filter,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logout from '../components/Logout';
import ConfirmModal from '../components/ConfirmModal';

// ✨ AXIOS CREDENTIALS
axios.defaults.withCredentials = true;

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Modal State
    const [modalConfig, setModalConfig] = useState({ open: false, type: '', data: null });

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/requests/pending`);
            setRequests(res.data || []);
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load request queue");
        } finally {
            setLoading(false);
        }
    };

const handleAction = async () => {
    const { type, data } = modalConfig;
    // Ensure the endpoint matches the backend exactly
    const endpoint = type === 'approve' ? 'approve' : 'reject';
    
    try {
        // We use PUT because we are updating the status of an existing request
        await axios.put(`${API_BASE_URL}/api/requests/${data._id}/${endpoint}`);
        
        toast.success(`Request ${type}ed successfully!`);
        
        // Remove from UI list immediately
        setRequests(requests.filter(r => r._id !== data._id));
        setModalConfig({ open: false, type: '', data: null });
    } catch (error) {
        console.error(`${type} error:`, error);
        toast.error(error.response?.data?.error || `Action failed during ${type}`);
    }
};

    const filteredRequests = requests.filter(r => 
        r.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.assetId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">

            <main className="p-6 md:p-10 max-w-5xl mx-auto w-full">
                
                {/* 👋 Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            <Inbox className="text-blue-600" size={32} /> Incoming Claims
                        </h2>
                        <p className="text-gray-500 mt-1 font-medium italic">Verify and approve hardware self-registration requests</p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Filter by ID..." 
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none transition text-sm font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="font-black text-[10px] uppercase tracking-widest text-gray-400">Syncing Cloud Queue...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-400 uppercase tracking-tight">Queue Clear</h3>
                        <p className="text-gray-400 text-sm mt-2 font-medium">No pending asset claims require your attention.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map((req) => (
                            <div key={req._id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-100/30 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 transition-all group animate-in slide-in-from-bottom-4 duration-300">
                                
                                <div className="flex items-center gap-6 flex-grow">
                                    {/* Employee ID */}
                                    <div className="flex items-center gap-4 border-r border-gray-50 pr-6">
                                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Requester</p>
                                            <p className="font-bold text-gray-900">{req.userId}</p>
                                        </div>
                                    </div>

                                    {/* Asset ID */}
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Hardware Claimed</p>
                                            <p className="font-bold text-gray-900">{req.assetId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[9px] font-black text-gray-300 uppercase">Submitted On</p>
                                        <p className="text-xs font-bold text-gray-500">{new Date(req.requestDate).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setModalConfig({ open: true, type: 'approve', data: req })}
                                            className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition active:scale-90"
                                            title="Approve & Assign"
                                        >
                                            <CheckCircle2 size={20} />
                                        </button>
                                        <button 
                                            onClick={() => setModalConfig({ open: true, type: 'reject', data: req })}
                                            className="p-3 bg-white border border-gray-200 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-100 transition active:scale-90"
                                            title="Reject Claim"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Final Confirmation Modal */}
            <ConfirmModal 
                open={modalConfig.open}
                variant={modalConfig.type === 'approve' ? 'success' : 'danger'}
                title={modalConfig.type === 'approve' ? 'Approve Hardware Assignment' : 'Reject Request'}
                message={modalConfig.type === 'approve' 
                    ? `This will officially link Asset ${modalConfig.data?.assetId} to Employee ${modalConfig.data?.userId} in the master database.`
                    : `Are you sure you want to dismiss the claim from ${modalConfig.data?.userId}?`}
                onClose={() => setModalConfig({ open: false, type: '', data: null })}
                onConfirm={handleAction}
            />

        </div>
    );
};

export default ManageRequests;
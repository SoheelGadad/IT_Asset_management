import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Globe, 
    ClipboardList, 
    AlertTriangle, 
    Wrench, 
    ChevronRight, 
    Search, 
    Filter,
    Calendar,
    User,
    ArrowLeft
} from 'lucide-react';
import Logout from './Logout';

const MaintenanceDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    useEffect(() => {
        fetchAllMaintenanceLogs();
    }, []);

    const fetchAllMaintenanceLogs = async () => {
        try {
            setLoading(true);
            // Fetch all assets; we will filter for those with issues/maintenance status
            const res = await axios.get(`${API_BASE_URL}/api/assets`, { withCredentials: true });
            
            // Logic: Show assets that are NOT 'Active' or have existing technician notes
            const issues = res.data.filter(asset => 
                asset.status === 'Repair' || 
                asset.status === 'Maintenance' || 
                (asset.notes && asset.notes !== 'No maintenance remarks available.')
            );
            
            setLogs(issues);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => 
        log.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.assetName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">

            <main className="p-6 md:p-10 max-w-6xl mx-auto w-full">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            <Wrench className="text-blue-600" size={32} /> Maintenance Logs
                        </h2>
                        <p className="text-gray-500 font-medium">Monitoring all hardware issues and reported repairs.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by Asset ID or Name..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none font-bold transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Scanning fleet for issues...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                        <ShieldCheck size={60} className="mx-auto text-emerald-200 mb-6" />
                        <h3 className="text-xl font-black text-gray-400 uppercase">Fleet is Healthy</h3>
                        <p className="text-gray-400 text-sm mt-2">No active maintenance reports found.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredLogs.map((item) => (
                            <div 
                                key={item._id}
                                onClick={() => navigate(`/technician-dashboard/${item.assetId}`)}
                                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`p-4 rounded-2xl shadow-lg ${
                                        item.status === 'Repair' ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-amber-500 text-white shadow-amber-100'
                                    }`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-gray-900 leading-tight">{item.assetName}</h4>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{item.assetId}</span>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                                <User size={10} /> {item.assignedUser || 'Unassigned'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-grow max-w-md">
                                    <p className="text-sm text-gray-500 italic font-medium line-clamp-2">
                                        "{item.notes || 'No specific remarks.'}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right px-4 border-r border-gray-100">
                                        <p className="text-[9px] font-black text-gray-300 uppercase">Status</p>
                                        <p className={`text-xs font-black uppercase ${item.status === 'Repair' ? 'text-rose-500' : 'text-amber-500'}`}>
                                            {item.status}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MaintenanceDashboard;
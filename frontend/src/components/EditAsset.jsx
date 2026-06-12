import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Globe, 
    Package, 
    Hash, 
    Tag, 
    Monitor, 
    Calendar, 
    ShieldCheck, 
    MapPin, 
    UserPlus, 
    ArrowLeft,
    Wrench,
    Settings,
    MessageSquare,
    Activity
} from 'lucide-react';
import { toast } from 'react-toastify';
import Logout from './Logout';
import { getApiUrl } from '../api'; // 🌟 Connected your central API utility file (adjust path if needed)

const EditAsset = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    
    const [assetData, setAssetData] = useState({
        assetId: '',
        assetName: '',
        assetType: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        warranty: '',
        location: '',
        assignedUser: 'Unassigned',
        status: 'Active',
        notes: '' // 👈 Added this to sync with Technician Dashboard
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // 🌟 Updated concurrent data fetching routes to map via your flexible proxy setup
                const [empRes, assetRes] = await Promise.all([
                    axios.get(getApiUrl('api/users'), { withCredentials: true }),
                    axios.get(getApiUrl(`api/assets/${id}?t=${Date.now()}`), { withCredentials: true })
                ]);

                const approvedEmps = empRes.data.filter(u => u.status === 'approved');
                setEmployees(approvedEmps);

                const rawData = assetRes.data;
                const formattedDate = rawData.purchaseDate 
                    ? rawData.purchaseDate.split('T')[0] 
                    : '';

                setAssetData({
                    ...rawData,
                    assetName: rawData.name || rawData.assetName || '',
                    purchaseDate: formattedDate,
                    assignedUser: rawData.assignedUser || 'Unassigned',
                    notes: rawData.notes || '' 
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error("Failed to load asset details");
                navigate('/asset-inventory');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]); // 🌟 Cleaned up API_BASE_URL from tracking parameters

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAssetData({ ...assetData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                ...assetData,
                name: assetData.assetName, 
                status: assetData.assignedUser !== 'Unassigned' ? 'Active' : assetData.status
            };

            // 🌟 Updated state synchronization endpoint to wrap inside getApiUrl
            await axios.put(getApiUrl(`api/assets/${id}`), payload, { withCredentials: true });
            toast.success('Asset configuration updated and synced');
            navigate('/asset-inventory');
        } catch (error) {
            console.error('Update Error:', error);
            toast.error('Failed to sync changes to cloud');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Syncing Master Record...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            <main className="flex-grow flex items-center justify-center p-6 py-12">
                <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-xl shadow-blue-100/30 border border-gray-100 overflow-hidden">
                    
                    <div className="bg-slate-900 p-10 text-center text-white relative">
                        <button
                            type="button"
                            onClick={() => navigate(`/add-new-technician-status/${id}`)}
                            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-amber-500 hover:text-white rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/10"
                        >
                            <Wrench size={14} /> Service Log
                        </button>

                        <div className="inline-flex p-4 bg-blue-600/20 rounded-[1.5rem] mb-4 backdrop-blur-md border border-blue-500/30">
                            <Settings size={32} className="text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Update Configuration</h2>
                        <p className="text-slate-400 text-[10px] mt-2 uppercase font-black tracking-[0.2em]">
                            System Node: {id}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Hash size={12} className="text-blue-600" /> Unique Identifier
                                </label>
                                <input type="text" value={assetData.assetId} readOnly className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 font-mono font-bold cursor-not-allowed" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Tag size={12} /> Asset Name
                                </label>
                                <input type="text" name="assetName" value={assetData.assetName} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-bold" required />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Activity size={12} /> Live Status
                                </label>
                                <select name="status" value={assetData.status} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white font-bold text-gray-700 outline-none">
                                    <option value="Active">Active</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Retired">Retired</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Package size={12} /> Model Details
                                </label>
                                <input type="text" name="model" value={assetData.model} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none transition font-medium" required />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Hash size={12} /> Serial Number
                                </label>
                                <input type="text" name="serialNumber" value={assetData.serialNumber} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl border border-gray-200 font-medium outline-none" required />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MapPin size={12} /> Office Location
                                </label>
                                <input type="text" name="location" value={assetData.location} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl border border-gray-200 font-medium outline-none" required />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <UserPlus size={14} /> Assigned Custodian
                                </label>
                                <select
                                    name="assignedUser"
                                    value={assetData.assignedUser}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none transition bg-white font-black text-gray-700"
                                >
                                    <option value="Unassigned">-- IN WAREHOUSE STOCK --</option>
                                    {employees.map(emp => (
                                        <option key={emp.userId} value={emp.userId}>
                                            {emp.username} [{emp.userId}]
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MessageSquare size={14} /> Technician Remarks (Visible to User)
                                </label>
                                <textarea 
                                    name="notes" 
                                    value={assetData.notes} 
                                    onChange={handleInputChange} 
                                    rows="3"
                                    placeholder="Enter status updates or maintenance logs here..."
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 outline-none transition font-medium focus:border-amber-500 focus:ring-4 focus:ring-amber-50"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-8">
                            <button type="submit" className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs">
                                Confirm & PUSH Updates
                            </button>
                            <button type="button" onClick={() => navigate('/asset-inventory')} className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-[1.5rem] hover:bg-gray-50 transition-all uppercase tracking-widest text-xs">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditAsset;
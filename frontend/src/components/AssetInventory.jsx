import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Globe, 
    Package, 
    Plus, 
    Search, 
    Edit3, 
    Trash2, 
    Monitor, 
    Hash, 
    MapPin, 
    UserCheck,
    Download,
    Wrench, 
    ExternalLink
} from 'lucide-react';
import Logout from './Logout';
import { getApiUrl } from '../api'; 

// ✨ AXIOS CREDENTIALS
axios.defaults.withCredentials = true;

const AssetInventory = () => {
    const [assets, setAssets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAssets, setFilteredAssets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = assets.filter(asset => {
            const assignedUser = asset.assignedUser || '';
            const searchLower = searchQuery.toLowerCase();
            return (
                asset.assetId.toLowerCase().includes(searchLower) ||
                asset.assetName.toLowerCase().includes(searchLower) ||
                asset.assetType.toLowerCase().includes(searchLower) ||
                asset.model.toLowerCase().includes(searchLower) ||
                asset.serialNumber.toLowerCase().includes(searchLower) ||
                asset.location.toLowerCase().includes(searchLower) ||
                assignedUser.toLowerCase().includes(searchLower)
            );
        });
        setFilteredAssets(filtered);
    }, [searchQuery, assets]);

    const fetchData = async () => {
        try {
            const response = await axios.get(getApiUrl('api/assets'));
            setAssets(response.data || []);
            setFilteredAssets(response.data || []); 
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const downloadCSV = () => {
        const headers = "Asset Name,Asset ID,Type,Model,Serial Number,Purchase Date,Warranty,Location,Assigned User\n";
        const rows = filteredAssets.map(asset => {
            return [
                `"${asset.assetName}"`,
                `"${asset.assetId}"`,
                `"${asset.assetType}"`,
                `"${asset.model}"`,
                `"${asset.serialNumber}"`,
                `"${new Date(asset.purchaseDate).toLocaleDateString()}"`,
                `"${asset.warranty}"`,
                `"${asset.location}"`,
                `"${asset.assignedUser || 'Unassigned'}"`
            ].join(",");
        }).join("\n");

        const csvContent = headers + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `PeopleDesk_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteAsset = async (assetId) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await axios.delete(getApiUrl(`api/assets/${assetId}`));
                setAssets(assets.filter(asset => asset.assetId !== assetId));
                alert('Asset deleted successfully!');
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                           <Package className="text-blue-600" size={32} /> Asset Inventory
                        </h2>
                        <p className="text-gray-500 mt-1 font-medium italic">
                            Central Hardware Repository • {assets.filter(a => !a.assignedUser || a.assignedUser === 'Unassigned').length} available for claim
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={downloadCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:text-blue-600 transition shadow-sm"
                        >
                            <Download size={18} /> Export CSV
                        </button>
                        <Link to="/add-newAsset" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            <Plus size={18} /> Add New Asset
                        </Link>
                    </div>
                </header>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Showing {filteredAssets.length} of {assets.length}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            {/* 🛠️ FIX: Removed self-closing syntax from thead element */}
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Asset Details</th>
                                    <th className="px-6 py-4">Type/Model</th>
                                    <th className="px-6 py-4">Identification</th>
                                    <th className="px-6 py-4">Status & Warranty</th>
                                    <th className="px-6 py-4">Current Holder</th>
                                    <th className="px-6 py-4 text-right">Operations</th>
                                </tr>
                            </thead>
                            
                            {/* 🛠️ FIX: Added complete tbody data mapping block */}
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {filteredAssets.map(asset => (
                                    <tr key={asset.assetId} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-900">{asset.assetName}</div>
                                            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">{asset.assetId}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 font-bold text-gray-700">
                                                <Monitor size={14} className="text-blue-500" /> {asset.assetType}
                                            </div>
                                            <div className="text-xs text-gray-500">{asset.model}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400">
                                                <Hash size={12} /> {asset.serialNumber}
                                            </div>
                                            <div className="text-[10px] flex items-center gap-1 text-rose-500 mt-1 uppercase font-black">
                                                <MapPin size={10}/> {asset.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-xs font-bold text-gray-700">
                                                Purchased: {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}
                                            </div>
                                            <div className="text-[10px] font-black text-emerald-600 uppercase mt-1">
                                                {asset.warranty} Coverage
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                                                !asset.assignedUser || asset.assignedUser === 'Unassigned' 
                                                ? 'bg-amber-50 text-amber-600 border-amber-100 italic' 
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                <UserCheck size={12} />
                                                {asset.assignedUser || 'Available for Claim'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button 
                                                    onClick={() => navigate(`/add-new-technician-status/${asset.assetId}`)}
                                                    className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-xl transition"
                                                    title="Update Maintenance"
                                                >
                                                    <Wrench size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/edit-asset/${asset.assetId}`)}
                                                    className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                                                    title="Edit Configuration"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteAsset(asset.assetId)}
                                                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                                    title="Remove Asset"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredAssets.length === 0 && (
                        <div className="py-24 text-center">
                            <Package className="mx-auto text-gray-100 mb-4" size={100} />
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">Inventory empty or no matches found</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AssetInventory;
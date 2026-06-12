import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Send, Hash, Tag, MapPin, Cpu, Calendar } from 'lucide-react'; 
import { toast } from 'react-toastify';
import { getApiUrl } from '../api'; // 🌟 Connected your central API utility file (adjust path if needed)

const ClaimAsset = ({ userId, onComplete }) => {
    const [formData, setFormData] = useState({
        assetId: "",
        assetName: "",
        assetType: "Laptop",
        serialNumber: "",  
        location: "",      
        model: "",         
        receivedDate: new Date().toISOString().split('T')[0] 
    });
    const [submitting, setSubmitting] = useState(false);

    // ✨ AUTO-GENERATE ASSET ID ON LOAD
    useEffect(() => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const year = new Date().getFullYear();
        const generatedId = `AST-${year}-${randomNum}`;
        setFormData(prev => ({ ...prev, assetId: generatedId }));
    }, []);

    const handleClaim = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error("User session not found. Please re-login.");
            return;
        }

        setSubmitting(true);
        try {
            // 🌟 Updated Axios post endpoint to handle deployments dynamically through your cloud wrapper
            await axios.post(getApiUrl('api/requests'), {
                userId,
                ...formData, 
                assetId: formData.assetId.trim().toUpperCase(),
                requestType: 'assignment',
                status: 'pending'
            }, { withCredentials: true });

            toast.success("Request sent to Admin for approval!");
            
            // Re-generate ID and Reset form
            const nextId = `AST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            setFormData({ 
                assetId: nextId, 
                assetName: "", 
                assetType: "Laptop",
                serialNumber: "",
                location: "",
                model: "",
                receivedDate: new Date().toISOString().split('T')[0]
            });
            
            if (onComplete) onComplete(); 
            
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Invalid Asset ID or already claimed.";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-blue-200 shadow-sm max-w-lg mx-auto">
            <div className="text-center mb-6">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <Package size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Register Hardware</h3>
                <p className="text-gray-500 text-sm mt-2">Provide detailed device info for verification.</p>
            </div>
            
            <form onSubmit={handleClaim} className="space-y-4">
                {/* Row 1: System ID & Category */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">System ID</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-slate-50 font-bold uppercase cursor-not-allowed text-xs"
                            value={formData.assetId}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Category</label>
                        <select 
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 outline-none font-bold bg-white text-xs"
                            value={formData.assetType}
                            onChange={(e) => setFormData({...formData, assetType: e.target.value})}
                        >
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Mobile">Mobile Phone</option>
                        </select>
                    </div>
                </div>

                {/* Device Name */}
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Device Name</label>
                    <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="e.g. MacBook Pro" 
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 outline-none font-bold"
                            value={formData.assetName}
                            onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                            required
                        />
                    </div>
                </div>

                {/* Serial Number & Model */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Serial Number</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="SN-XXXX" 
                                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-xs"
                                value={formData.serialNumber}
                                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Model/Version</label>
                        <div className="relative">
                            <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="M3 / Gen 11" 
                                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-xs"
                                value={formData.model}
                                onChange={(e) => setFormData({...formData, model: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Location & Received Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Work Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="Goa / Remote" 
                                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-xs"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Received Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="date" 
                                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-xs"
                                value={formData.receivedDate}
                                onChange={(e) => setFormData({...formData, receivedDate: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                </div>
                
                <button 
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
                >
                    {submitting ? "Processing..." : <><Send size={18} /> Submit Claim</>}
                </button>
            </form>
        </div>
    );
};

export default ClaimAsset;
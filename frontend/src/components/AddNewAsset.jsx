import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Globe, Package, Tag, Monitor, Hash, Calendar, ShieldCheck, MapPin, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Logout from './Logout';

// ✨ AXIOS CREDENTIALS
axios.defaults.withCredentials = true;

const AddNewAsset = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    
    // 1. Initial State includes 'Active' status by default
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
        status: 'Active' // ✨ Added default status
    });

    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

    const generateUniqueId = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(1000 + Math.random() * 9000); 
        return `AST-${year}-${randomNum}`;
    };

    useEffect(() => {
        // 2. Set ID and fetch employees
        setAssetData(prev => ({ ...prev, assetId: generateUniqueId() }));

        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/users`);
                const approvedEmps = response.data.filter(user => user.status === 'approved');
                setEmployees(approvedEmps);
            } catch (error) {
                console.error('Error fetching employees:', error);
                toast.error("Could not load employee list");
            }
        };
        fetchEmployees();
    }, [API_BASE_URL]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAssetData({ ...assetData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/assets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assetData)
            });

            if (!response.ok) throw new Error('Failed to add asset');

            toast.success('New hardware registered in inventory');
            navigate('/asset-inventory');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Registration failed. ID might be duplicate.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            
            <main className="flex-grow flex items-center justify-center p-6 py-12">
                <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-xl shadow-blue-100/30 border border-gray-100 overflow-hidden">
                    
                    <div className="bg-slate-900 p-10 text-center text-white relative">
                        <div className="inline-flex p-4 bg-white/10 rounded-[1.5rem] mb-4 backdrop-blur-md border border-white/10">
                            <Package size={32} className="text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Register New Asset</h2>
                        <p className="text-slate-400 text-[10px] mt-2 uppercase font-black tracking-[0.2em]">
                            Global Hardware Provisioning Node
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            
                            {/* Asset ID */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Hash size={12} className="text-blue-600" /> System Asset ID
                                </label>
                                <input 
                                    type="text" 
                                    value={assetData.assetId} 
                                    readOnly 
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 font-mono font-bold cursor-not-allowed text-sm"
                                />
                            </div>

                            {/* Asset Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Tag size={12} /> Hardware Reference Name
                                </label>
                                <input 
                                    type="text" name="assetName" placeholder="e.g. MacBook Pro M3" value={assetData.assetName} onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition font-medium"
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Monitor size={12} /> Category/Type
                                </label>
                                <input 
                                    type="text" name="assetType" placeholder="e.g. Workstation" value={assetData.assetType} onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition font-medium"
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Package size={12} /> Model Specifications
                                </label>
                                <input 
                                    type="text" name="model" placeholder="e.g. 16GB / 512GB SSD" value={assetData.model} onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition font-medium"
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Hash size={12} /> Manufacturer Serial Number
                                </label>
                                <input 
                                    type="text" name="serialNumber" placeholder="S/N: ABC123XYZ" value={assetData.serialNumber} onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition font-medium"
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Calendar size={12} /> Procurement Date
                                </label>
                                <input 
                                    type="date" name="purchaseDate" value={assetData.purchaseDate} onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition bg-white font-medium"
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <ShieldCheck size={12} /> Warranty Coverage
                                </label>
                                <input 
                                    type="text" name="warranty" placeholder="e.g. 3 Year Comprehensive" value={assetData.warranty} onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition font-medium"
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MapPin size={12} /> Storage Location
                                </label>
                                <input 
                                    type="text" name="location" placeholder="e.g. Server Room B" value={assetData.location} onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition font-medium"
                                    required 
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1 mt-4">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <UserPlus size={14} /> Initial Assignment (Optional)
                                </label>
                                <select
                                    name="assignedUser"
                                    value={assetData.assignedUser}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition bg-white font-bold text-gray-700"
                                >
                                    <option value="Unassigned">-- AVAILABLE IN STOCK --</option>
                                    {employees.map(emp => (
                                        <option key={emp.userId} value={emp.userId}>
                                            {emp.username} [{emp.userId}]
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98] uppercase tracking-widest text-xs"
                            >
                                Confirm Registration
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/asset-inventory')}
                                className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-[1.5rem] hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddNewAsset;
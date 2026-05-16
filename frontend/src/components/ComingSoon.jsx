import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowLeft, Clock, Construction, Rocket, ShieldAlert } from 'lucide-react';

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">

            <main className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-2xl w-full text-center">
                    
                    {/* 🚀 Animated Icon Section */}
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-blue-50">
                            <Construction size={64} className="text-blue-600 mx-auto mb-4 animate-bounce" />
                            <div className="flex justify-center gap-4 text-gray-300">
                                <Clock size={24} />
                                <Rocket size={24} />
                                <ShieldAlert size={24} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Feature <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Under Development</span>
                    </h2>
                    
                    <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed">
                        We are currently building the <b>Real-Time Asset Tracking Node</b>. <br /> 
                        This feature will allow live GPS monitoring and movement logs for high-value hardware.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => navigate('/admin-dashboard')}
                            className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition transform active:scale-95"
                        >
                            Return to Dashboard
                        </button>
                        <div className="px-8 py-4 bg-white border border-gray-200 text-gray-400 font-bold rounded-2xl cursor-default">
                            Version 2.0 Feature
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ComingSoon;
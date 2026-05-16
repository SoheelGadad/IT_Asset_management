import React from "react";
import { ArrowRight, ShieldCheck, BarChart3, Settings, Wrench, Globe, UserPlus, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-gray-900">

      {/* 🚀 Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-32 bg-slate-50">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-8 animate-bounce">
            <Zap size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Automated Asset Workflows</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tighter">
            Smart IT Asset <br />
            <span className="text-blue-600">Lifecycle.</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The modern standard for tracking, claiming, and maintaining company hardware. Empower your employees with self-service asset registration.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="flex items-center justify-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] text-lg font-black hover:bg-blue-700 transition shadow-2xl shadow-blue-200 uppercase tracking-widest text-xs"
            >
              Get Started <ArrowRight size={20} />
            </Link>

            <Link
              to="/sign-up"
              className="flex items-center justify-center px-12 py-5 rounded-[1.5rem] border-2 border-gray-200 text-gray-900 font-black hover:bg-gray-50 transition uppercase tracking-widest text-xs"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ⭐ Features Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Cloud-Native IT Infrastructure
            </h2>
            <p className="text-gray-400 text-lg font-medium">Precision tools for the modern decentralized workforce.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Self-Service (New Flow) */}
            <div className="group p-10 rounded-[2.5rem] border border-gray-100 bg-white hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="mb-8 inline-block p-5 rounded-2xl bg-blue-50 group-hover:bg-blue-600 transition-all duration-500">
                <UserPlus className="text-blue-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="font-black text-xl mb-4 text-gray-900 tracking-tight">Self-Service Claim</h3>
              <p className="text-gray-400 leading-relaxed text-sm font-medium">
                Allow employees to claim their own hardware serials for instant admin approval.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-10 rounded-[2.5rem] border border-gray-100 bg-white hover:border-indigo-500 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="mb-8 inline-block p-5 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 transition-all duration-500">
                <ShieldCheck className="text-indigo-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="font-black text-xl mb-4 text-gray-900 tracking-tight">Access Control</h3>
              <p className="text-gray-400 leading-relaxed text-sm font-medium">
                Enterprise-grade role management for Admins, Technicians, and Employees.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-10 rounded-[2.5rem] border border-gray-100 bg-white hover:border-emerald-500 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="mb-8 inline-block p-5 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 transition-all duration-500">
                <Wrench className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="font-black text-xl mb-4 text-gray-900 tracking-tight">Maintenance Logs</h3>
              <p className="text-gray-400 leading-relaxed text-sm font-medium">
                Full audit trails for hardware repairs, OS updates, and decommission cycles.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group p-10 rounded-[2.5rem] border border-gray-100 bg-white hover:border-orange-500 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="mb-8 inline-block p-5 rounded-2xl bg-orange-50 group-hover:bg-orange-600 transition-all duration-500">
                <BarChart3 className="text-orange-500 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="font-black text-xl mb-4 text-gray-900 tracking-tight">Audit Analytics</h3>
              <p className="text-gray-400 leading-relaxed text-sm font-medium">
                Generate CSV reports and real-time statistics of your entire hardware inventory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 CTA Section */}
      <section className="mx-6 mb-24 relative overflow-hidden bg-slate-900 rounded-[4rem] py-28 px-6 text-center shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-white">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter">
            Modernize your <br />IT workspace today.
          </h2>
          <p className="mb-12 text-slate-400 text-xl font-medium">
            Join thousands of teams using PeopleDesk to automate hardware provisioning and lifecycle management.
          </p>

          <Link
            to="/sign-up"
            className="inline-block bg-blue-600 text-white px-14 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-blue-900/20"
          >
            Initialize Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Hero;
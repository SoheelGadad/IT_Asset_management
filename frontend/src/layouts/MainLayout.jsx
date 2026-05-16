import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Universal Navbar */}
      <Navbar />

      {/* Page Content area */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[80vh] p-6">
          <Outlet />
        </div>
      </main>

      <footer className="py-6 text-center text-gray-400 text-xs">
        © 2026 PeopleDesk Asset Management System
      </footer>
    </div>
  );
};

export default MainLayout;
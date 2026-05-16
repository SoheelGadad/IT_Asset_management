import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, AlertCircle, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          {/* 404 Illustration Area */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[12rem] font-black text-blue-600/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle size={80} className="text-blue-600 animate-pulse" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-gray-900 mb-4">Lost in the Cloud?</h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a different department.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 w-full sm:w-auto"
            >
              <Home size={20} /> Back to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-white border-2 border-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition w-full sm:w-auto"
            >
              <ArrowLeft size={20} /> Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
import { Outlet, Link } from "react-router-dom";
import { Globe } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 🧭 Public Navbar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Globe className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              People<span className="text-blue-600">Desk</span>
            </span>
          </Link>
        <nav className="flex items-center gap-4">
          <Link to="/login" className="font-bold text-gray-500 hover:text-blue-600 uppercase text-xs tracking-widest">
            Sign In
          </Link>
          <Link to="/sign-up" className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition">
            Join Now
          </Link>
        </nav>
      </header>

      {/* This renders Hero (on Home), Login, or Signup */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 🔻 Public Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 px-6 text-center">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            PeopleDesk Global Asset Node © 2026
        </p>
      </footer>
    </div>
  );
};


export default AuthLayout;
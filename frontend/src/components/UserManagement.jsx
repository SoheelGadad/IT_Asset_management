import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";
import { ArrowUpDown, Trash2, Edit, CheckCircle, XCircle, UserPlus, Users, Shield, Search, ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ✨ AXIOS CREDENTIALS
axios.defaults.withCredentials = true;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("username");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to sync user directory");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/users/${userId}`, { status: newStatus });
      setUsers(users.map(u => u.userId === userId ? { ...u, status: newStatus } : u));
      toast.success(`User ${newStatus} successfully`);
    } catch (error) {
      toast.error("Status synchronization failed");
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${deleteId}`);
      setUsers((prev) => prev.filter((u) => u.userId !== deleteId));
      setDeleteId(null);
      toast.info("User identity purged");
    } catch (error) {
      toast.error("Purge operation failed");
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter(u => 
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.status || 'pending').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortKey) {
      result.sort((a, b) => {
        const A = String(a[sortKey] ?? "");
        const B = String(b[sortKey] ?? "");
        return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
      });
    }
    return result;
  }, [users, searchQuery, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / pageSize));
  const paginatedUsers = filteredAndSortedUsers.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    setSortDir(sortKey === key && sortDir === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
               <Users className="text-blue-600" size={32} /> User Directory
            </h2>
            <p className="text-gray-500 mt-1 font-medium italic">Identity & Access Management Node</p>
          </div>
          
          <Link to="/create-user" className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            <UserPlus size={16} /> Initialize User
          </Link>
        </header>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-medium"
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ListFilter size={14}/> Show:
              </label>
              <select 
                value={pageSize} 
                onChange={(e) => {setPageSize(Number(e.target.value)); setPage(1);}}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-blue-500"
              >
                <option value={5}>5 Rows</option>
                <option value={10}>10 Rows</option>
                <option value={20}>20 Rows</option>
                <option value={50}>50 Rows</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  {["userId", "username", "email", "role", "status"].map((col) => (
                    <th key={col} onClick={() => handleSort(col)} className="px-8 py-5 cursor-pointer hover:text-blue-600 transition group">
                      <div className="flex items-center justify-between">
                        {col === "userId" ? "System ID" : col} 
                        <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </th>
                  ))}
                  <th className="px-8 py-5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {paginatedUsers.map((u) => {
                  const status = u.status || 'pending';
                  const isAdmin = u.role?.toLowerCase() === 'admin';
                  return (
                    <tr key={u.userId} className="hover:bg-blue-50/10 transition-colors">
                      <td className="px-8 py-5 font-mono font-bold text-gray-400">{u.userId}</td>
                      <td className="px-8 py-5 font-black text-gray-900">{u.username}</td>
                      <td className="px-8 py-5 text-gray-500 font-medium">{u.email}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isAdmin ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                          {isAdmin && <Shield size={10} />} {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                          status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {/* ✨ Operations now always visible */}
                        <div className="flex justify-end gap-1 transition-opacity">
                          {status === 'pending' && (
                            <>
                              <button onClick={() => handleStatusChange(u.userId, 'approved')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition" title="Approve User"><CheckCircle size={18}/></button>
                              <button onClick={() => handleStatusChange(u.userId, 'rejected')} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition" title="Reject User"><XCircle size={18}/></button>
                            </>
                          )}
                          <button onClick={() => navigate(`/edit-user/${u.userId}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Edit User"><Edit size={18}/></button>
                          <button onClick={() => setDeleteId(u.userId)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Delete User"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing {paginatedUsers.length} of {filteredAndSortedUsers.length} identities
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition ${
                      page === i + 1 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                      : 'bg-white border border-gray-200 text-gray-400 hover:border-blue-500'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={deleteUser} 
        title="Revoke System Access"
        message={`Are you sure you want to purge user ${deleteId}?`}
        variant="danger"
      />
    </div>
  );
};

export default UserManagement;
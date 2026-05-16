import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  User, 
  Calendar, 
  ArrowRight,
  Inbox,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import Logout from "../components/Logout";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalType, setModalType] = useState(null); // 'approve' or 'reject'

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/requests`, { withCredentials: true });
      setRequests(res.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load request queue");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    const newStatus = modalType === 'approve' ? 'Approved' : 'Rejected';
    try {
      await axios.put(`${API_BASE_URL}/api/requests/${selectedRequest._id}`, {
        status: newStatus
      }, { withCredentials: true });

      toast.success(`Request ${newStatus} successfully`);
      setRequests(requests.map(r => r._id === selectedRequest._id ? { ...r, status: newStatus } : r));
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">

      <main className="p-6 md:p-10 max-w-6xl mx-auto w-full">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Inbox className="text-blue-600" size={32} /> Request Queue
          </h2>
          <p className="text-gray-500 mt-1 font-medium italic">Approve or reject hardware deployment requests</p>
        </header>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-gray-400 font-black uppercase text-xs tracking-widest">
            Syncing Requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200">
            <Clock className="mx-auto text-gray-200 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-400">Queue Clear</h3>
            <p className="text-gray-400 text-sm mt-2">No pending hardware requests found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-200 transition-all group">
                
                {/* User & Asset Info */}
                <div className="flex items-center gap-6 flex-grow">
                  <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900">{req.userName}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        <Package size={14} /> {req.assetName}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        <Calendar size={14} /> {new Date(req.requestDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    req.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                  }`}>
                    {req.status}
                  </span>

                  {req.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setSelectedRequest(req); setModalType('approve'); }}
                        className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition active:scale-95"
                        title="Approve Request"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button 
                        onClick={() => { setSelectedRequest(req); setModalType('reject'); }}
                        className="p-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-100 transition active:scale-95"
                        title="Reject Request"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  )}
                  
                  {req.status === 'Approved' && (
                    <Link 
                      to="/assigned-assets" 
                      className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      View Assignment <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal 
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onConfirm={handleAction}
        title={modalType === 'approve' ? "Confirm Asset Deployment" : "Reject Asset Request"}
        message={modalType === 'approve' 
          ? `Deploy ${selectedRequest?.assetName} to ${selectedRequest?.userName}? This will update the inventory status to 'Assigned'.`
          : `Are you sure you want to reject this request for ${selectedRequest?.userName}?`
        }
        variant={modalType === 'approve' ? "primary" : "danger"}
      />
    </div>
  );
};

export default ManageRequests;
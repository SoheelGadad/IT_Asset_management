import PropTypes from 'prop-types';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

const ConfirmModal = ({ open, title, message, onClose, onConfirm, variant = 'danger' }) => {
  if (!open) return null;

  // ✨ Logic to switch styles based on variant
  const isDanger = variant === 'danger';
  
  const themes = {
    danger: {
      icon: <AlertTriangle className="text-red-600" size={32} />,
      iconBg: 'bg-red-50',
      button: 'bg-red-600 hover:bg-red-700 shadow-red-200',
      confirmText: 'Confirm Delete'
    },
    success: {
      icon: <CheckCircle2 className="text-emerald-600" size={32} />,
      iconBg: 'bg-emerald-50',
      button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
      confirmText: 'Approve Claim'
    }
  };

  const currentTheme = themes[variant] || themes.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 🌑 Overlay with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* 📦 Modal Card */}
      <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-gray-100 transform transition-all animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Dynamic Icon Based on Variant */}
          <div className={`mb-6 p-4 rounded-2xl ${currentTheme.iconBg}`}>
            {currentTheme.icon}
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={onConfirm}
            className={`flex-grow px-6 py-4 text-white font-black rounded-2xl shadow-lg transition-all active:scale-[0.98] ${currentTheme.button}`}
          >
            {currentTheme.confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-grow px-6 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['danger', 'success']), // ✨ Added
};

export default ConfirmModal;
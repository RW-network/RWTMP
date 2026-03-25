import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning';

export interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />
  };

  const borders = {
    success: 'border-l-4 border-l-green-400',
    error: 'border-l-4 border-l-red-400',
    warning: 'border-l-4 border-l-yellow-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed top-4 right-4 z-50 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 text-sm font-medium text-white ${borders[type]}`}
    >
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

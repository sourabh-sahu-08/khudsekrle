import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass w-full max-w-md rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                >
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                <AlertTriangle size={24} />
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-10">{message}</p>

                        <div className="flex gap-3">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5"
                            >
                                {cancelText}
                            </button>
                            <button 
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-xl ${
                                    type === 'danger' 
                                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' 
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                                }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

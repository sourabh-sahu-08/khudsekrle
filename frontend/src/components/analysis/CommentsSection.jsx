import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Edit2, MessageSquare, Check, X } from 'lucide-react';
import { analysisService } from '@/utils/api';
import { toast } from 'sonner';
import ConfirmModal from "@/components/ConfirmModal";

export default function CommentsSection({ analysisId, initialComments = [] }) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await analysisService.addComment(analysisId, newComment.trim());
            setComments(response.data.data);
            setNewComment("");
            toast.success("Note persisted!");
        } catch (err) {
            toast.error("Failed to add note");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (commentId) => {
        setCommentToDelete(commentId);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!commentToDelete) return;
        try {
            const response = await analysisService.deleteComment(analysisId, commentToDelete);
            setComments(response.data.data);
            toast.success("Note removed");
        } catch (err) {
            toast.error("Failed to delete note");
        } finally {
            setCommentToDelete(null);
            setIsModalOpen(false);
        }
    };

    const handleEditStart = (comment) => {
        setEditingId(comment._id);
        setEditText(comment.text);
    };

    const handleEditSave = async (commentId) => {
        if (!editText.trim()) return;
        try {
            const response = await analysisService.editComment(analysisId, commentId, editText.trim());
            setComments(response.data.data);
            setEditingId(null);
            toast.success("Note updated");
        } catch (err) {
            toast.error("Failed to update note");
        }
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="flex gap-4 relative group">
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a developer note..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-600"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 hover:scale-105"
                >
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
                </button>
            </form>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {comments.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/[0.01] border border-dashed border-white/5 rounded-[2rem] p-12 text-center"
                        >
                            <MessageSquare size={32} className="mx-auto mb-4 text-slate-700 opacity-50" />
                            <p className="text-slate-500 text-sm font-medium italic">Your thoughts are encrypted and stored here. Add one above.</p>
                        </motion.div>
                    ) : (
                        comments.map((comment, i) => (
                            <motion.div 
                                key={comment._id || i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/[0.08] transition-all group/comment shadow-lg"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 text-[10px] font-black">
                                            {comment.userName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-white uppercase tracking-widest">{comment.userName}</span>
                                            <span className="text-[9px] font-bold text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEditStart(comment)}
                                            className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(comment._id)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                
                                {editingId === comment._id ? (
                                    <div className="space-y-4">
                                        <textarea 
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all min-h-[100px]"
                                        />
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleEditSave(comment._id)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                            >
                                                <Check size={12} /> Save
                                            </button>
                                            <button 
                                                onClick={() => setEditingId(null)}
                                                className="text-slate-400 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                                            >
                                                <X size={12} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-slate-300 text-[13px] leading-relaxed font-medium">{comment.text}</p>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <ConfirmModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Note?"
                message="Are you sure you want to delete this note? This action cannot be undone."
                confirmText="Delete Now"
            />
        </div>
    );
}

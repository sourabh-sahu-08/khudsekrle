import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { analysisService } from '@/utils/api';
import { toast } from 'sonner';

export default function ChatInterface({ analysisId, initialMessages = [] }) {
    const [messages, setMessages] = useState(initialMessages.map(m => ({ role: m.role, content: m.content })));
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsSending(true);

        try {
            const response = await analysisService.chat(analysisId, userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: response.data.data }]);
        } catch (err) {
            toast.error("Failed to get AI response");
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-black/40 rounded-[2rem] p-6 min-h-[300px] max-h-[500px] overflow-y-auto border border-white/5 space-y-6 custom-scrollbar shadow-inner">
                <AnimatePresence mode="popLayout">
                    {messages.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-slate-600 py-16"
                        >
                            <div className="w-16 h-16 bg-white/[0.02] rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                                <Sparkles size={24} className="opacity-20" />
                            </div>
                            <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Neural Console Idle</p>
                            <p className="text-xs mt-2 font-medium">Ask a question to begin session</p>
                        </motion.div>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                }`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className={`max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed shadow-xl relative ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-600/10 text-blue-50 border border-blue-500/10 rounded-tr-none' 
                                    : 'bg-indigo-600/10 text-indigo-50 border border-indigo-500/10 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <form onSubmit={handleSend} className="relative group">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI about this analysis..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-5 px-6 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-600 font-medium"
                />
                <button 
                    type="submit"
                    disabled={!input.trim() || isSending}
                    className="absolute right-3 top-3 bottom-3 bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:scale-105 active:scale-95"
                >
                    {isSending ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                </button>
            </form>
        </div>
    );
}

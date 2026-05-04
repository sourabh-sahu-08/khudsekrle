import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Copy, Check, Terminal } from 'lucide-react';
import { toast } from 'sonner';

export default function CodePreview({ code, language, title, height = "300px", readOnly = true }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const cleanCode = code?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '') || "";
        navigator.clipboard.writeText(cleanCode);
        setCopied(true);
        toast.success(`${title || 'Code'} copied to clipboard`);
        setTimeout(() => setCopied(false), 2000);
    };

    const displayCode = code?.replace(/^```[\w]*\n/, '').replace(/\n```$/, '') || "";

    return (
        <div className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl group transition-all duration-300 hover:border-white/10">
            <div className="bg-slate-900/50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Terminal size={16} className="text-blue-400" />
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {title || 'Source Code'}
                    </h3>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all active:scale-90"
                    title="Copy to clipboard"
                >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
            </div>
            <div className="p-1 bg-slate-950/20">
                <div style={{ height }} className="rounded-xl overflow-hidden relative">
                    <Editor
                        height="100%"
                        language={language || "javascript"}
                        value={displayCode}
                        theme="vs-dark"
                        options={{
                            readOnly,
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 20, bottom: 20 },
                            fontFamily: 'Fira Code, monospace',
                            renderLineHighlight: 'none',
                        }}
                    />
                    <div className="absolute inset-0 pointer-events-none border border-blue-500/0 group-hover:border-blue-500/5 transition-colors rounded-xl" />
                </div>
            </div>
        </div>
    );
}

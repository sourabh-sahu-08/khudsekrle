"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, onChange, language }) {
    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800">
            <Editor
                height="500px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 20 },
                    fontFamily: 'Fira Code, monospace',
                }}
            />
        </div>
    );
}

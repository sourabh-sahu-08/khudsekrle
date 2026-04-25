"use client";

import Editor, { loader } from "@monaco-editor/react";
import { useEffect } from "react";

export default function CodeEditor({ value, onChange, language }) {
    
    // Custom theme to match our premium dark theme
    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('premium-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
                { token: 'keyword', foreground: '3b82f6', fontStyle: 'bold' },
                { token: 'string', foreground: '10b981' },
                { token: 'number', foreground: 'f59e0b' },
            ],
            colors: {
                'editor.background': '#11182700', // Transparent to inherit from container
                'editor.lineHighlightBackground': '#ffffff05',
                'editorCursor.foreground': '#3b82f6',
                'editor.selectionBackground': '#3b82f620',
                'editorLineNumber.foreground': '#475569',
                'editorLineNumber.activeForeground': '#94a3b8',
                'editor.inactiveSelectionBackground': '#3b82f610',
            }
        });
    };

    return (
        <div className="h-full w-full relative">
            <Editor
                height="100%"
                language={language}
                theme="premium-dark"
                value={value}
                onChange={onChange}
                beforeMount={handleEditorWillMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 20 },
                    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                    fontLigatures: true,
                    cursorSmoothCaretAnimation: "on",
                    cursorBlinking: "smooth",
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8,
                    }
                }}
            />
        </div>
    );
}

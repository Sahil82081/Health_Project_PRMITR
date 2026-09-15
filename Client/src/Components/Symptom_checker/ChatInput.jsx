import React from 'react'
import { Mic, MicOff, Send } from 'lucide-react';

function ChatInput({
    inputQuery,
    setInputQuery,
    isListening,
    isBotThinking,
    handleSendMessage,
    handleVoiceToggle
}) {
    return (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                }}
                className="flex items-center gap-2.5"
            >
                {/* Voice Input Button */}
                <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`p-3 rounded-xl border transition-all ${isListening
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    title={isListening ? "Listening... Click to stop" : "Voice Input (Dictation)"}
                >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text Field */}
                <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={isListening ? "Listening to your voice..." : "Describe symptoms (e.g., 'Sharp chest pain when breathing deeply')..."}
                    className="flex-1 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!inputQuery.trim() || isBotThinking}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white p-3 rounded-xl font-medium transition-all shadow-md shadow-emerald-600/20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    )
}

export default ChatInput
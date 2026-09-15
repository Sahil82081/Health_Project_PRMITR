import React from 'react'
import { Stethoscope, Trash2 } from 'lucide-react';
import ChatInput from './ChatInput';
import MessageThread from './MessageThread';
function SymptomChecker({ symptomState }) {
    const {
        messages,
        inputQuery,
        setInputQuery,
        isBotThinking,
        isListening,
        chatBottomRef,
        handleSendMessage,
        handleVoiceToggle,
        handleClearChat
    } = symptomState;
    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[580px]">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Conversational Diagnostic Assistant</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Describe your physical discomfort or choose quick symptom chips</p>
                    </div>
                </div>

                <button
                    onClick={() => { handleClearChat() }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Clear Chat History"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear Chat</span>
                </button>
            </div>
            <MessageThread messages={messages} 
            chatBottomRef={chatBottomRef} 
            isBotThinking={isBotThinking} />
            <ChatInput
                inputQuery={inputQuery}
                setInputQuery={setInputQuery}
                isListening={isListening}
                isBotThinking={isBotThinking}
                handleSendMessage={handleSendMessage}
                handleVoiceToggle={handleVoiceToggle}
            />
        </div>
    )
}

export default SymptomChecker
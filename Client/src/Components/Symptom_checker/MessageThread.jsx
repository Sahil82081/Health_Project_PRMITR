import React from 'react'
import { Bot, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';

function MessageThread({ isBotThinking,chatBottomRef ,messages}) {

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar max-h-[500px]">
            {messages.map((msg,key) => (
                <MessageBubble  msg={msg} key={key} />
            ))}

            {/* Bot Thinking Animated Indicator */}
            {isBotThinking && (
                <div className="flex gap-3.5 items-center">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                        <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2.5 text-xs font-medium">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        <span>Analyzing symptom parameters...</span>
                    </div>
                </div>)}

            {/* Invisible anchor for auto-scroll */}
            <div ref={chatBottomRef} />
        </div>
    )
}

export default MessageThread
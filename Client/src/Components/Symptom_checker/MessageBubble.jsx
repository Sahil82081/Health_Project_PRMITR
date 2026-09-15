import React from 'react'
import { Bot, User } from 'lucide-react';
import { StructuredResponseCard } from './StructuredResponseCard';
function MessageBubble({ msg }) {
    const isUser = msg.sender === 'user';

    return (
        <div className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>

            {/* Bot Avatar */}
            {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 mt-1">
                    <Bot className="w-4 h-4" />
                </div>
            )}

            {/* Message Content */}
            <div className={`max-w-[90%] sm:max-w-[80%] md:max-w-[70%] ${isUser ? 'order-1' : 'order-2'}`}>
                {isUser ? (
                    <div className="bg-emerald-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm leading-relaxed">
                        {msg.text}
                        <div className="text-[10px] text-emerald-100/70 text-right mt-1.5 font-mono">
                            {msg.timestamp}
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 p-5 rounded-2xl rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 shadow-sm text-sm space-y-4">
                        <p className="leading-relaxed">{msg.text}</p>
                        {msg.structuredData && <StructuredResponseCard data={msg.structuredData} />}
                        <div className="text-[10px] text-slate-400 text-right font-mono">
                            {msg.timestamp}
                        </div>
                    </div>
                )}
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 shadow-md mt-1 order-2">
                    <User className="w-4 h-4" />
                </div>
            )}

        </div>
    )
}

export default MessageBubble
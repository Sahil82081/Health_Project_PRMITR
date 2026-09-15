import React from 'react'
import { Bot, Activity } from 'lucide-react';
function TabSwitcher({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center">
      <div className="bg-slate-200/80 dark:bg-navy-900/90 p-1.5 rounded-2xl border border-slate-300/60 dark:border-slate-800 flex items-center gap-1.5 w-full max-w-md shadow-inner">
        <button
          onClick={() => setActiveTab('chatbot')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === 'chatbot'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Symptom Checker</span>
        </button>

        <button
          onClick={() => setActiveTab('dermscan')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === 'dermscan'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md border border-slate-200/50 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>DermScan AI</span>
        </button>
      </div>
    </div>
  )
}

export default TabSwitcher
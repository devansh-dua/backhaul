import React, { useState } from 'react';
import { CopilotChat } from './CopilotChat';
import { Sparkles, Mic, X, Bot } from 'lucide-react';

export const CopilotFloatingWidget = ({ clientContext = {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Drawer / Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center sm:justify-end p-2 sm:p-6">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200 animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-all"
              title="Close Copilot"
            >
              <X size={16} />
            </button>

            <CopilotChat clientContext={clientContext} />
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all font-outfit border-2 border-white/40 cursor-pointer group"
          title="Open BACKHAULX AI Copilot"
        >
          <div className="relative">
            <Mic size={22} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase hidden sm:inline pr-1">
            AI COPILOT
          </span>
          <Sparkles size={16} className="text-yellow-300 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

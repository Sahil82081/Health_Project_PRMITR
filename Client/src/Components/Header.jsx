import React from "react";
import { HeartPulse, Sun, Moon } from "lucide-react";

function Header({ darktheme, toggleTheme }) {
  return (
    <header
      className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 lg:px-8 py-3.5 ${
        darktheme
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
            <HeartPulse className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-xl font-extrabold tracking-tight ${
                  darktheme ? "text-white" : "text-slate-900"
                }`}
              >
                HealthPulse
              </h1>

              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide">
                AI v2.4
              </span>
            </div>

            <p
              className={`text-xs hidden sm:block ${
                darktheme ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Clinical Intelligence & Dermatological Scan Suite
            </p>
          </div>
        </div>

        {/* Engine Status & Theme Button */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
              darktheme
                ? "bg-slate-800 border-slate-700 text-slate-300"
                : "bg-slate-100 border-slate-200 text-slate-600"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>

            <span>
              AI Engine:{" "}
              <span className="text-emerald-500 font-semibold">Active</span>
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all border ${
              darktheme
                ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
            title={darktheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darktheme ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
import React from 'react'

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-navy-900/50 py-4 px-6 text-center text-xs text-slate-400">
      <p>© {new Date().getFullYear()} HealthPulse Medical AI Platform • HIPAA-compliant encrypted data pipeline mockup</p>
      <p> Developed By Sahil Kumbharkar </p>
    </footer>
  )
}

export default Footer
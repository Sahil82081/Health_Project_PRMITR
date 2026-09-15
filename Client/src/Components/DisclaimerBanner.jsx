import React from 'react'

function DisclaimerBanner() {
    return (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-300 px-4 py-2 text-xs md:text-sm text-center font-medium flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
                <strong>Medical Disclaimer:</strong> For informational & preliminary guidance only. Not a substitute for professional medical diagnosis or emergency care.
            </span>
        </div>
    )
}

export default DisclaimerBanner
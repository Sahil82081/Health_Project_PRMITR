import React from 'react'
import { Activity, Sparkles, RefreshCw } from 'lucide-react';
import ImageDropZone from './ImageDropZone';
import { AnalysisResultsReport } from './AnalysisResultsReport';

function Scanner_Tab({ dermScanState, onOpenDoctorModal }) {
    const {
        selectedImage,
        isAnalyzingImage,
        scanResult,
        handleImageUpload,
        handleDragOver,
        handleDrop,
        handleRunDermScan,
    } = dermScanState;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Upload & Controls (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">

                <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">DermScan AI Visual Analyzer</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">High-resolution skin lesion feature extraction & risk evaluation</p>
                            </div>
                        </div>
                    </div>

                    {/* Drag and Drop Zone */}
                    <ImageDropZone
                        selectedImage={selectedImage}
                        isAnalyzingImage={isAnalyzingImage}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        handleImageUpload={handleImageUpload}
                    />

                    {/* Simulated Trigger Button */}
                    <button
                        onClick={handleRunDermScan}
                        disabled={!selectedImage || isAnalyzingImage}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {isAnalyzingImage ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Scanning Image with DermScan Neural Network...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Analyze Image Now</span>
                            </>
                        )}
                    </button>

                </div>
            </div>

            {/* Right Column: Diagnostic Results Panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
                <AnalysisResultsReport
                    scanResult={scanResult}
                    isAnalyzingImage={isAnalyzingImage}
                    onOpenDoctorModal={onOpenDoctorModal}
                />
            </div>

        </div>
    )
}

export default Scanner_Tab
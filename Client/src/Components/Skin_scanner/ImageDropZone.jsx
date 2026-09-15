import React from 'react'
import { Upload, RefreshCw } from 'lucide-react';

function ImageDropZone({
    selectedImage,
    isAnalyzingImage,
    handleDragOver,
    handleDrop,
    handleImageUpload
}) {
    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[260px] overflow-hidden ${selectedImage
                    ? 'border-emerald-500/50 bg-slate-900/5 dark:bg-slate-900/50'
                    : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 bg-slate-50/50 dark:bg-slate-900/30'
                }`}
        >
            {selectedImage ? (
                <div className="relative w-full h-64 flex items-center justify-center">
                    <img
                        src={selectedImage}
                        alt="Uploaded skin lesion preview"
                        className="max-h-full max-w-full object-contain rounded-xl shadow-md"
                    />

                    {/* Laser Scanning Animation Overlay when analyzing */}
                    {isAnalyzingImage && (
                        <div className="absolute inset-0 bg-emerald-500/10 rounded-xl overflow-hidden pointer-events-none">
                            <div className="w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_#10b981] animate-laser relative" />
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 text-emerald-400 font-mono text-xs font-semibold tracking-widest uppercase">
                                [ Extracting Morphological Features... ]
                            </div>
                        </div>
                    )}

                    {/* Change Image Overlay Button */}
                    {!isAnalyzingImage && (
                        <label className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer backdrop-blur-md flex items-center gap-1.5 transition-all">
                            <RefreshCw className="w-3.5 h-3.5" /> Change Image
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>
            ) : (
                <div className="space-y-3 py-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                        <Upload className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Drag and drop lesion image here, or{' '}
                            <label className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                                browse file
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (Max size 10MB)</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageDropZone
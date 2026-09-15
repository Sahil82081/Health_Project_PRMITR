import React from 'react';
import { Activity, FileCheck, MapPin, ChevronRight } from 'lucide-react';

export function AnalysisResultsReport({
  scanResult,
  isAnalyzingImage,
  onOpenDoctorModal
}) {
  return (
    <div className="bg-white dark:bg-navy-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex-1 flex flex-col space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-500" />
          Analysis Report Summary
        </h3>
      </div>

      {/* No Result */}
      {!scanResult && !isAnalyzingImage && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 space-y-3">

          <Activity className="w-12 h-12 stroke-[1.5] text-slate-300 dark:text-slate-700" />

          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Awaiting Image Scan
            </h4>

            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Upload a photo or choose a sample image and click "Analyze Image" to view prediction results.
            </p>
          </div>

        </div>
      )}

      {/* Loading */}
      {isAnalyzingImage && (
        <div className="flex-1 space-y-5 animate-pulse">

          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />

          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />

          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />

        </div>
      )}

      {/* Result */}
      {scanResult && !isAnalyzingImage && (
        <div className="space-y-6 flex-1 flex flex-col justify-between">

          <div className="space-y-5">

            {/* Prediction */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                  Top Match Prediction
                </span>

                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
                  {scanResult.confidence}% Confidence
                </span>

              </div>

              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {scanResult.condition}
              </h4>

            </div>

            {/* Confidence */}
            <div className="space-y-2">

              <div className="flex items-center justify-between text-xs">

                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  Model Confidence
                </span>

                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {scanResult.confidence}%
                </span>

              </div>

              {/* Confidence Bar */}
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${scanResult.confidence}%`
                  }}
                />

              </div>

            </div>

            {/* Result Information */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">

              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Detected Condition
              </span>

              <p>
                The model identified:
              </p>

              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {scanResult.condition}
              </p>

            </div>

            {/* Disclaimer */}
            <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
              This result is an AI-based visual prediction and should not be
              considered a medical diagnosis. Consult a qualified dermatologist
              for professional evaluation.
            </div>

          </div>

          {/* Find Dermatologist */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">

            <button
              onClick={() => {
                if (!navigator.geolocation) {
                  alert("Geolocation is not supported by your browser.");
                  return;
                }

                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;

                    const googleMapsUrl =
                      `https://www.google.com/maps/search/dermatologist/@${latitude},${longitude},14z`;

                    window.open(googleMapsUrl, "_blank");
                  },
                  () => {
                    alert("Please allow location access to find nearby dermatologists.");
                  }
                );
              }}
              className="w-full bg-navy-900 hover:bg-navy-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-navy-950 font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <MapPin className="w-4 h-4" />

              <span>Find Nearby Dermatologist</span>

              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

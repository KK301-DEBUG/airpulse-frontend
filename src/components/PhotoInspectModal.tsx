import React from 'react';
import { CitizenReportItem } from '../types';

interface PhotoInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: CitizenReportItem | null;
}

export const PhotoInspectModal: React.FC<PhotoInspectModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#181c24] border border-[#31353e] rounded-xl shadow-2xl p-6 text-[#dfe2ee]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#31353e] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#4edea3]/15 text-[#4edea3]">
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1bbd85]/20 text-[#4edea3] font-bold">
                  CITIZEN GEOTAGGED OPTICAL TELEMETRY
                </span>
                <span className="text-xs font-mono text-[#869397]">{report.id}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Optical Smoke Density Inspection
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#bcc9cd] hover:text-white hover:bg-[#262a33]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          {/* Photo Display with AI bounding box & crosshair overlay */}
          <div className="relative rounded-lg overflow-hidden border border-[#262a33] max-h-[300px] bg-black">
            <img
              src={report.imageUrl}
              alt="Citizen Evidence"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* AI Computer Vision Overlay */}
            <div className="absolute top-4 left-4 p-2 rounded bg-black/70 backdrop-blur-md border border-[#4cd7f6] text-[10px] font-mono text-[#4cd7f6] space-y-0.5">
              <div className="font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-ping"></span>
                AI OPTICAL PLUME BOUNDING BOX
              </div>
              <div className="text-white">DENSITY: {report.opticalDensity}</div>
              <div className="text-[#bcc9cd]">ESTIMATED PM ELEVATION: {report.pmElevation}</div>
            </div>

            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-[#0a0e16]/80 text-[10px] font-mono text-[#4edea3] border border-[#1bbd85]">
              GEO-VERIFIED • {report.location}
            </div>
          </div>

          {/* Metadata Breakdown */}
          <div className="p-3 rounded-lg bg-[#0f131c] border border-[#262a33] text-xs font-mono space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[#869397] block text-[10px]">SUBMITTED BY</span>
                <span className="text-white font-bold">{report.author}</span>
                <span className="text-[#4cd7f6] block text-[10px]">{report.role}</span>
              </div>
              <div className="text-right">
                <span className="text-[#869397] block text-[10px]">TIMESTAMP</span>
                <span className="text-[#dfe2ee]">{report.timeAgo}</span>
              </div>
            </div>

            <p className="text-[#bcc9cd] italic border-t border-[#262a33] pt-2">
              "{report.caption}"
            </p>

            <div className="p-2 rounded bg-[#181c24] border border-[#31353e] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-[#4edea3]">
                <span className="material-symbols-outlined text-base">sensors</span>
                <span>{report.sensorCorrelation}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#1bbd85]/20 text-[#4edea3] font-bold">
                HIGH CONFIDENCE
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#31353e]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#bcc9cd]">
              <span className="material-symbols-outlined text-sm text-[#4cd7f6]">thumb_up</span>
              <span>{report.upvotes} community confirmations</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] font-mono text-xs transition-colors"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-[#06b6d4] hover:brightness-110 text-[#00424f] font-mono font-bold text-xs shadow-sm transition-all"
              >
                Add to Evidence Dossier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

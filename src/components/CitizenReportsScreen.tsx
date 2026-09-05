import React, { useState } from 'react';
import { CitizenReportItem } from '../types';

interface CitizenReportsScreenProps {
  reports: CitizenReportItem[];
  onInspectPhoto: (report: CitizenReportItem) => void;
  onUpvoteReport: (id: string) => void;
  onSubmitNewReport: (report: Partial<CitizenReportItem>) => void;
}

export const CitizenReportsScreen: React.FC<CitizenReportsScreenProps> = ({
  reports,
  onInspectPhoto,
  onUpvoteReport,
  onSubmitNewReport,
}) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('Doranda Ward 18 (23.3241° N, 85.3190° E)');
  const [newCaption, setNewCaption] = useState('Black exhaust from diesel backup generator running behind shopping mall.');
  const [authorName, setAuthorName] = useState('Citizen Observer');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitNewReport({
      author: authorName,
      location: newLocation,
      caption: newCaption,
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      opticalDensity: 'Dense Particulate (Visual Smoke)',
      sensorCorrelation: 'Corroborating with nearest mesh micro-station',
      pmElevation: '+45 μg/m³',
    });
    setIsSubmitModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1bbd85]/20 text-[#4edea3] font-bold">
              CROWDSOURCED OPTICAL TELEMETRY
            </span>
            <span className="text-xs font-mono text-[#869397]">
              {reports.length} ACTIVE CITIZEN FLAGS
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">
            Citizen Telemetry &amp; Field Reports
          </h1>
          <p className="text-xs text-[#bcc9cd]">
            Real-time citizen observations validated against ground sensors and Copernicus Sentinel-5P satellite passes.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#1bbd85] text-[#00452e] font-mono font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
          <span>Submit Smoke Report</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-[#1c2028] border border-[#31353e] shadow-lg hover:border-[#4edea3]/40 transition-colors"
          >
            <div className="space-y-3">
              {/* Photo Banner with Click to Inspect */}
              <div
                onClick={() => onInspectPhoto(report)}
                className="relative h-44 rounded-lg overflow-hidden border border-[#262a33] cursor-pointer group"
              >
                <img
                  src={report.imageUrl}
                  alt={report.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#4edea3] text-[10px] font-mono border border-[#1bbd85] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>{report.verified ? 'AI + Sensor Verified' : 'Community Cross-checking'}</span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-white">
                  <span className="text-[10px] font-mono text-[#bcc9cd]">{report.location}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-[#4cd7f6]">
                    Inspect ↗
                  </span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex justify-between items-start text-xs font-mono">
                <div>
                  <span className="text-white font-bold block">{report.author}</span>
                  <span className="text-[10px] text-[#4cd7f6]">{report.role}</span>
                </div>
                <span className="text-[#869397] text-[10px]">{report.timeAgo}</span>
              </div>

              {/* Caption */}
              <p className="text-xs text-[#dfe2ee] leading-relaxed">
                "{report.caption}"
              </p>

              {/* Sensor Corroboration Badge */}
              <div className="p-2 rounded bg-[#0a0e16] border border-[#262a33] text-[11px] font-mono space-y-1">
                <div className="flex items-center justify-between text-[#4edea3]">
                  <span>Optical Density:</span>
                  <span className="text-white font-bold">{report.opticalDensity}</span>
                </div>
                <div className="flex items-center justify-between text-[#bcc9cd]">
                  <span>Ground Sensor Match:</span>
                  <span className="text-[#4cd7f6]">{report.pmElevation}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-3 pt-3 border-t border-[#262a33] flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => onUpvoteReport(report.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] transition-colors"
              >
                <span className="material-symbols-outlined text-xs text-[#4edea3]">thumb_up</span>
                <span>Confirm ({report.upvotes})</span>
              </button>

              <button
                onClick={() => onInspectPhoto(report)}
                className="text-[#4cd7f6] hover:underline font-bold text-[11px]"
              >
                View Full Optical Dossier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Report Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#181c24] border border-[#31353e] rounded-xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#31353e] pb-3">
              <h3 className="text-base font-bold font-sans">Submit Field Smoke Telemetry</h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-[#bcc9cd] hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#bcc9cd] mb-1">Your Name / Handle</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0a0e16] border border-[#31353e] text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[#bcc9cd] mb-1">Location Coordinates or Landmark</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0a0e16] border border-[#31353e] text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[#bcc9cd] mb-1">Visual Observation & Smoke Description</label>
                <textarea
                  rows={3}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#0a0e16] border border-[#31353e] text-white"
                  required
                />
              </div>

              <div className="p-3 rounded bg-[#0a0e16] border border-[#262a33] text-[11px] text-[#4edea3]">
                AI Optical Recognition will automatically calculate the Ringelmann black carbon index and match nearby sensors.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#262a33] text-[#bcc9cd] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#1bbd85] text-[#00452e] font-bold shadow-md hover:brightness-110"
                >
                  Publish Citizen Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

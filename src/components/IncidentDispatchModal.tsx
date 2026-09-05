import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface IncidentDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: string;
  incidentTitle?: string;
  hotspotLocation?: string;
  onConfirmDispatch: (details: { team: string; action: string; note: string }) => void;
}

export const IncidentDispatchModal: React.FC<IncidentDispatchModalProps> = ({
  isOpen,
  onClose,
  incidentId = 'INC-8821',
  incidentTitle = 'Pollution spike predicted in Industrial Corridor',
  hotspotLocation = 'Ranchi Industrial Corridor (Sub-grid 4B)',
  onConfirmDispatch,
}) => {
  const [assignedTeam, setAssignedTeam] = useState<string>('AirGuard Eco-Rapid Team Alpha');
  const [actionProtocol, setActionProtocol] = useState<string>('Enforce Emergency Kiln Shutdown & Spray Mist Cannons');
  const [officerNote, setOfficerNote] = useState<string>('Immediate containment required before 18:30 IST inversion peak.');
  const [isDispatching, setIsDispatching] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // canvas-confetti fallback
      }
      onConfirmDispatch({
        team: assignedTeam,
        action: actionProtocol,
        note: officerNote,
      });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#181c24] border border-[#31353e] rounded-xl shadow-2xl p-6 text-[#dfe2ee]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#31353e] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ffb4ab]/15 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-2xl">emergency</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-bold">
                  TACTICAL EMERGENCY DISPATCH
                </span>
                <span className="text-xs font-mono text-[#869397]">ID: {incidentId}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Dispatch Rapid Response Team
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

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#1bbd85]/20 text-[#4edea3] flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="text-base font-bold text-white">Rapid Unit Successfully Dispatched</h3>
            <p className="text-xs text-[#bcc9cd] font-mono max-w-sm">
              {assignedTeam} has been assigned to {hotspotLocation}. GPS telemetry uplink active.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-mono">
            {/* Target Info */}
            <div className="p-3 rounded-lg bg-[#0f131c] border border-[#262a33]">
              <div className="text-[10px] text-[#869397] uppercase">TARGET INCIDENT</div>
              <div className="text-white font-bold text-sm mt-0.5">{incidentTitle}</div>
              <div className="text-[#4cd7f6] mt-1">{hotspotLocation}</div>
            </div>

            {/* Team Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#bcc9cd] mb-1.5">
                Select Response Cohort
              </label>
              <select
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f131c] border border-[#31353e] text-[#dfe2ee] focus:border-[#4cd7f6] focus:outline-none"
              >
                <option value="AirGuard Eco-Rapid Team Alpha">
                  AirGuard Eco-Rapid Team Alpha (Station #04 Base)
                </option>
                <option value="Municipal Pollution Enforcement Squad Beta">
                  Municipal Pollution Enforcement Squad Beta (Doranda)
                </option>
                <option value="Mobile Mist Cannon Deployment Unit 02">
                  Mobile Mist Cannon Deployment Unit 02 (Outer Ring)
                </option>
                <option value="Industrial Compliance Flying Inspectorate">
                  Industrial Compliance Flying Inspectorate (Tupudana)
                </option>
              </select>
            </div>

            {/* Protocol */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#bcc9cd] mb-1.5">
                Action Protocol
              </label>
              <select
                value={actionProtocol}
                onChange={(e) => setActionProtocol(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f131c] border border-[#31353e] text-[#dfe2ee] focus:border-[#4cd7f6] focus:outline-none"
              >
                <option value="Enforce Emergency Kiln Shutdown & Spray Mist Cannons">
                  Enforce Emergency Kiln Shutdown &amp; Spray Mist Cannons
                </option>
                <option value="Broadcast Ward N95 Mask & Window Closure Advisory">
                  Broadcast Ward N95 Mask &amp; Window Closure Advisory
                </option>
                <option value="Divert Heavy Tri-Axle Traffic to Outer Perimeter">
                  Divert Heavy Tri-Axle Traffic to Outer Perimeter
                </option>
                <option value="Deploy Optical Drone for High-Altitude Infrared Speciation">
                  Deploy Optical Drone for High-Altitude Infrared Speciation
                </option>
              </select>
            </div>

            {/* Officer Note */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#bcc9cd] mb-1.5">
                Commander Directive Note
              </label>
              <textarea
                rows={2}
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f131c] border border-[#31353e] text-[#dfe2ee] focus:border-[#4cd7f6] focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#31353e]">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatch}
                disabled={isDispatching}
                className="px-4 py-2 rounded-lg bg-[#ffb4ab] hover:brightness-110 text-[#690005] font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isDispatching ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">
                      sync
                    </span>
                    <span>Broadcasting Alert...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">emergency</span>
                    <span>Deploy Rapid Response</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { IncidentAlert } from '../types';

interface AlertsScreenProps {
  alerts: IncidentAlert[];
  onDispatchAlert: (alert: IncidentAlert) => void;
  onDismissAlert: (id: string) => void;
  onDeployVan: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onDispatchAlert,
  onDismissAlert,
  onDeployVan,
}) => {
  return (
    <div className="flex flex-col w-full p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-bold">
              OPERATIONAL INCIDENT BOARD
            </span>
            <span className="text-xs font-mono text-[#869397]">
              {alerts.length} ACTIVE INCIDENTS
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">
            Environmental Alerts &amp; Rapid Incident Command
          </h1>
          <p className="text-xs text-[#bcc9cd]">
            Real-time critical pollution spikes, FIRMS satellite thermal anomalies, and emergency mitigation broadcasts.
          </p>
        </div>

        <button
          onClick={onDeployVan}
          className="px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-white font-mono text-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm text-[#4cd7f6]">airport_shuttle</span>
          <span>Deploy Telemetry Van</span>
        </button>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-5 rounded-xl bg-[#1c2028] border border-[#31353e] shadow-xl space-y-3 hover:border-[#ffb4ab]/50 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    alert.severityType === 'critical'
                      ? 'bg-[#ffb4ab] text-[#690005]'
                      : alert.severityType === 'high'
                      ? 'bg-[#0566d9] text-[#e6ecff]'
                      : 'bg-[#1bbd85] text-[#00452e]'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="font-mono text-xs text-[#bcc9cd]">{alert.id}</span>
                <span className="text-[#869397]">•</span>
                <span className="font-mono text-xs text-[#4cd7f6]">{alert.location}</span>
              </div>
              <span className="text-xs font-mono text-[#869397]">{alert.timeAgo}</span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug">{alert.title}</h3>
            <p className="text-xs text-[#bcc9cd] leading-relaxed max-w-4xl">
              {alert.description}
            </p>

            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#262a33] gap-3">
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-[#ffb4ab] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {alert.impactTime}
                </span>
                {alert.officersNotified && (
                  <span className="text-[#bcc9cd]">
                    {alert.officersNotified} Officers Paged on Radio
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => onDismissAlert(alert.id)}
                  className="px-3 py-1.5 rounded bg-[#262a33] hover:bg-[#31353e] text-[#bcc9cd] hover:text-white transition-colors"
                >
                  Dismiss / Archive
                </button>
                <button
                  onClick={() => onDispatchAlert(alert)}
                  className="px-4 py-1.5 rounded bg-[#ffb4ab] text-[#690005] font-bold hover:brightness-110 shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">emergency</span>
                  <span>Dispatch Response Unit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

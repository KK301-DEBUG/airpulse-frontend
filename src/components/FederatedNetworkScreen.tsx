import React, { useState } from 'react';
import { SENSOR_NODES_DATA } from '../data/mockData';
import { SensorNodeItem } from '../types';

export const FederatedNetworkScreen: React.FC = () => {
  const [sensors, setSensors] = useState<SensorNodeItem[]>(SENSOR_NODES_DATA);
  const [pinging, setPinging] = useState(false);

  const handlePingMesh = () => {
    setPinging(true);
    setTimeout(() => {
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          latency: Math.max(12, Math.round(s.latency + (Math.random() - 0.5) * 6)),
        }))
      );
      setPinging(false);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#262a33] text-[#4cd7f6] font-bold">
              PRIVATE AIRSIGHT MESH
            </span>
            <span className="text-xs font-mono text-[#869397]">
              ENCRYPTED TELEMETRY (AES-256-GCM)
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">
            Federated Sensor Network Architecture
          </h1>
          <p className="text-xs text-[#bcc9cd]">
            142 active micro-stations, solar-harvesting optical nodes, and Copernicus orbital virtual proxies.
          </p>
        </div>

        <button
          onClick={handlePingMesh}
          disabled={pinging}
          className="px-4 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] font-mono font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-110 transition-all disabled:opacity-60"
        >
          <span className={`material-symbols-outlined text-sm ${pinging ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>{pinging ? 'Broadcasting Ping...' : 'Ping Entire Mesh (142 Nodes)'}</span>
        </button>
      </div>

      {/* Network Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#1c2028] border border-[#31353e]">
        <div>
          <span className="text-[10px] font-mono text-[#869397] block">ACTIVE GROUND NODES</span>
          <span className="text-xl font-bold font-mono text-[#4edea3]">142 / 144</span>
          <span className="text-[10px] text-[#bcc9cd] block mt-0.5">98.6% Availability</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-[#869397] block">MEAN LATENCY</span>
          <span className="text-xl font-bold font-mono text-[#4cd7f6]">38.2 ms</span>
          <span className="text-[10px] text-[#bcc9cd] block mt-0.5">LoRaWAN + 5G NB-IoT</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-[#869397] block">SATELLITE DOWNLINK</span>
          <span className="text-xl font-bold font-mono text-[#adc6ff]">11:20 IST</span>
          <span className="text-[10px] text-[#bcc9cd] block mt-0.5">Sentinel-5P TROPOMI</span>
        </div>
        <div>
          <span className="text-[10px] font-mono text-[#869397] block">DATA INTEGRITY</span>
          <span className="text-xl font-bold font-mono text-white">100% Validated</span>
          <span className="text-[10px] text-[#bcc9cd] block mt-0.5">Merkle Proofed</span>
        </div>
      </div>

      {/* Sensor Nodes Table */}
      <div className="rounded-xl bg-[#1c2028] border border-[#31353e] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#31353e] flex justify-between items-center">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Primary Mesh Node Manifest
          </h3>
          <span className="text-xs font-mono text-[#869397]">
            Showing Core Sentinel &amp; Valley Stations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-[#bcc9cd]">
            <thead className="bg-[#0a0e16] text-[10px] uppercase text-[#869397] border-b border-[#262a33]">
              <tr>
                <th className="p-3">Node Code</th>
                <th className="p-3">Station Name &amp; Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Live AQI</th>
                <th className="p-3">PM2.5 / NO2</th>
                <th className="p-3">Power / Solar</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Firmware</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a33]">
              {sensors.map((node) => (
                <tr key={node.id} className="hover:bg-[#181c24] transition-colors">
                  <td className="p-3 font-bold text-white">{node.code}</td>
                  <td className="p-3">
                    <div className="text-white font-medium">{node.name}</div>
                    <div className="text-[10px] text-[#869397]">{node.type}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        node.status === 'online'
                          ? 'bg-[#1bbd85]/20 text-[#4edea3]'
                          : 'bg-[#93000a]/20 text-[#ffb4ab]'
                      }`}
                    >
                      {node.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#adc6ff]">{node.aqi}</td>
                  <td className="p-3 text-white">
                    {node.pm25} μg/m³ / {node.no2} ppb
                  </td>
                  <td className="p-3">
                    <div>{node.battery}%</div>
                    <div className="text-[10px] text-[#869397]">{node.solarStatus}</div>
                  </td>
                  <td className="p-3 text-[#4cd7f6]">{node.latency} ms</td>
                  <td className="p-3 text-[#869397] text-[10px]">{node.firmware}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

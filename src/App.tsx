import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewScreen } from './components/OverviewScreen';
import { LiveMapScreen } from './components/LiveMapScreen';
import { HotspotsScreen } from './components/HotspotsScreen';
import { PredictionsScreen } from './components/PredictionsScreen';
import { CitizenReportsScreen } from './components/CitizenReportsScreen';
import { AlertsScreen } from './components/AlertsScreen';
import { FederatedNetworkScreen } from './components/FederatedNetworkScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';

import { SitRepModal } from './components/SitRepModal';
import { DeployVanModal } from './components/DeployVanModal';
import { SimulatePlumeModal } from './components/SimulatePlumeModal';
import { IncidentDispatchModal } from './components/IncidentDispatchModal';
import { PhotoInspectModal } from './components/PhotoInspectModal';

import { CITIZEN_REPORTS_DATA, INCIDENT_ALERTS_DATA } from './data/mockData';
import { CitizenReportItem, GeoNodeKey, HotspotData, IncidentAlert, NavScreen } from './types';

export default function App() {
  // Navigation & Location
  const [activeScreen, setActiveScreen] = useState<NavScreen>('overview');
  const [selectedGeoNode, setSelectedGeoNode] = useState<GeoNodeKey>('Ranchi');

  // Modals state
  const [isSitRepOpen, setIsSitRepOpen] = useState(false);
  const [isDeployVanOpen, setIsDeployVanOpen] = useState(false);
  const [isSimulatePlumeOpen, setIsSimulatePlumeOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatchTarget, setDispatchTarget] = useState<{ id?: string; name?: string }>({
    id: 'INC-8821',
    name: 'Ranchi Industrial Corridor (Sub-grid 4B)',
  });
  const [isPhotoInspectOpen, setIsPhotoInspectOpen] = useState(false);
  const [inspectingPhotoReport, setInspectingPhotoReport] = useState<CitizenReportItem | null>(
    CITIZEN_REPORTS_DATA[0]
  );

  // Alerts state
  const [alerts, setAlerts] = useState<IncidentAlert[]>(INCIDENT_ALERTS_DATA);

  // Citizen Reports state
  const [citizenReports, setCitizenReports] = useState<CitizenReportItem[]>(CITIZEN_REPORTS_DATA);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast(`Advisory ${id} archived to operational log.`);
  };

  const handleDispatchAlert = (alert: IncidentAlert) => {
    setDispatchTarget({ id: alert.id, name: alert.location });
    setIsDispatchOpen(true);
  };

  const handleDispatchHotspot = (hotspot: HotspotData) => {
    setDispatchTarget({ id: `HOT-${hotspot.code}`, name: hotspot.name });
    setIsDispatchOpen(true);
  };

  const handleInspectPhoto = (report: CitizenReportItem) => {
    setInspectingPhotoReport(report);
    setIsPhotoInspectOpen(true);
  };

  const handleUpvoteReport = (id: string) => {
    setCitizenReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
    showToast('Citizen confirmation recorded and cryptographically signed.');
  };

  const handleSubmitNewReport = (newReport: Partial<CitizenReportItem>) => {
    const created: CitizenReportItem = {
      id: `CR-${Date.now().toString().slice(-4)}`,
      author: newReport.author || 'Citizen Sensor',
      role: 'Local Resident',
      location: newReport.location || 'Urban Outskirt',
      timeAgo: 'Just now',
      imageUrl: newReport.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      caption: newReport.caption || 'Uncontrolled smoke emission observed',
      verified: true,
      upvotes: 1,
      opticalDensity: newReport.opticalDensity || 'Moderate Smoke',
      sensorCorrelation: newReport.sensorCorrelation || 'Matches nearby micro-mesh node',
      pmElevation: newReport.pmElevation || '+30 μg/m³',
    };
    setCitizenReports((prev) => [created, ...prev]);
    showToast('Field smoke telemetry submitted and broadcast to municipal dashboard.');
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0e16] text-[#dfe2ee] font-sans antialiased overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Global Operational Header */}
        <Header
          selectedGeoNode={selectedGeoNode}
          onSelectGeoNode={setSelectedGeoNode}
          onDeployVan={() => setIsDeployVanOpen(true)}
          onSimulatePlume={() => setIsSimulatePlumeOpen(true)}
        />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0a0e16] custom-scrollbar">
          {activeScreen === 'overview' && (
            <OverviewScreen
              selectedGeoNode={selectedGeoNode}
              onSelectGeoNode={setSelectedGeoNode}
              onOpenSitRep={() => setIsSitRepOpen(true)}
              onOpenDeployVan={() => setIsDeployVanOpen(true)}
              onOpenSimulatePlume={() => setIsSimulatePlumeOpen(true)}
              onOpenDispatch={(id, name) => {
                setDispatchTarget({ id, name });
                setIsDispatchOpen(true);
              }}
              onInspectPhoto={handleInspectPhoto}
              onNavigateScreen={setActiveScreen}
              alerts={alerts}
              onDismissAlert={handleDismissAlert}
              onDispatchAlert={handleDispatchAlert}
              citizenReports={citizenReports}
            />
          )}

          {activeScreen === 'live-map' && (
            <LiveMapScreen
              selectedGeoNode={selectedGeoNode}
              onDeployVan={() => setIsDeployVanOpen(true)}
              onSimulatePlume={() => setIsSimulatePlumeOpen(true)}
            />
          )}

          {activeScreen === 'hotspots' && (
            <HotspotsScreen
              selectedGeoNode={selectedGeoNode}
              onDispatchHotspot={handleDispatchHotspot}
              onSimulatePlume={() => setIsSimulatePlumeOpen(true)}
            />
          )}

          {activeScreen === 'predictions' && (
            <PredictionsScreen
              selectedGeoNode={selectedGeoNode}
              onSimulatePlume={() => setIsSimulatePlumeOpen(true)}
            />
          )}

          {activeScreen === 'citizen-reports' && (
            <CitizenReportsScreen
              reports={citizenReports}
              onInspectPhoto={handleInspectPhoto}
              onUpvoteReport={handleUpvoteReport}
              onSubmitNewReport={handleSubmitNewReport}
            />
          )}

          {activeScreen === 'alerts-incidents' && (
            <AlertsScreen
              alerts={alerts}
              onDispatchAlert={handleDispatchAlert}
              onDismissAlert={handleDismissAlert}
              onDeployVan={() => setIsDeployVanOpen(true)}
            />
          )}

          {activeScreen === 'federated-network' && <FederatedNetworkScreen />}

          {activeScreen === 'analytics' && (
            <AnalyticsScreen selectedGeoNode={selectedGeoNode} />
          )}
        </main>
      </div>

      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1c2028] border border-[#4cd7f6] text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5 font-mono text-xs">
          <span className="material-symbols-outlined text-[#4cd7f6] text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Modals */}
      <SitRepModal
        isOpen={isSitRepOpen}
        onClose={() => setIsSitRepOpen(false)}
        selectedNode={selectedGeoNode}
      />

      <DeployVanModal
        isOpen={isDeployVanOpen}
        onClose={() => setIsDeployVanOpen(false)}
        onDeployed={(vanName) => showToast(`Mobile Unit ${vanName} dispatched on route.`)}
      />

      <SimulatePlumeModal
        isOpen={isSimulatePlumeOpen}
        onClose={() => setIsSimulatePlumeOpen(false)}
      />

      <IncidentDispatchModal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        incidentId={dispatchTarget.id}
        hotspotName={dispatchTarget.name}
        onDispatched={(teamName) =>
          showToast(`Containment unit "${teamName}" dispatched to ${dispatchTarget.name || 'incident zone'}.`)
        }
      />

      <PhotoInspectModal
        isOpen={isPhotoInspectOpen}
        onClose={() => setIsPhotoInspectOpen(false)}
        report={inspectingPhotoReport}
      />
    </div>
  );
}

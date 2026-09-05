export type NavScreen = 
  | 'overview' 
  | 'live-map' 
  | 'hotspots' 
  | 'predictions' 
  | 'citizen-reports' 
  | 'alerts-incidents' 
  | 'federated-network' 
  | 'analytics';

export type GeoNodeKey = 'Ranchi' | 'Delhi NCR' | 'Patna' | 'Mumbai';

export type TimeScrubKey = '-6h' | '-3h' | 'live' | '+3h' | '+6h' | '+12h';

export interface HotspotData {
  id: string;
  code: string;
  name: string;
  cluster: string;
  aqi: number;
  pm25: number;
  predictedPm25T6h: number;
  severity: 'critical' | 'high' | 'moderate';
  status: string;
  lat: number;
  lng: number;
  mapX: number; // percentage on canvas
  mapY: number;
  thermalFluxMW?: number;
  attribution: {
    industrial: number;
    biomass: number;
    transport: number;
    roadDust: number;
  };
  evidence: string[];
}

export interface IncidentAlert {
  id: string;
  title: string;
  severity: 'CRITICAL • SEVERE' | 'HIGH ADVISORY' | 'CITIZEN VERIFIED';
  severityType: 'critical' | 'high' | 'tertiary';
  timeAgo: string;
  description: string;
  impactTime: string;
  location: string;
  status: 'active' | 'dispatched' | 'dismissed';
  tags?: string;
  officersNotified?: number;
}

export interface CitizenReportItem {
  id: string;
  author: string;
  role: string;
  timeAgo: string;
  location: string;
  imageUrl: string;
  caption: string;
  opticalDensity: string;
  verified: boolean;
  upvotes: number;
  sensorCorrelation: string;
  pmElevation: string;
}

export interface SensorNodeItem {
  id: string;
  code: string;
  name: string;
  type: 'Mesh Micro-Station' | 'Satellite Virtual Proxy' | 'Spectrometer' | 'Tower Flux Array';
  status: 'online' | 'degraded' | 'calibrating' | 'offline';
  latency: number;
  battery: number;
  solarStatus: string;
  aqi: number;
  pm25: number;
  no2: number;
  zone: string;
  firmware: string;
  coordinates: string;
}

export interface MobileVanUnit {
  id: string;
  name: string;
  driver: string;
  status: 'Patrolling' | 'Standby' | 'En Route' | 'Analyzing';
  currentZone: string;
  battery: number;
  equipment: string[];
  liveAQI: number;
}

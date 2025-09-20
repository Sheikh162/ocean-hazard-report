// components/MapDisplay.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster'; // Import the cluster component
import { Report } from '@/types';

// (Icon fix remains the same)
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapDisplayProps {
  reports: (Report)[];
}

export default function MapDisplay({ reports }: MapDisplayProps) {
  const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai

  return (
    <MapContainer center={defaultCenter} zoom={5} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* --- NEW: Use MarkerClusterGroup --- */}
      <MarkerClusterGroup>
        {reports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup>
              <strong>{report.hazardType}</strong>
              <p>{report.locationAlias || 'No alias'}</p>
              <a href={`/admin/${report.id}`} style={{color: 'blue'}}>View Details</a>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

    </MapContainer>
  );
}
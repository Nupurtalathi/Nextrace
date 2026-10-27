import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MissingPersonCase } from '../../types';
import { useApp } from '../../context/AppContext';

interface CaseMapProps {
  cases: MissingPersonCase[];
  height?: string;
  focusCaseId?: string | null;
}

export const CaseMap: React.FC<CaseMapProps> = ({ cases, height = '400px', focusCaseId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { setSelectedCaseId, setActivePage } = useApp();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [28.635, 77.22], // NCR center
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom marker icon generator
    const createCustomIcon = (priority: string, isCriticalCorridor: boolean) => {
      const bgColor = priority === 'CRITICAL' ? '#dc2626' : priority === 'HIGH' ? '#d97706' : '#2563eb';
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${bgColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 13px;
            font-weight: bold;
            ${isCriticalCorridor ? 'animation: pulse 1.5s infinite;' : ''}
          ">
            ${priority === 'CRITICAL' ? '⚠️' : '📍'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
      });
    };

    const validCoordinatesCases = cases.filter(
      c => c.fir.lastSeenCoordinates && c.fir.lastSeenCoordinates.length === 2
    );

    validCoordinatesCases.forEach(c => {
      const [lat, lng] = c.fir.lastSeenCoordinates;
      const marker = L.marker([lat, lng], {
        icon: createCustomIcon(c.priority, !!c.crossDistrictAlert)
      }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-800 text-xs';
      popupContent.innerHTML = `
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
          <img src="${c.photoUrl}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover; border: 1px solid #cbd5e1;" />
          <div>
            <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${c.fullName}</div>
            <div style="font-size: 11px; color: #64748b;">${c.age} yrs • ${c.gender}</div>
            <div style="font-size: 10px; font-weight: 600; color: ${c.priority === 'CRITICAL' ? '#dc2626' : '#2563eb'};">${c.id}</div>
          </div>
        </div>
        <div style="font-size: 11px; margin-bottom: 4px; color: #334155;">
          <strong>Last Seen:</strong> ${c.fir.lastSeenLocation}
        </div>
        <div style="font-size: 11px; margin-bottom: 8px; color: #64748b;">
          <strong>Station:</strong> ${c.policeStation}
        </div>
        <button id="view-case-btn-${c.id}" style="
          width: 100%;
          background: #2563eb;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          border: none;
          font-weight: 600;
          font-size: 11px;
          cursor: pointer;
        ">
          Inspect Case Intelligence →
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-case-btn-${c.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedCaseId(c.id);
            setActivePage('cases');
          };
        }
      });

      markersRef.current.push(marker);

      if (focusCaseId && c.id === focusCaseId) {
        map.setView([lat, lng], 13);
        marker.openPopup();
      }
    });

    // Auto-fit bounds if no single focus
    if (!focusCaseId && validCoordinatesCases.length > 0) {
      const bounds = L.latLngBounds(validCoordinatesCases.map(c => c.fir.lastSeenCoordinates));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }

    return () => {
      // Keep map instance mounted across component re-renders
    };
  }, [cases, focusCaseId]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />
      <div className="absolute top-2 right-2 z-20 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] shadow-sm flex items-center space-x-3">
        <span className="flex items-center text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-1.5"></span>
          Critical / Alert
        </span>
        <span className="flex items-center text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span>
          High Priority
        </span>
        <span className="flex items-center text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-1.5"></span>
          Active
        </span>
      </div>
    </div>
  );
};


import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { IssueData } from '@/types';
import { getCategoryColor, getSeverityColor } from '@/utils/mapColors';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  issues: IssueData[];
  selectedIssue: string | undefined;
  onMarkerClick: (issue: IssueData) => void;
}

export const useMapMarkers = ({ 
  map, 
  issues, 
  selectedIssue, 
  onMarkerClick 
}: UseMapMarkersProps) => {
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const markerElementsRef = useRef<{ [key: string]: HTMLElement }>({});

  const createMarkerElement = (issue: IssueData, isSelected: boolean) => {
    const mainCategory = issue.tags[0] || "other";
    const color = getCategoryColor(mainCategory);
    const severityColor = getSeverityColor(issue.severity);

    const markerWrapper = document.createElement("div");
    markerWrapper.className = "marker-wrapper cursor-pointer";

    markerWrapper.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg border-2 ${isSelected ? 'scale-150' : ''} transition-transform duration-300" 
           style="border-color: ${color}">
        <div class="w-3 h-3 rounded-full" 
             style="background-color: ${severityColor}"></div>
      </div>
    `;

    return markerWrapper;
  };

  const updateMarkers = () => {
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    markerElementsRef.current = {};

    issues.forEach(issue => {
      if (!issue.location.latitude || !issue.location.longitude) return;

      const markerElement = createMarkerElement(issue, issue.id === selectedIssue);
      markerElement.addEventListener('click', () => onMarkerClick(issue));

      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'bottom'
      })
        .setLngLat([issue.location.longitude, issue.location.latitude])
        .addTo(map);

      markersRef.current[issue.id] = marker;
      markerElementsRef.current[issue.id] = markerElement;
    });
  };

  useEffect(() => {
    updateMarkers();
  }, [map, issues, selectedIssue]);

  return { markersRef, markerElementsRef };
};

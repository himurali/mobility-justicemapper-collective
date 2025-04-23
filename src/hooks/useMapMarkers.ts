
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
    markerWrapper.className = `marker-wrapper cursor-pointer transition-all duration-300 ${isSelected ? 'animate-pulse' : ''}`;
    markerWrapper.style.transform = isSelected ? 'scale(1.5)' : 'scale(1)';
    markerWrapper.style.zIndex = isSelected ? '10' : '1';
    markerWrapper.setAttribute('data-issue-id', issue.id);

    markerWrapper.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg border-2 ${isSelected ? 'ring-4 ring-primary ring-opacity-50' : ''}"
           style="border-color: ${color}">
        <div class="w-4 h-4 rounded-full" 
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

    // Add markers for each issue with valid coordinates
    issues.forEach(issue => {
      if (!issue.location.latitude || !issue.location.longitude) {
        console.warn(`Issue ${issue.id} has invalid coordinates:`, issue.location);
        return;
      }

      try {
        const isSelected = issue.id === selectedIssue;
        const markerElement = createMarkerElement(issue, isSelected);
        markerElement.addEventListener('click', () => onMarkerClick(issue));

        // Create the marker with exact coordinates
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'bottom'
        })
          .setLngLat([issue.location.longitude, issue.location.latitude])
          .addTo(map);

        markersRef.current[issue.id] = marker;
        markerElementsRef.current[issue.id] = markerElement;
        
        // Debug info
        console.log(`Added marker for issue ${issue.id} at [${issue.location.longitude}, ${issue.location.latitude}]`);
      } catch (error) {
        console.error(`Error adding marker for issue ${issue.id}:`, error);
      }
    });
  };

  // Update markers whenever map, issues, or selectedIssue changes
  useEffect(() => {
    if (map && map.loaded()) {
      updateMarkers();
    } else if (map) {
      map.once('load', updateMarkers);
    }
    
    return () => {
      Object.values(markersRef.current).forEach(marker => marker.remove());
    };
  }, [map, issues, selectedIssue]);

  return { markersRef, markerElementsRef };
};


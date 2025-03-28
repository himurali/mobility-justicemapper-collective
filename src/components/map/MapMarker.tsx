
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { IssueData } from "@/types";
import { getCategoryColor, getSeverityColor } from '@/utils/mapUtils';

interface MapMarkerProps {
  issue: IssueData;
  map: mapboxgl.Map;
  isSelected: boolean;
  onClick: (issue: IssueData) => void;
}

const MapMarker = ({ issue, map, isSelected, onClick }: MapMarkerProps) => {
  const markerElement = document.createElement("div");
  markerElement.className = "cursor-pointer";
  
  const mainCategory = issue.tags[0] || "other";
  
  // Set initial marker style
  markerElement.innerHTML = `
    <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border-2 ${isSelected ? 'scale-150' : ''} transition-transform duration-300" 
         style="border-color: ${getCategoryColor(mainCategory)}">
      <div class="w-3 h-3 rounded-full" 
           style="background-color: ${getSeverityColor(issue.severity)}"></div>
    </div>
  `;
  
  // Handle marker click
  markerElement.addEventListener('click', () => {
    onClick(issue);
  });
  
  // Create and add the marker to the map
  const marker = new mapboxgl.Marker(markerElement)
    .setLngLat([issue.location.longitude, issue.location.latitude])
    .addTo(map);
    
  return { element: markerElement, marker };
};

export default MapMarker;


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
  const categoryColor = getCategoryColor(mainCategory);
  const severityColor = getSeverityColor(issue.severity);
  
  // Set initial marker style with improved visibility
  markerElement.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 ${isSelected ? 'scale-150' : ''} transition-transform duration-300" 
         style="border-color: ${categoryColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
      <div class="w-5 h-5 rounded-full" 
           style="background-color: ${severityColor}"></div>
    </div>
  `;
  
  // Add a tooltip with the issue title
  const tooltip = document.createElement('div');
  tooltip.className = 'absolute bg-white px-3 py-2 rounded shadow-lg text-sm pointer-events-none opacity-0 transition-opacity duration-200 -mt-14 text-center min-w-[150px] max-w-[200px] z-10';
  tooltip.style.transform = 'translateX(-50%)';
  
  // Add title and severity to tooltip
  tooltip.innerHTML = `
    <div class="font-semibold">${issue.title}</div>
    <div class="text-xs mt-1 flex items-center justify-center gap-1">
      <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${severityColor}"></span>
      <span class="capitalize">${issue.severity}</span>
    </div>
  `;
  
  markerElement.appendChild(tooltip);
  
  // Show/hide tooltip on hover
  markerElement.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1';
  });
  
  markerElement.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });
  
  // Handle marker click
  markerElement.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling to map
    onClick(issue);
  });
  
  // Create and add the marker to the map
  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: 'bottom',
    offset: [0, -4]  // Slight offset to make marker positioning more accurate
  })
    .setLngLat([issue.location.longitude, issue.location.latitude])
    .addTo(map);
    
  return { element: markerElement, marker };
};

export default MapMarker;

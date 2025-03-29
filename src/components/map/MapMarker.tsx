
import React from "react";
import mapboxgl from "mapbox-gl";
import { IssueData } from "@/types";
import { getCategoryColor, getSeverityColor } from "@/utils/mapUtils";

interface MapMarkerProps {
  issue: IssueData;
  map: mapboxgl.Map;
  isSelected: boolean;
  onClick: (issue: IssueData) => void;
}

const MapMarker = ({ issue, map, isSelected, onClick }: MapMarkerProps) => {
  const markerElement = document.createElement("div");
  markerElement.className = "marker-container relative cursor-pointer z-10";
  markerElement.setAttribute("data-issue-id", issue.id);
  markerElement.setAttribute("data-category", issue.tags[0] || "other");
  markerElement.setAttribute("data-severity", issue.severity);

  const mainCategory = issue.tags[0] || "other";
  const categoryColor = getCategoryColor(mainCategory);
  const severityColor = getSeverityColor(issue.severity);

  // Apply initial styling based on selection state
  const scaleClass = isSelected ? "scale-125" : "";
  const borderWidth = isSelected ? "border-3" : "border-2";
  const zIndex = isSelected ? 30 : 10;
  
  markerElement.innerHTML = `
    <div class="marker-inner w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg ${borderWidth} ${scaleClass} transition-transform duration-300"
         style="border-color: ${categoryColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: ${zIndex};">
      <div class="w-5 h-5 rounded-full" 
           style="background-color: ${severityColor}"></div>
    </div>
    <div class="marker-tooltip hidden absolute top-0 left-1/2 bg-white px-3 py-2 rounded-lg shadow-md text-sm text-gray-800 -mt-16 transform -translate-x-1/2 min-w-[160px] z-20">
      <div class="font-medium truncate">${issue.title}</div>
      <div class="text-xs mt-1 flex items-center justify-center gap-1">
        <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${severityColor}"></span>
        <span class="capitalize">${issue.severity}</span>
      </div>
    </div>
  `;

  // Show tooltip on hover
  markerElement.addEventListener("mouseenter", () => {
    const tooltip = markerElement.querySelector(".marker-tooltip");
    tooltip?.classList.remove("hidden");
  });
  
  markerElement.addEventListener("mouseleave", () => {
    const tooltip = markerElement.querySelector(".marker-tooltip");
    tooltip?.classList.add("hidden");
  });

  // Handle click with immediate response
  markerElement.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Marker clicked:", issue.id);
    onClick(issue);
  });

  // Create and add the marker to the map
  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: "bottom",
    offset: [0, -5],
  })
    .setLngLat([issue.location.longitude, issue.location.latitude])
    .addTo(map);

  return { element: markerElement, marker };
};

export default MapMarker;

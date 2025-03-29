
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

  const mainCategory = issue.tags[0] || "other";
  const categoryColor = getCategoryColor(mainCategory);
  const severityColor = getSeverityColor(issue.severity);

  markerElement.innerHTML = `
    <div class="marker-inner w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border-2 transition-all duration-200 hover:scale-110 ${
      isSelected ? "scale-125 border-4" : ""
    }"
         style="border-color: ${categoryColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: ${
           isSelected ? 30 : 10
         };">
      <div class="w-6 h-6 rounded-full" 
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

  const markerInner = markerElement.querySelector(".marker-inner");
  const tooltip = markerElement.querySelector(".marker-tooltip");

  // Show tooltip on hover
  markerInner?.addEventListener("mouseenter", () => {
    tooltip?.classList.remove("hidden");
  });
  markerInner?.addEventListener("mouseleave", () => {
    tooltip?.classList.add("hidden");
  });

  // Handle click with debouncing
  let clickTimeout: NodeJS.Timeout;
  markerElement.addEventListener("click", (e) => {
    e.stopPropagation();
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      onClick(issue);
    }, 200);
  });

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


import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IssueCategory, IssueData } from "@/types";
import { mockIssues } from "@/data/issueData";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import IssueDetail from "@/components/IssueDetail";

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  selectedIssue?: string;
  categoryFilter?: IssueCategory | "all";
  severityFilter?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [77.5946, 12.9716], // Default to Bangalore
  zoom = 12,
  selectedIssue,
  categoryFilter = "all",
  severityFilter = "all",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for the issue dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueData, setSelectedIssueData] = useState<IssueData | null>(null);
  
  // Use the provided token directly
  const mapboxToken = "pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ";

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "safety":
        return "#ef4444"; // red
      case "traffic":
        return "#f59e0b"; // amber
      case "cycling":
        return "#10b981"; // green
      case "sidewalks":
        return "#6366f1"; // indigo
      case "accessibility":
        return "#8b5cf6"; // violet
      case "public_transport":
        return "#0ea5e9"; // sky
      default:
        return "#64748b"; // slate
    }
  };

  const initializeMap = () => {
    if (map.current) return;
    
    try {
      // Initialize Mapbox with the provided token
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: zoom,
      });
  
      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
      );
  
      map.current.on("load", () => {
        addMarkers();
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "Could not initialize the map. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const addMarkers = () => {
    if (!map.current) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Filter issues based on category and severity
    const filteredIssues = mockIssues.filter(issue => {
      // For Bangalore issues, use the first tag that matches our categories
      const issueCategory = issue.tags.find(tag => 
        ["safety", "traffic", "cycling", "sidewalks", "accessibility", "public_transport"].includes(tag.toLowerCase())
      ) || "other";
      
      // Extract severity from tags if available, otherwise default to "medium"
      const issueSeverity = issue.tags.find(tag => 
        ["low", "medium", "high"].includes(tag.toLowerCase())
      ) || "medium";
      
      const categoryMatch = categoryFilter === "all" || 
        (issueCategory.toLowerCase() === categoryFilter.toLowerCase());
      const severityMatch = severityFilter === "all" || 
        (issueSeverity.toLowerCase() === severityFilter.toLowerCase());
        
      return categoryMatch && severityMatch;
    });

    // Add markers for filtered issues
    filteredIssues.forEach(issue => {
      // Get the category for color
      const issueCategory = issue.tags.find(tag => 
        ["safety", "traffic", "cycling", "sidewalks", "accessibility", "public_transport"].includes(tag.toLowerCase())
      ) || "other";
      
      // Create custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = "cursor-pointer";
      markerElement.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border-2" 
             style="border-color: ${getCategoryColor(issueCategory.toLowerCase())}">
          <div class="w-3 h-3 rounded-full" 
               style="background-color: ${getCategoryColor(issueCategory.toLowerCase())}"></div>
        </div>
      `;

      // Add marker to map with click functionality to show dialog
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([issue.location.longitude, issue.location.latitude])
        .addTo(map.current!);
      
      // Add click event to marker
      markerElement.addEventListener('click', () => {
        setSelectedIssueData(issue);
        setIsDialogOpen(true);
      });

      markersRef.current[issue.id] = marker;
    });

    // If a specific issue is selected, focus on it
    if (selectedIssue && markersRef.current[selectedIssue]) {
      map.current.flyTo({
        center: markersRef.current[selectedIssue].getLngLat(),
        zoom: 15,
        essential: true
      });
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [categoryFilter, severityFilter, selectedIssue]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm" />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[90%] h-[80vh] max-h-[90vh] p-0">
          <IssueDetail 
            issue={selectedIssueData} 
            onClose={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapComponent;

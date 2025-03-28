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
  onSelectIssue?: (issueId: string) => void;
  selectedTab?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [77.5946, 12.9716],
  zoom = 12,
  selectedIssue,
  categoryFilter = "all",
  severityFilter = "all",
  onSelectIssue,
  selectedTab = "video",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const markerElementsRef = useRef<{ [key: string]: HTMLElement }>({});
  const blinkIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueData, setSelectedIssueData] = useState<IssueData | null>(null);
  const [activeTab, setActiveTab] = useState(selectedTab);
  
  const mapboxToken = "pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ";

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "safety":
        return "#ef4444";
      case "traffic":
        return "#f59e0b";
      case "cycling":
        return "#10b981";
      case "sidewalks":
        return "#6366f1";
      case "accessibility":
        return "#8b5cf6";
      case "public_transport":
        return "#0ea5e9";
      default:
        return "#64748b";
    }
  };

  const stopBlinking = () => {
    if (blinkIntervalRef.current) {
      window.clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }

    Object.entries(markerElementsRef.current).forEach(([issueId, element]) => {
      const issueCategory = mockIssues.find(i => i.id === issueId)?.tags.find(tag => 
        ["safety", "traffic", "cycling", "sidewalks", "accessibility", "public_transport"].includes(tag.toLowerCase())
      ) || "other";
      
      const isSelected = issueId === selectedIssue;
      
      const scale = isSelected ? 'scale-150' : '';
      const borderWidth = isSelected ? 'border-3' : 'border-2';
      
      if (element) {
        element.innerHTML = `
          <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md ${borderWidth} ${scale} transition-transform duration-300" 
               style="border-color: ${getCategoryColor(issueCategory.toLowerCase())}">
            <div class="w-3 h-3 rounded-full" 
                 style="background-color: ${getCategoryColor(issueCategory.toLowerCase())}"></div>
          </div>
        `;
      }
    });
  };

  const startBlinking = (issueId: string) => {
    if (!markerElementsRef.current[issueId]) return;
    
    const issueCategory = mockIssues.find(i => i.id === issueId)?.tags.find(tag => 
      ["safety", "traffic", "cycling", "sidewalks", "accessibility", "public_transport"].includes(tag.toLowerCase())
    ) || "other";
    
    const color = getCategoryColor(issueCategory.toLowerCase());
    let isLarge = true;
    
    blinkIntervalRef.current = window.setInterval(() => {
      if (!markerElementsRef.current[issueId]) return;
      
      isLarge = !isLarge;
      const scale = isLarge ? 'scale-150' : 'scale-125';
      const glow = isLarge ? `box-shadow: 0 0 10px ${color}, 0 0 20px ${color}` : '';
      
      markerElementsRef.current[issueId].innerHTML = `
        <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border-3 ${scale} transition-transform duration-300" 
             style="border-color: ${color}; ${glow}">
          <div class="w-3 h-3 rounded-full" 
               style="background-color: ${color}"></div>
        </div>
      `;
    }, 500);
  };

  const initializeMap = () => {
    if (map.current) return;
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: zoom,
      });
  
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

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    markerElementsRef.current = {};

    const filteredIssues = mockIssues.filter(issue => {
      const issueCategory = issue.tags.find(tag => 
        ["safety", "traffic", "cycling", "sidewalks", "accessibility", "public_transport"].includes(tag.toLowerCase())
      ) || "other";
      
      const issueSeverity = issue.tags.find(tag => 
        ["low", "medium", "high"].includes(tag.toLowerCase())
      ) || "medium";
      
      const categoryMatch = categoryFilter === "all" || 
        (issueCategory.toLowerCase() === categoryFilter.toLowerCase());
      const severityMatch = severityFilter === "all" || 
        (issueSeverity.toLowerCase() === severityFilter.toLowerCase());
        
      return categoryMatch && severityMatch;
    });

    filteredIssues.forEach(issue => {
      const issueCategory = issue.tags.find(tag => 
        ["safety", "traffic", "cycling", "sidewalks", "accessibility", "public_transport"].includes(tag.toLowerCase())
      ) || "other";
      
      const isSelected = issue.id === selectedIssue;
      
      const markerElement = document.createElement("div");
      markerElement.className = "cursor-pointer";
      markerElement.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border-2 ${isSelected ? 'scale-150' : ''} transition-transform duration-300" 
             style="border-color: ${getCategoryColor(issueCategory.toLowerCase())}">
          <div class="w-3 h-3 rounded-full" 
               style="background-color: ${getCategoryColor(issueCategory.toLowerCase())}"></div>
        </div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([issue.location.longitude, issue.location.latitude])
        .addTo(map.current!);
      
      markerElement.addEventListener('click', () => {
        if (onSelectIssue) {
          onSelectIssue(issue.id);
        }
        
        setSelectedIssueData(issue);
        setIsDialogOpen(true);
      });

      markersRef.current[issue.id] = marker;
      markerElementsRef.current[issue.id] = markerElement;
    });

    if (selectedIssue && markersRef.current[selectedIssue]) {
      map.current.flyTo({
        center: markersRef.current[selectedIssue].getLngLat(),
        zoom: 15,
        essential: true
      });
      
      stopBlinking();
      startBlinking(selectedIssue);
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      stopBlinking();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true
      });
      addMarkers();
    }
  }, [center, zoom, categoryFilter, severityFilter, selectedIssue]);

  useEffect(() => {
    stopBlinking();
    
    if (selectedIssue) {
      startBlinking(selectedIssue);
    }
    
    return () => stopBlinking();
  }, [selectedIssue]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm" />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[90%] h-[80vh] max-h-[90vh] p-0">
          <IssueDetail 
            issue={selectedIssueData} 
            onClose={() => setIsDialogOpen(false)} 
            initialTab={activeTab}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapComponent;


import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IssueReport, IssueCategory, City } from "@/types";
import { mockIssues } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  selectedIssue?: string;
  categoryFilter?: IssueCategory | "all";
  severityFilter?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [-74.0060, 40.7128], // Default to NYC
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
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);

  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowTokenInput(false);
    initializeMap();
  };

  const getCategoryColor = (category: IssueCategory): string => {
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
    if (!mapboxToken) {
      toast({
        title: "Mapbox Token Required",
        description: "Please enter a valid Mapbox token to display the map.",
        variant: "destructive",
      });
      setShowTokenInput(true);
      return;
    }

    if (map.current) return;
    
    try {
      // Initialize Mapbox
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
        description: "Could not initialize the map. Please check your token.",
        variant: "destructive",
      });
      setShowTokenInput(true);
    }
  };

  const addMarkers = () => {
    if (!map.current) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Filter issues based on category and severity
    const filteredIssues = mockIssues.filter(issue => {
      const categoryMatch = categoryFilter === "all" || issue.category === categoryFilter;
      const severityMatch = severityFilter === "all" || issue.severity === severityFilter;
      return categoryMatch && severityMatch;
    });

    // Add markers for filtered issues
    filteredIssues.forEach(issue => {
      // Create custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = "cursor-pointer";
      markerElement.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border-2" 
             style="border-color: ${getCategoryColor(issue.category)}">
          <div class="w-3 h-3 rounded-full" 
               style="background-color: ${getCategoryColor(issue.category)}"></div>
        </div>
      `;

      // Add marker to map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([issue.location.longitude, issue.location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="flex flex-col gap-2">
              <h3 class="font-medium text-sm">${issue.title}</h3>
              <p class="text-xs text-muted-foreground">${issue.category} · ${issue.severity} severity</p>
              <button id="popup-view-more" class="text-xs text-primary hover:underline">View details</button>
            </div>
          `)
        )
        .addTo(map.current!);

      // Add click event to "View details" button in popup
      marker.getPopup().on('open', () => {
        setTimeout(() => {
          const viewMoreButton = document.getElementById('popup-view-more');
          if (viewMoreButton) {
            viewMoreButton.addEventListener('click', () => {
              navigate(`/issues/${issue.id}`);
            });
          }
        }, 10);
      });

      markersRef.current[issue.id] = marker;
    });

    // If a specific issue is selected, open its popup
    if (selectedIssue && markersRef.current[selectedIssue]) {
      map.current.flyTo({
        center: markersRef.current[selectedIssue].getLngLat(),
        zoom: 15,
        essential: true
      });
      markersRef.current[selectedIssue].togglePopup();
    }
  };

  const switchCity = (city: City) => {
    if (!map.current) return;

    map.current.flyTo({
      center: city.coordinates,
      zoom: city.zoom,
      essential: true,
    });
  };

  useEffect(() => {
    if (!showTokenInput && mapboxToken) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [showTokenInput, mapboxToken]);

  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [categoryFilter, severityFilter, selectedIssue]);

  return (
    <>
      {showTokenInput ? (
        <div className="flex flex-col items-center justify-center w-full h-full rounded-lg border-2 border-dashed border-border p-6">
          <h3 className="text-lg font-medium mb-4">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To display the map, please enter your Mapbox public token.
            You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
          <form onSubmit={handleTokenSubmit} className="w-full max-w-md">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="Enter your Mapbox token"
                className="w-full px-3 py-2 border rounded-md text-sm"
                required
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium"
              >
                Set Token
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm" />
      )}
    </>
  );
};

export default MapComponent;

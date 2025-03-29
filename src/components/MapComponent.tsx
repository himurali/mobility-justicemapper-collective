
import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "@/styles/mapbox.css";
import { IssueCategory, IssueData } from "@/types";
import { mockIssues } from "@/data/issueData";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IssueDetail from "@/components/IssueDetail";
import { useMapInitialization } from "@/hooks/map/useMapInitialization";
import { useMarkerAnimation } from "@/hooks/useMarkerAnimation";
import MapMarker from "@/components/map/MapMarker";

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  selectedIssue?: string;
  categoryFilter?: IssueCategory | "all";
  severityFilter?: string;
  onSelectIssue?: (issueId: string) => void;
  selectedTab?: string;
  onVisibleIssuesChange?: (issueIds: string[]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [77.5946, 12.9716],
  zoom = 12,
  selectedIssue,
  categoryFilter = "all",
  severityFilter = "all",
  onSelectIssue,
  selectedTab = "video",
  onVisibleIssuesChange,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueData, setSelectedIssueData] = useState<IssueData | null>(null);
  const [activeTab, setActiveTab] = useState(selectedTab);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const markerElementsRef = useRef<{ [key: string]: HTMLElement }>({});
  const isMountedRef = useRef(true);
  const prevSelectedIssueRef = useRef<string | undefined>(undefined);

  const {
    mapContainer,
    map,
    mapStyleLoaded,
    visibleIssueIds,
    initializeMap,
    updateMapSource,
    cleanupMap,
  } = useMapInitialization({
    center,
    zoom,
    categoryFilter,
    severityFilter,
    onVisibleIssuesChange,
    issues: mockIssues,
  });

  const { stopBlinking, startBlinking } = useMarkerAnimation();

  // Update active tab when prop changes
  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  // Initialize map on component mount
  useEffect(() => {
    isMountedRef.current = true;
    initializeMap();

    return () => {
      isMountedRef.current = false;
      stopBlinking(markerElementsRef.current, selectedIssue);
      Object.values(markersRef.current).forEach(marker => marker.remove());
      cleanupMap();
    };
  }, []);

  // Fly to new center/zoom and update markers when filters change
  useEffect(() => {
    if (!map.current || !mapStyleLoaded) return;

    // Fly to the new center and zoom
    map.current.flyTo({ center, zoom, essential: true });

    // Update map source and add markers
    updateMapSource();
    addMarkers();

    // Handle map click to close dialog if clicking outside markers
    map.current.on("click", () => {
      setIsDialogOpen(false);
    });
  }, [center, zoom, categoryFilter, severityFilter, mapStyleLoaded]);

  // Handle selected issue changes
  useEffect(() => {
    if (selectedIssue !== prevSelectedIssueRef.current) {
      // Stop animation on previous selection
      if (prevSelectedIssueRef.current) {
        stopBlinking(markerElementsRef.current, prevSelectedIssueRef.current);
      }
      
      // Start animation on new selection
      if (selectedIssue) {
        console.log("Starting animation for:", selectedIssue);
        const issue = mockIssues.find(issue => issue.id === selectedIssue);
        
        if (issue && map.current) {
          map.current.easeTo({
            center: [issue.location.longitude, issue.location.latitude],
            zoom: 15,
            duration: 1000,
          });
          
          // Highlight the marker
          startBlinking(selectedIssue, markerElementsRef.current);
          
          // Update selected issue data and open dialog
          setSelectedIssueData(issue);
          setIsDialogOpen(true);
        }
      }
      
      prevSelectedIssueRef.current = selectedIssue;
    }
  }, [selectedIssue, stopBlinking, startBlinking]);

  // Add markers when visible issues change
  useEffect(() => {
    if (mapStyleLoaded && map.current) {
      addMarkers();
    }
  }, [visibleIssueIds, mapStyleLoaded]);

  // Function to add markers to the map
  const addMarkers = () => {
    if (!map.current || !mapStyleLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    markerElementsRef.current = {};

    const filteredIssues = mockIssues.filter(issue => {
      const cityMatch = issue.city.toLowerCase() === "bangalore";
      const categoryMatch = categoryFilter === "all" || issue.tags.includes(categoryFilter);
      const severityMatch = severityFilter === "all" || issue.severity === severityFilter;
      return cityMatch && categoryMatch && severityMatch;
    });

    filteredIssues.forEach(issue => {
      const shouldBeVisible = true; // Show all markers since clustering is disabled
      
      if (!shouldBeVisible) return;

      const handleIssueSelect = (selectedIssue: IssueData) => {
        console.log("Issue selected:", selectedIssue.id);
        if (onSelectIssue) onSelectIssue(selectedIssue.id);
        setSelectedIssueData(selectedIssue);
        setIsDialogOpen(true);
        if (map.current) {
          map.current.easeTo({
            center: [selectedIssue.location.longitude, selectedIssue.location.latitude],
            zoom: 15,
            duration: 1000,
          });
        }
      };

      const { element, marker } = MapMarker({
        issue,
        map: map.current,
        isSelected: issue.id === selectedIssue,
        onClick: handleIssueSelect,
      });

      markersRef.current[issue.id] = marker;
      markerElementsRef.current[issue.id] = element;
    });
    
    // Start blinking for selected issue if it exists
    if (selectedIssue && markerElementsRef.current[selectedIssue]) {
      startBlinking(selectedIssue, markerElementsRef.current);
    }
  };

  return (
    <>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm relative">
        {!mapStyleLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[90%] h-[80vh] max-h-[90vh] p-0">
          {selectedIssueData && (
            <IssueDetail
              issue={selectedIssueData}
              onClose={() => setIsDialogOpen(false)}
              initialTab={activeTab}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapComponent;

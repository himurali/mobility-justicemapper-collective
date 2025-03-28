
import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IssueCategory, IssueData } from "@/types";
import { mockIssues } from "@/data/issueData";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IssueDetail from "@/components/IssueDetail";
import { useMapInitialization } from "@/hooks/useMapInitialization";
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
  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueData, setSelectedIssueData] = useState<IssueData | null>(null);
  const [activeTab, setActiveTab] = useState(selectedTab);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const markerElementsRef = useRef<{ [key: string]: HTMLElement }>({});
  
  // Custom hooks
  const { 
    mapContainer, 
    map, 
    mapStyleLoaded, 
    clusterClicked,
    visibleIssueIds,
    setClusterClicked,
    setVisibleIssueIds,
    initializeMap, 
    updateMapSource 
  } = useMapInitialization({
    center,
    zoom,
    categoryFilter,
    severityFilter,
    onVisibleIssuesChange,
    issues: mockIssues
  });
  
  const { stopBlinking, startBlinking } = useMarkerAnimation();
  
  // Track selected tab
  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);
  
  // Initialize the map
  useEffect(() => {
    initializeMap();

    return () => {
      stopBlinking(markerElementsRef.current, selectedIssue);
      map.current?.remove();
    };
  }, []);
  
  // Update map when relevant props change
  useEffect(() => {
    if (map.current && mapStyleLoaded) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true
      });
      
      setClusterClicked(false);
      setVisibleIssueIds([]);
      if (onVisibleIssuesChange) {
        onVisibleIssuesChange([]);
      }
      
      addMarkers();
      updateMapSource();
    }
  }, [center, zoom, categoryFilter, severityFilter, mapStyleLoaded]);
  
  // Handle marker blinking animation
  useEffect(() => {
    stopBlinking(markerElementsRef.current, selectedIssue);
    
    if (selectedIssue) {
      startBlinking(selectedIssue, markerElementsRef.current);
    }
    
    return () => stopBlinking(markerElementsRef.current, selectedIssue);
  }, [selectedIssue]);
  
  // Add markers to the map
  const addMarkers = () => {
    if (!map.current || !mapStyleLoaded) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    markerElementsRef.current = {};
    
    // Filter issues based on current filters
    const filteredIssues = mockIssues.filter(issue => {
      if (issue.city.toLowerCase() !== center[1].toString()) {
        const cityMatch = issue.city.toLowerCase() === "bangalore";
        if (!cityMatch) return false;
      }
      
      if (categoryFilter !== "all") {
        const categoryMatch = issue.tags.some(tag => tag === categoryFilter);
        if (!categoryMatch) return false;
      }
      
      if (severityFilter !== "all" && issue.severity !== severityFilter) {
        return false;
      }
        
      return true;
    });
    
    // Add markers for visible or selected issues
    filteredIssues.forEach(issue => {
      const shouldBeVisible = 
        issue.id === selectedIssue || 
        visibleIssueIds.includes(issue.id);
      
      if (!shouldBeVisible) return;
      
      // Create marker
      const handleIssueSelect = (issue: IssueData) => {
        if (onSelectIssue) {
          onSelectIssue(issue.id);
        }
        
        setSelectedIssueData(issue);
        setIsDialogOpen(true);
      };
      
      const { element, marker } = MapMarker({
        issue,
        map: map.current!,
        isSelected: issue.id === selectedIssue,
        onClick: handleIssueSelect
      });
      
      // Store references to markers
      markersRef.current[issue.id] = marker;
      markerElementsRef.current[issue.id] = element;
      
      // Set data attributes for animation
      element.setAttribute('data-category', issue.tags[0] || 'other');
      element.setAttribute('data-severity', issue.severity);
    });
    
    // Center map on selected issue if available
    if (selectedIssue && markersRef.current[selectedIssue]) {
      map.current.flyTo({
        center: markersRef.current[selectedIssue].getLngLat(),
        zoom: 15,
        essential: true
      });
      
      stopBlinking(markerElementsRef.current, selectedIssue);
      startBlinking(selectedIssue, markerElementsRef.current);
    }
    
    // Select first visible issue if cluster was clicked and no issue is selected
    if (clusterClicked && onSelectIssue && typeof onSelectIssue === 'function' && visibleIssueIds.length > 0) {
      const firstVisibleId = visibleIssueIds[0];
      if (firstVisibleId && !selectedIssue) {
        onSelectIssue(firstVisibleId);
      }
    }
  };

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

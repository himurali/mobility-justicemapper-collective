
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
  const isMountedRef = useRef(true);
  
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
    updateMapSource,
    cleanupMap 
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
    if (!isMountedRef.current) return;
    setActiveTab(selectedTab);
  }, [selectedTab]);
  
  // Initialize the map once on component mount
  useEffect(() => {
    isMountedRef.current = true;
    
    if (isMountedRef.current) {
      initializeMap();
    }

    return () => {
      isMountedRef.current = false;
      
      // First stop marker animations
      if (markerElementsRef.current) {
        try {
          stopBlinking(markerElementsRef.current, selectedIssue);
        } catch (error) {
          console.error("Error stopping marker animations:", error);
        }
      }
      
      // Remove all markers
      Object.values(markersRef.current || {}).forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.error("Error removing marker:", error);
        }
      });
      
      // Then cleanup the map
      cleanupMap();
    };
  }, []);
  
  // Update map when relevant props change
  useEffect(() => {
    if (!isMountedRef.current || !map.current || !mapStyleLoaded) return;
    
    try {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true
      });
      
      setClusterClicked(false);
      if (onVisibleIssuesChange) {
        onVisibleIssuesChange([]);
      }
      
      setTimeout(() => {
        if (!isMountedRef.current) return;
        updateMapSource();
        addMarkers();
      }, 100);
    } catch (error) {
      console.error("Error updating map:", error);
    }
  }, [center, zoom, categoryFilter, severityFilter, mapStyleLoaded]);
  
  // Handle marker blinking animation
  useEffect(() => {
    if (!isMountedRef.current || !markerElementsRef.current) return;
    
    try {
      stopBlinking(markerElementsRef.current, selectedIssue);
      
      if (selectedIssue) {
        startBlinking(selectedIssue, markerElementsRef.current);
      }
    } catch (error) {
      console.error("Error with marker animation:", error);
    }
    
    return () => {
      if (markerElementsRef.current && isMountedRef.current) {
        try {
          stopBlinking(markerElementsRef.current, selectedIssue);
        } catch (error) {
          console.error("Error stopping blinking on cleanup:", error);
        }
      }
    };
  }, [selectedIssue]);
  
  // Add markers to the map
  const addMarkers = () => {
    if (!isMountedRef.current || !map.current || !mapStyleLoaded) return;

    // Remove existing markers
    Object.values(markersRef.current || {}).forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.error("Error removing marker:", error);
      }
    });
    
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
      if (!isMountedRef.current || !map.current) return;
      
      const shouldBeVisible = 
        issue.id === selectedIssue || 
        visibleIssueIds.includes(issue.id) ||
        clusterClicked;
      
      if (!shouldBeVisible && visibleIssueIds.length > 0) return;
      
      // Create marker
      const handleIssueSelect = (issue: IssueData) => {
        if (!isMountedRef.current) return;
        
        if (onSelectIssue) {
          onSelectIssue(issue.id);
        }
        
        setSelectedIssueData(issue);
        setIsDialogOpen(true);
      };
      
      try {
        if (!map.current) return;
        
        const { element, marker } = MapMarker({
          issue,
          map: map.current,
          isSelected: issue.id === selectedIssue,
          onClick: handleIssueSelect
        });
        
        // Store references to markers
        markersRef.current[issue.id] = marker;
        markerElementsRef.current[issue.id] = element;
        
        // Set data attributes for animation
        element.setAttribute('data-category', issue.tags[0] || 'other');
        element.setAttribute('data-severity', issue.severity);
      } catch (error) {
        console.error("Error creating marker:", error);
      }
    });
    
    // Center map on selected issue if available
    if (selectedIssue && markersRef.current[selectedIssue] && map.current) {
      try {
        map.current.flyTo({
          center: markersRef.current[selectedIssue].getLngLat(),
          zoom: 15,
          essential: true
        });
        
        stopBlinking(markerElementsRef.current, selectedIssue);
        startBlinking(selectedIssue, markerElementsRef.current);
      } catch (error) {
        console.error("Error centering on selected issue:", error);
      }
    }
    
    // Select first visible issue if cluster was clicked and no issue is selected
    if (clusterClicked && onSelectIssue && visibleIssueIds.length > 0 && !selectedIssue) {
      const firstVisibleId = visibleIssueIds[0];
      if (firstVisibleId) {
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

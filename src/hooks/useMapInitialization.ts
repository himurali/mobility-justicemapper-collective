
import { useState, useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from "@/components/ui/use-toast";
import { IssueData } from "@/types";
import { issuesToGeoJSON, filterIssues } from '@/utils/mapUtils';

interface UseMapInitializationProps {
  center: [number, number];
  zoom: number;
  categoryFilter: string;
  severityFilter: string;
  onVisibleIssuesChange?: (issueIds: string[]) => void;
  issues: IssueData[];
}

export function useMapInitialization({
  center,
  zoom,
  categoryFilter,
  severityFilter,
  onVisibleIssuesChange,
  issues
}: UseMapInitializationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapStyleLoaded, setMapStyleLoaded] = useState(false);
  const [visibleIssueIds, setVisibleIssueIds] = useState<string[]>([]);
  const { toast } = useToast();
  const mapboxToken = "pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ";
  const isMountedRef = useRef(true);
  
  // Safe map removal function to prevent errors
  const cleanupMap = useCallback(() => {
    if (!map.current) return;
    
    try {
      // Check if the map is actually initialized and has methods
      if (map.current && typeof map.current.remove === 'function') {
        map.current.remove();
      }
    } catch (error) {
      console.error("Error removing map:", error);
    } finally {
      map.current = null;
      setMapStyleLoaded(false);
    }
  }, []);

  // Define updateMapSource function
  const updateMapSource = useCallback(() => {
    if (!map.current || !mapStyleLoaded || !isMountedRef.current) return;

    try {
      const filteredIssues = filterIssues(issues, center, categoryFilter, severityFilter);
      const geoJsonData = issuesToGeoJSON(filteredIssues);
      
      if (map.current && map.current.getSource('issues')) {
        try {
          const source = map.current.getSource('issues') as mapboxgl.GeoJSONSource;
          source.setData(geoJsonData);
        } catch (error) {
          console.error("Error updating map source data:", error);
        }
      }
      
      // Update visible issue IDs with all filtered issues since clustering is disabled
      const allIssueIds = filteredIssues.map(issue => issue.id);
      setVisibleIssueIds(allIssueIds);
      
      if (onVisibleIssuesChange && isMountedRef.current) {
        onVisibleIssuesChange(allIssueIds);
      }
    } catch (error) {
      console.error("Error updating map source:", error);
    }
  }, [map, mapStyleLoaded, issues, center, categoryFilter, severityFilter, onVisibleIssuesChange]);

  const initializeMap = useCallback(() => {
    // Always cleanup any existing map first
    cleanupMap();
    
    // Check if the container is available and component is mounted
    if (!mapContainer.current || !isMountedRef.current) {
      console.error("Map container not found or component unmounted");
      return;
    }
    
    try {
      console.log("Initializing map with access token:", mapboxToken ? "Token exists" : "No token");
      
      // Set the Mapbox token before creating the map
      mapboxgl.accessToken = mapboxToken;
      
      // Create a new map instance
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: zoom,
        attributionControl: true,
        doubleClickZoom: true,
        dragRotate: false, // Disable rotation for simplicity
        touchZoomRotate: true,
        boxZoom: true,
      });
      
      // Store the map reference
      map.current = mapInstance;
  
      // Add navigation controls - ensure they work properly
      try {
        console.log("Adding navigation controls");
        const navControl = new mapboxgl.NavigationControl({
          visualizePitch: false, 
          showCompass: false,
          showZoom: true
        });
        
        mapInstance.addControl(navControl, "top-right");
      } catch (error) {
        console.error("Error adding navigation controls:", error);
      }
      
      // Handle style loading
      mapInstance.on("style.load", () => {
        if (!mapInstance || mapInstance !== map.current || !isMountedRef.current) {
          return;
        }
        
        console.log("Map style loaded successfully");
        setMapStyleLoaded(true);
        
        try {
          // Setup non-clustering source
          if (!mapInstance.getSource('issues')) {
            console.log("Adding issues source");
            
            mapInstance.addSource('issues', {
              type: 'geojson',
              data: issuesToGeoJSON([]), // Start with empty data
              cluster: false, // Disable clustering
            });
            
            // Add unclustered points with zero radius - we'll use custom markers instead
            mapInstance.addLayer({
              id: 'unclustered-point',
              type: 'circle',
              source: 'issues',
              paint: {
                'circle-radius': 0,
                'circle-opacity': 0
              }
            });
          }
          
          // Change cursor on hover
          mapInstance.on('mouseenter', 'unclustered-point', () => {
            if (mapInstance && isMountedRef.current) {
              mapInstance.getCanvas().style.cursor = 'pointer';
            }
          });
          
          mapInstance.on('mouseleave', 'unclustered-point', () => {
            if (mapInstance && isMountedRef.current) {
              mapInstance.getCanvas().style.cursor = '';
            }
          });
          
          // When map is moved, update visible issues
          mapInstance.on('moveend', () => {
            if (!mapInstance || !isMountedRef.current) return;
            
            try {
              // Update visible issues based on current view
              const filteredIssues = filterIssues(issues, center, categoryFilter, severityFilter);
              const visibleIds = filteredIssues.map(issue => issue.id);
              setVisibleIssueIds(visibleIds);
              
              if (onVisibleIssuesChange) {
                onVisibleIssuesChange(visibleIds);
              }
            } catch (error) {
              console.error("Error updating visible issues after map move:", error);
            }
          });
          
          // After style is fully loaded, update with data
          updateMapSource();
        } catch (error) {
          console.error("Error setting up map layers:", error);
        }
      });
      
      // Handle map errors
      mapInstance.on('error', (e) => {
        console.error("Mapbox error:", e);
      });
      
      // Update zoom controls to ensure they work
      mapInstance.scrollZoom.enable();
      mapInstance.boxZoom.enable();
      mapInstance.doubleClickZoom.enable();
      mapInstance.touchZoomRotate.enable();
      
    } catch (error) {
      console.error("Error initializing map:", error);
      if (isMountedRef.current) {
        toast({
          title: "Map Error",
          description: "Could not initialize the map. Please check your connection.",
          variant: "destructive",
        });
      }
    }
  }, [center, zoom, mapboxToken, toast, cleanupMap, updateMapSource, onVisibleIssuesChange, issues, categoryFilter, severityFilter]);

  // Make sure the map is properly cleaned up when the component unmounts
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      console.log("Cleaning up map on unmount");
      isMountedRef.current = false;
      cleanupMap();
    };
  }, [cleanupMap]);

  return {
    mapContainer,
    map,
    mapStyleLoaded,
    visibleIssueIds,
    setVisibleIssueIds,
    initializeMap,
    updateMapSource,
    cleanupMap
  };
}

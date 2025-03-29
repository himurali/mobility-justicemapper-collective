
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
  const [clusterClicked, setClusterClicked] = useState(false);
  const [visibleIssueIds, setVisibleIssueIds] = useState<string[]>([]);
  const { toast } = useToast();
  const mapboxToken = "pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ";
  const isMountedRef = useRef(true);
  
  // Safe map removal function to prevent errors
  const cleanupMap = useCallback(() => {
    if (!map.current) return;
    
    try {
      // First check if the map is actually initialized and has methods
      if (map.current && typeof map.current.remove === 'function') {
        // Try to remove the map properly
        map.current.remove();
      }
    } catch (error) {
      console.error("Error removing map:", error);
    } finally {
      // Always ensure we clear the reference
      map.current = null;
      setMapStyleLoaded(false);
    }
  }, []);

  // Define updateMapSource function before it's used in initializeMap
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
      
      if (!clusterClicked && onVisibleIssuesChange && isMountedRef.current) {
        onVisibleIssuesChange([]);
      }
    } catch (error) {
      console.error("Error updating map source:", error);
    }
  }, [map, mapStyleLoaded, issues, center, categoryFilter, severityFilter, clusterClicked, onVisibleIssuesChange]);

  const initializeMap = useCallback(() => {
    // Always cleanup any existing map first
    cleanupMap();
    
    // Check if the container is available and component is mounted
    if (!mapContainer.current || !isMountedRef.current) {
      console.error("Map container not found or component unmounted");
      return;
    }
    
    try {
      // Set the Mapbox token before creating the map
      mapboxgl.accessToken = mapboxToken;
      
      // Create a new map instance
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: zoom,
        // Ensure we don't try to initialize a map if the DOM isn't fully loaded
        failIfMajorPerformanceCaveat: true,
      });
      
      // Store the map reference
      map.current = mapInstance;
  
      // Add navigation controls - fix for scaling/zooming
      try {
        const navControl = new mapboxgl.NavigationControl({
          visualizePitch: true,
          showCompass: true,
          showZoom: true
        });
        
        mapInstance.addControl(navControl, "top-right");
        
        // Ensure navigation controls are properly initialized
        const controlContainer = mapContainer.current?.querySelector('.mapboxgl-ctrl-top-right');
        if (controlContainer) {
          controlContainer.classList.add('z-10');
        }
      } catch (error) {
        console.error("Error adding navigation controls:", error);
      }
      
      // Handle style loading
      mapInstance.on("style.load", () => {
        if (!mapInstance || mapInstance !== map.current || !isMountedRef.current) {
          // If the map instance has changed or been removed, don't continue
          return;
        }
        
        console.log("Map style loaded successfully");
        setMapStyleLoaded(true);
        
        try {
          // Setup cluster source and layers
          if (!mapInstance.getSource('issues')) {
            mapInstance.addSource('issues', {
              type: 'geojson',
              data: issuesToGeoJSON([]), // Start with empty data
              cluster: true,
              clusterMaxZoom: 14,
              clusterRadius: 50
            });
            
            // Improved cluster styling with larger, more visible markers
            mapInstance.addLayer({
              id: 'clusters',
              type: 'circle',
              source: 'issues',
              filter: ['has', 'point_count'],
              paint: {
                'circle-color': [
                  'step',
                  ['get', 'point_count'],
                  '#51bbd6',
                  10, '#f1f075',
                  20, '#f28cb1'
                ],
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  25,  // Increased size for better visibility
                  10, 35,
                  20, 45
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff'
              }
            });
            
            // Improved cluster count text
            mapInstance.addLayer({
              id: 'cluster-count',
              type: 'symbol',
              source: 'issues',
              filter: ['has', 'point_count'],
              layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 14 // Larger text size
              },
              paint: {
                'text-color': '#ffffff'
              }
            });
            
            // Hide unclustered points initially - we'll show markers instead
            mapInstance.addLayer({
              id: 'unclustered-point',
              type: 'circle',
              source: 'issues',
              filter: ['!', ['has', 'point_count']],
              paint: {
                'circle-radius': 0,  // Set to 0 to hide these points
                'circle-opacity': 0  // Make them invisible
              }
            });
          }
          
          // Handle cluster click - improved to ensure proper zooming
          mapInstance.on('click', 'clusters', (e) => {
            if (!mapInstance || mapInstance !== map.current || !isMountedRef.current) return;
            
            // Get features under the mouse
            const features = mapInstance.queryRenderedFeatures(e.point, {
              layers: ['clusters']
            });
            
            if (!features.length) return;
            
            try {
              // Set cluster clicked state
              setClusterClicked(true);
              
              // Get cluster id
              const clusterId = features[0].properties?.cluster_id;
              
              if (clusterId) {
                const source = mapInstance.getSource('issues') as mapboxgl.GeoJSONSource;
                
                // Get the cluster expansion zoom level
                source.getClusterExpansionZoom(clusterId, (err, expansionZoom) => {
                  if (err) {
                    console.error("Error getting cluster expansion zoom:", err);
                    return;
                  }
                  
                  if (!mapInstance || !features[0].geometry) return;
                  
                  // Get coordinates of the cluster
                  const coordinates = (features[0].geometry as any).coordinates.slice();
                  
                  // Animate to the cluster with slightly higher zoom than the expansion zoom
                  mapInstance.easeTo({
                    center: coordinates,
                    zoom: Math.min(expansionZoom + 0.5, 16), // Add 0.5 to zoom a bit more, capped at 16
                    duration: 500,
                    essential: true
                  });
                  
                  // After animation completes, update visible issues
                  setTimeout(() => {
                    if (!mapInstance || mapInstance !== map.current || !isMountedRef.current) return;
                    
                    try {
                      const newVisibleFeatures = mapInstance.queryRenderedFeatures({
                        layers: ['unclustered-point']
                      });
                      
                      const newVisibleIds = newVisibleFeatures
                        .filter(f => f.properties && f.properties.id)
                        .map(f => f.properties!.id as string);
                      
                      setVisibleIssueIds(newVisibleIds);
                      
                      if (onVisibleIssuesChange && isMountedRef.current) {
                        onVisibleIssuesChange(newVisibleIds);
                      }
                    } catch (error) {
                      console.error("Error updating visible features:", error);
                    }
                  }, 600); // Wait for animation to complete
                });
              }
            } catch (error) {
              console.error("Error handling cluster click:", error);
            }
          });
          
          // Handle cursor styling for better UX
          mapInstance.on('mouseenter', 'clusters', () => {
            if (mapInstance === map.current && isMountedRef.current) {
              mapInstance.getCanvas().style.cursor = 'pointer';
            }
          });
          
          mapInstance.on('mouseleave', 'clusters', () => {
            if (mapInstance === map.current && isMountedRef.current) {
              mapInstance.getCanvas().style.cursor = '';
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
  }, [center, zoom, mapboxToken, toast, cleanupMap, updateMapSource, onVisibleIssuesChange]);

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
    clusterClicked,
    visibleIssueIds,
    setClusterClicked,
    setVisibleIssueIds,
    initializeMap,
    updateMapSource,
    cleanupMap
  };
}

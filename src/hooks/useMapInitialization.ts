
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

  const initializeMap = useCallback(() => {
    // Always cleanup any existing map first
    cleanupMap();
    
    // Check if the container is available
    if (!mapContainer.current) {
      console.error("Map container not found");
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
  
      // Add navigation controls
      mapInstance.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
      );
      
      // Handle style loading
      mapInstance.on("style.load", () => {
        if (!mapInstance || mapInstance !== map.current) {
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
                  20,
                  10, 30,
                  20, 40
                ]
              }
            });
            
            mapInstance.addLayer({
              id: 'cluster-count',
              type: 'symbol',
              source: 'issues',
              filter: ['has', 'point_count'],
              layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
              },
              paint: {
                'text-color': '#ffffff'
              }
            });
            
            // Add unclustered point layer
            mapInstance.addLayer({
              id: 'unclustered-point',
              type: 'circle',
              source: 'issues',
              filter: ['!', ['has', 'point_count']],
              paint: {
                'circle-color': '#11b4da',
                'circle-radius': 8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
              }
            });
          }
          
          // Handle cluster click
          mapInstance.on('click', 'clusters', (e) => {
            if (!mapInstance || mapInstance !== map.current) return;
            
            setClusterClicked(true);
            
            const features = mapInstance.queryRenderedFeatures(e.point, {
              layers: ['clusters']
            });
            
            if (features.length > 0 && features[0].properties) {
              const clusterId = features[0].properties.cluster_id;
              
              if (clusterId) {
                try {
                  const source = mapInstance.getSource('issues') as mapboxgl.GeoJSONSource;
                  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err || !mapInstance || mapInstance !== map.current) return;
                    
                    try {
                      const coordinates = (features[0].geometry as any).coordinates.slice();
                      mapInstance.easeTo({
                        center: coordinates,
                        zoom: zoom
                      });
                      
                      setTimeout(() => {
                        if (!mapInstance || mapInstance !== map.current) return;
                        
                        try {
                          const newVisibleFeatures = mapInstance.queryRenderedFeatures({
                            layers: ['unclustered-point']
                          });
                          
                          const newVisibleIds = newVisibleFeatures
                            .filter(f => f.properties && f.properties.id)
                            .map(f => f.properties!.id as string);
                          
                          setVisibleIssueIds(newVisibleIds);
                          
                          if (onVisibleIssuesChange) {
                            onVisibleIssuesChange(newVisibleIds);
                          }
                        } catch (error) {
                          console.error("Error updating visible features:", error);
                        }
                      }, 500);
                    } catch (error) {
                      console.error("Error handling cluster expansion:", error);
                    }
                  });
                } catch (error) {
                  console.error("Error accessing cluster source:", error);
                }
              }
            }
          });
          
          // Handle cursor styling for better UX
          mapInstance.on('mouseenter', 'clusters', () => {
            if (mapInstance === map.current) {
              mapInstance.getCanvas().style.cursor = 'pointer';
            }
          });
          
          mapInstance.on('mouseleave', 'clusters', () => {
            if (mapInstance === map.current) {
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
      toast({
        title: "Map Error",
        description: "Could not initialize the map. Please check your connection.",
        variant: "destructive",
      });
    }
  }, [center, zoom, mapboxToken, toast, updateMapSource]);

  const updateMapSource = useCallback(() => {
    if (!map.current || !mapStyleLoaded) return;

    try {
      const filteredIssues = filterIssues(issues, center, categoryFilter, severityFilter);
      const geoJsonData = issuesToGeoJSON(filteredIssues);
      
      if (map.current.getSource('issues')) {
        const source = map.current.getSource('issues') as mapboxgl.GeoJSONSource;
        source.setData(geoJsonData);
      }
      
      if (!clusterClicked && onVisibleIssuesChange) {
        onVisibleIssuesChange([]);
      }
    } catch (error) {
      console.error("Error updating map source:", error);
    }
  }, [map, mapStyleLoaded, issues, center, categoryFilter, severityFilter, clusterClicked, onVisibleIssuesChange]);

  // Make sure the map is properly cleaned up when the component unmounts
  useEffect(() => {
    return () => {
      console.log("Cleaning up map on unmount");
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

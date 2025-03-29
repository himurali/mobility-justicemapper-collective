
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
          // Setup cluster source and layers
          if (!mapInstance.getSource('issues')) {
            console.log("Adding issues source and layers");
            
            mapInstance.addSource('issues', {
              type: 'geojson',
              data: issuesToGeoJSON([]), // Start with empty data
              cluster: true,
              clusterMaxZoom: 14,
              clusterRadius: 50
            });
            
            // Add clusters layer
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
                  25,
                  10, 35,
                  20, 45
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff'
              }
            });
            
            // Add cluster count text layer
            mapInstance.addLayer({
              id: 'cluster-count',
              type: 'symbol',
              source: 'issues',
              filter: ['has', 'point_count'],
              layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 14
              },
              paint: {
                'text-color': '#ffffff'
              }
            });
            
            // Only add unclustered points with zero radius - we'll use custom markers instead
            mapInstance.addLayer({
              id: 'unclustered-point',
              type: 'circle',
              source: 'issues',
              filter: ['!', ['has', 'point_count']],
              paint: {
                'circle-radius': 0,
                'circle-opacity': 0
              }
            });
          }
          
          // Handle cluster click with proper zoom and data handling
          mapInstance.on('click', 'clusters', (e) => {
            if (!mapInstance || mapInstance !== map.current || !isMountedRef.current) return;
            
            try {
              const features = mapInstance.queryRenderedFeatures(e.point, {
                layers: ['clusters']
              });
              
              if (!features.length) return;
              
              console.log("Cluster clicked:", features[0].properties);
              setClusterClicked(true);
              
              // Get cluster id and coordinates
              const clusterId = features[0].properties?.cluster_id;
              const coordinates = (features[0].geometry as any).coordinates.slice();
              
              if (clusterId) {
                const source = mapInstance.getSource('issues') as mapboxgl.GeoJSONSource;
                
                source.getClusterExpansionZoom(clusterId, (err, expansionZoom) => {
                  if (err) {
                    console.error("Error getting cluster expansion zoom:", err);
                    return;
                  }
                  
                  console.log("Expanding cluster to zoom level:", expansionZoom);
                  
                  // Fly to cluster position with appropriate zoom level
                  mapInstance.flyTo({
                    center: coordinates,
                    zoom: expansionZoom + 0.5, // Add slight zoom for better visibility
                    duration: 500,
                    essential: true
                  });
                  
                  // After animation, get the visible points and update state
                  setTimeout(() => {
                    if (!mapInstance || !isMountedRef.current) return;
                    
                    try {
                      // Get all features in the view
                      const points = mapInstance.querySourceFeatures('issues', {
                        sourceLayer: '',
                        filter: ['!', ['has', 'point_count']] // Only get individual points, not clusters
                      });
                      
                      // Extract IDs of visible issues
                      const pointIds = points
                        .filter(p => p.properties && p.properties.id)
                        .map(p => p.properties!.id as string);
                      
                      console.log(`Found ${pointIds.length} visible issues after cluster expansion`);
                      
                      // Update visible issue IDs
                      setVisibleIssueIds(pointIds);
                      
                      if (onVisibleIssuesChange) {
                        onVisibleIssuesChange(pointIds);
                      }
                    } catch (error) {
                      console.error("Error getting visible issues after cluster expansion:", error);
                    }
                  }, 600);
                });
              }
            } catch (error) {
              console.error("Error handling cluster click:", error);
            }
          });
          
          // Change cursor on cluster hover
          mapInstance.on('mouseenter', 'clusters', () => {
            if (mapInstance && isMountedRef.current) {
              mapInstance.getCanvas().style.cursor = 'pointer';
              console.log("Cursor changed to pointer on cluster hover");
            }
          });
          
          mapInstance.on('mouseleave', 'clusters', () => {
            if (mapInstance && isMountedRef.current) {
              mapInstance.getCanvas().style.cursor = '';
            }
          });
          
          // When map is moved, update visible issues
          mapInstance.on('moveend', () => {
            if (!mapInstance || !isMountedRef.current) return;
            
            if (clusterClicked) {
              try {
                // If a cluster was clicked, update visible issues based on current view
                const points = mapInstance.querySourceFeatures('issues', {
                  sourceLayer: '',
                  filter: ['!', ['has', 'point_count']]
                });
                
                const pointIds = points
                  .filter(p => p.properties && p.properties.id)
                  .map(p => p.properties!.id as string);
                
                if (pointIds.length > 0) {
                  console.log(`Found ${pointIds.length} visible issues after map move`);
                  setVisibleIssueIds(pointIds);
                  
                  if (onVisibleIssuesChange) {
                    onVisibleIssuesChange(pointIds);
                  }
                }
              } catch (error) {
                console.error("Error updating visible issues after map move:", error);
              }
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

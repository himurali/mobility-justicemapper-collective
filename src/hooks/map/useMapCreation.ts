
import { useCallback, MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from "@/components/ui/use-toast";
import { issuesToGeoJSON } from '@/utils/mapUtils';

interface UseMapCreationProps {
  mapContainer: MutableRefObject<HTMLDivElement | null>;
  map: MutableRefObject<mapboxgl.Map | null>;
  center: [number, number];
  zoom: number;
  isMountedRef: MutableRefObject<boolean>;
  setMapStyleLoaded: (loaded: boolean) => void;
  updateMapSource: () => void;
}

/**
 * Hook to handle map initialization and creation
 */
export function useMapCreation({
  mapContainer,
  map,
  center,
  zoom,
  isMountedRef,
  setMapStyleLoaded,
  updateMapSource
}: UseMapCreationProps) {
  const { toast } = useToast();
  const mapboxToken = "pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ";

  const initializeMap = useCallback(() => {
    // Check if the container is available and component is mounted
    if (!mapContainer.current || !isMountedRef.current) {
      console.error("Map container not found or component unmounted");
      return;
    }
    
    try {
      // Set the Mapbox token before creating the map
      mapboxgl.accessToken = mapboxToken;
      
      // Create a new map instance with enhanced zoom and scroll settings
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: zoom,
        minZoom: 3,  // Minimum zoom level
        maxZoom: 18, // Maximum zoom level
        attributionControl: true,
        doubleClickZoom: true,
        scrollZoom: {
          around: 'center'  // Zoom around the center of the map
        },
        dragRotate: false,
        touchZoomRotate: true,
        boxZoom: true,
      });
      
      // Store the map reference
      map.current = mapInstance;
  
      // Add navigation controls with zoom functionality
      const navControl = new mapboxgl.NavigationControl({
        visualizePitch: false, 
        showCompass: false,
        showZoom: true
      });
      
      mapInstance.addControl(navControl, "top-right");
      
      // Enhanced scroll zoom with smoother scaling
      mapInstance.scrollZoom.enable({
        around: 'center'
      });
      
      // Handle style loading
      mapInstance.on("style.load", () => {
        if (!mapInstance || mapInstance !== map.current || !isMountedRef.current) {
          return;
        }
        
        setMapStyleLoaded(true);
        
        try {
          // Setup non-clustering source
          if (!mapInstance.getSource('issues')) {
            mapInstance.addSource('issues', {
              type: 'geojson',
              data: issuesToGeoJSON([]), // Start with empty data
              cluster: false,
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
  }, [center, zoom, mapboxToken, mapContainer, map, isMountedRef, setMapStyleLoaded, updateMapSource, toast]);

  return { initializeMap };
}

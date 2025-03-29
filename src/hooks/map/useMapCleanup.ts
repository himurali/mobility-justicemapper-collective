
import { useCallback, MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';

/**
 * Hook that provides functionality to safely clean up a Mapbox map instance
 */
export function useMapCleanup(
  map: MutableRefObject<mapboxgl.Map | null>,
  setMapStyleLoaded: (loaded: boolean) => void
) {
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
  }, [map, setMapStyleLoaded]);

  return { cleanupMap };
}

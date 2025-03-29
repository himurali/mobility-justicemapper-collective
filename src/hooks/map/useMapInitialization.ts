
import { useState, useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { IssueData } from "@/types";
import { useMapCleanup } from './useMapCleanup';
import { useMapSource } from './useMapSource';
import { useMapCreation } from './useMapCreation';

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
  const isMountedRef = useRef(true);
  
  // Get map cleanup functionality
  const { cleanupMap } = useMapCleanup(map, setMapStyleLoaded);

  // Get map source update functionality
  const { updateMapSource } = useMapSource({
    map,
    mapStyleLoaded,
    issues,
    center,
    categoryFilter,
    severityFilter,
    isMountedRef,
    setVisibleIssueIds,
    onVisibleIssuesChange
  });
  
  // Get map creation functionality
  const { initializeMap } = useMapCreation({
    mapContainer,
    map,
    center,
    zoom,
    isMountedRef,
    setMapStyleLoaded,
    updateMapSource
  });

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

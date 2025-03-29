
import { useCallback, MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { IssueData } from "@/types";
import { issuesToGeoJSON, filterIssues } from '@/utils/mapUtils';

interface UseMapSourceProps {
  map: MutableRefObject<mapboxgl.Map | null>;
  mapStyleLoaded: boolean;
  issues: IssueData[];
  center: [number, number];
  categoryFilter: string;
  severityFilter: string;
  isMountedRef: MutableRefObject<boolean>;
  setVisibleIssueIds: (ids: string[]) => void;
  onVisibleIssuesChange?: (issueIds: string[]) => void;
}

/**
 * Hook to handle map data source management and updates
 */
export function useMapSource({
  map,
  mapStyleLoaded,
  issues,
  center,
  categoryFilter,
  severityFilter,
  isMountedRef,
  setVisibleIssueIds,
  onVisibleIssuesChange
}: UseMapSourceProps) {
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
      
      // Update visible issue IDs with all filtered issues
      const allIssueIds = filteredIssues.map(issue => issue.id);
      setVisibleIssueIds(allIssueIds);
      
      if (onVisibleIssuesChange && isMountedRef.current) {
        onVisibleIssuesChange(allIssueIds);
      }
    } catch (error) {
      console.error("Error updating map source:", error);
    }
  }, [map, mapStyleLoaded, issues, center, categoryFilter, severityFilter, isMountedRef, setVisibleIssueIds, onVisibleIssuesChange]);

  return { updateMapSource };
}

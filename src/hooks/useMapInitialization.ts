
import { useState, useRef, useEffect } from 'react';
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

  const initializeMap = () => {
    if (map.current) return;
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: zoom,
      });
  
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
      );
      
      map.current.on("style.load", () => {
        if (!map.current) return;
        setMapStyleLoaded(true);
        
        // Setup cluster source and layers
        map.current.addSource('issues', {
          type: 'geojson',
          data: issuesToGeoJSON([]), // Start with empty data
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });
        
        map.current.addLayer({
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
        
        map.current.addLayer({
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
        map.current.addLayer({
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
        
        // Handle cluster click
        map.current.on('click', 'clusters', (e) => {
          if (!map.current) return;
          setClusterClicked(true);
          
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          
          if (features.length > 0 && features[0].properties) {
            const clusterId = features[0].properties.cluster_id;
            
            if (clusterId) {
              const source = map.current.getSource('issues') as mapboxgl.GeoJSONSource;
              source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err || !map.current) return;
                
                const coordinates = (features[0].geometry as any).coordinates.slice();
                map.current.easeTo({
                  center: coordinates,
                  zoom: zoom
                });
                
                setTimeout(() => {
                  if (!map.current || !mapStyleLoaded) return;
                  
                  try {
                    const newVisibleFeatures = map.current.queryRenderedFeatures({
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
              });
            }
          }
        });
        
        // Handle cursor styling for better UX
        map.current.on('mouseenter', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
        
        // After style is fully loaded, update with data
        updateMapSource();
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "Could not initialize the map. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const updateMapSource = () => {
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
  };

  return {
    mapContainer,
    map,
    mapStyleLoaded,
    clusterClicked,
    visibleIssueIds,
    setClusterClicked,
    setVisibleIssueIds,
    initializeMap,
    updateMapSource
  };
}

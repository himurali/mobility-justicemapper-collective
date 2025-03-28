
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
          data: {
            type: 'FeatureCollection',
            features: []
          },
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
        
        // Handle cluster click
        map.current.on('click', 'clusters', (e) => {
          if (!map.current) return;
          setClusterClicked(true);
          
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          
          if (features.length > 0) {
            const clusterId = features[0].properties?.cluster_id;
            
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
                    const newVisibleFeatures = map.current.querySourceFeatures('issues', {
                      sourceLayer: '',
                      filter: ['!', ['has', 'point_count']]
                    });
                    
                    const newVisibleIds = newVisibleFeatures
                      .map(f => f.properties?.id)
                      .filter(Boolean);
                    
                    setVisibleIssueIds(newVisibleIds);
                    
                    if (onVisibleIssuesChange) {
                      onVisibleIssuesChange(newVisibleIds);
                    }
                  } catch (error) {
                    console.error("Error updating visible features:", error);
                  }
                }, 300);
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
        
        // Update map with initial data
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

    const filteredIssues = filterIssues(issues, center, categoryFilter, severityFilter);
    
    if (map.current.getSource('issues')) {
      const source = map.current.getSource('issues') as mapboxgl.GeoJSONSource;
      source.setData(issuesToGeoJSON(filteredIssues));

      if (!clusterClicked) {
        if (onVisibleIssuesChange) {
          onVisibleIssuesChange([]);
        }
      }
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

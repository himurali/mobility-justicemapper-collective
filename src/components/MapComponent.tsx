import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IssueCategory, IssueData } from "@/types";
import { mockIssues } from "@/data/issueData";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import IssueDetail from "@/components/IssueDetail";

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  selectedIssue?: string;
  categoryFilter?: IssueCategory | "all";
  severityFilter?: string;
  onSelectIssue?: (issueId: string) => void;
  selectedTab?: string;
  onVisibleIssuesChange?: (issueIds: string[]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [77.5946, 12.9716],
  zoom = 12,
  selectedIssue,
  categoryFilter = "all",
  severityFilter = "all",
  onSelectIssue,
  selectedTab = "video",
  onVisibleIssuesChange,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const markerElementsRef = useRef<{ [key: string]: HTMLElement }>({});
  const blinkIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueData, setSelectedIssueData] = useState<IssueData | null>(null);
  const [activeTab, setActiveTab] = useState(selectedTab);
  const [clusters, setClusters] = useState<any[]>([]);
  const [points, setPoints] = useState<any[]>([]);
  const [visibleIssueIds, setVisibleIssueIds] = useState<string[]>([]);
  const [mapStyleLoaded, setMapStyleLoaded] = useState(false);
  const [clusterClicked, setClusterClicked] = useState(false);
  
  const mapboxToken = "pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ";

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "pedestrian_infrastructure":
        return "#ef4444"; // red
      case "cyclist_facilities":
        return "#10b981"; // green
      case "public_bus_transport":
      case "public_metro":
        return "#3b82f6"; // blue
      case "high_risk_intersections":
        return "#f59e0b"; // amber
      case "accessibility_issues":
        return "#8b5cf6"; // purple
      case "traffic_signal_compliance":
        return "#ec4899"; // pink
      case "green_spaces":
        return "#22c55e"; // green
      case "pollution_hotspots":
        return "#64748b"; // slate
      default:
        return "#64748b"; // default slate
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "#ef4444"; // red
      case "moderate":
        return "#f59e0b"; // amber
      case "minor":
        return "#22c55e"; // green
      default:
        return "#64748b"; // slate
    }
  };

  const stopBlinking = () => {
    if (blinkIntervalRef.current) {
      window.clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }

    Object.entries(markerElementsRef.current).forEach(([issueId, element]) => {
      const issue = mockIssues.find(i => i.id === issueId);
      if (!issue) return;
      
      const mainCategory = issue.tags[0] || "other";
      const isSelected = issueId === selectedIssue;
      
      const scale = isSelected ? 'scale-150' : '';
      const borderWidth = isSelected ? 'border-3' : 'border-2';
      
      if (element) {
        element.innerHTML = `
          <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md ${borderWidth} ${scale} transition-transform duration-300" 
               style="border-color: ${getCategoryColor(mainCategory)}">
            <div class="w-3 h-3 rounded-full" 
                 style="background-color: ${getSeverityColor(issue.severity)}"></div>
          </div>
        `;
      }
    });
  };

  const startBlinking = (issueId: string) => {
    if (!markerElementsRef.current[issueId]) return;
    
    const issue = mockIssues.find(i => i.id === issueId);
    if (!issue) return;
    
    const mainCategory = issue.tags[0] || "other";
    const color = getCategoryColor(mainCategory);
    const severityColor = getSeverityColor(issue.severity);
    let isLarge = true;
    
    blinkIntervalRef.current = window.setInterval(() => {
      if (!markerElementsRef.current[issueId]) return;
      
      isLarge = !isLarge;
      const scale = isLarge ? 'scale-150' : 'scale-125';
      const glow = isLarge ? `box-shadow: 0 0 10px ${color}, 0 0 20px ${color}` : '';
      
      markerElementsRef.current[issueId].innerHTML = `
        <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border-3 ${scale} transition-transform duration-300" 
             style="border-color: ${color}; ${glow}">
          <div class="w-3 h-3 rounded-full" 
               style="background-color: ${severityColor}"></div>
        </div>
      `;
    }, 500);
  };

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
                    
                    addMarkers();
                  } catch (error) {
                    console.error("Error updating visible features:", error);
                  }
                }, 300);
              });
            }
          }
        });
        
        map.current.on('mouseenter', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('mouseleave', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
        
        addMarkers();
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

  const addMarkers = () => {
    if (!map.current || !mapStyleLoaded) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    markerElementsRef.current = {};

    const filteredIssues = mockIssues.filter(issue => {
      if (issue.city.toLowerCase() !== center[1].toString()) {
        const cityMatch = issue.city.toLowerCase() === "bangalore";
        if (!cityMatch) return false;
      }
      
      if (categoryFilter !== "all") {
        const categoryMatch = issue.tags.some(tag => tag === categoryFilter);
        if (!categoryMatch) return false;
      }
      
      if (severityFilter !== "all" && issue.severity !== severityFilter) {
        return false;
      }
        
      return true;
    });

    if (map.current.getSource('issues')) {
      const features = filteredIssues.map(issue => ({
        type: 'Feature' as const,
        properties: {
          id: issue.id,
          title: issue.title,
          severity: issue.severity,
          category: issue.tags[0] || 'other'
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [issue.location.longitude, issue.location.latitude]
        }
      }));
      
      const source = map.current.getSource('issues') as mapboxgl.GeoJSONSource;
      source.setData({
        type: 'FeatureCollection',
        features
      });

      if (!clusterClicked) {
        if (onVisibleIssuesChange) {
          onVisibleIssuesChange([]);
        }
      }
    }
    
    filteredIssues.forEach(issue => {
      const shouldBeVisible = 
        issue.id === selectedIssue || 
        visibleIssueIds.includes(issue.id);
      
      if (!shouldBeVisible) return;
      
      const mainCategory = issue.tags[0] || "other";
      const isSelected = issue.id === selectedIssue;
      
      const markerElement = document.createElement("div");
      markerElement.className = "cursor-pointer";
      markerElement.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border-2 ${isSelected ? 'scale-150' : ''} transition-transform duration-300" 
             style="border-color: ${getCategoryColor(mainCategory)}">
          <div class="w-3 h-3 rounded-full" 
               style="background-color: ${getSeverityColor(issue.severity)}"></div>
        </div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([issue.location.longitude, issue.location.latitude])
        .addTo(map.current!);
      
      markerElement.addEventListener('click', () => {
        if (onSelectIssue) {
          onSelectIssue(issue.id);
        }
        
        setSelectedIssueData(issue);
        setIsDialogOpen(true);
      });

      markersRef.current[issue.id] = marker;
      markerElementsRef.current[issue.id] = markerElement;
    });

    if (selectedIssue && markersRef.current[selectedIssue]) {
      map.current.flyTo({
        center: markersRef.current[selectedIssue].getLngLat(),
        zoom: 15,
        essential: true
      });
      
      stopBlinking();
      startBlinking(selectedIssue);
    }
    
    if (clusterClicked && onSelectIssue && typeof onSelectIssue === 'function' && visibleIssueIds.length > 0) {
      const firstVisibleId = visibleIssueIds[0];
      if (firstVisibleId && !selectedIssue) {
        onSelectIssue(firstVisibleId);
      }
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      stopBlinking();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current && mapStyleLoaded) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true
      });
      
      setClusterClicked(false);
      setVisibleIssueIds([]);
      if (onVisibleIssuesChange) {
        onVisibleIssuesChange([]);
      }
      
      addMarkers();
    }
  }, [center, zoom, categoryFilter, severityFilter, mapStyleLoaded]);

  useEffect(() => {
    stopBlinking();
    
    if (selectedIssue) {
      startBlinking(selectedIssue);
    }
    
    return () => stopBlinking();
  }, [selectedIssue]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm" />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[90%] h-[80vh] max-h-[90vh] p-0">
          <IssueDetail 
            issue={selectedIssueData} 
            onClose={() => setIsDialogOpen(false)} 
            initialTab={activeTab}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapComponent;

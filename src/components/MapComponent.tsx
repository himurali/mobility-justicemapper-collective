import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapStyles.css"; // Import the custom CSS
import { IssueCategory, IssueData } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import IssueDetail from "@/components/IssueDetail";
import { supabase } from "@/integrations/supabase/client";

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  selectedIssue?: string;
  categoryFilter?: IssueCategory | "all";
  severityFilter?: string;
  onSelectIssue?: (issueId: string) => void;
  selectedTab?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [77.5946, 12.9716],
  zoom = 12,
  selectedIssue,
  categoryFilter = "all",
  severityFilter = "all",
  onSelectIssue,
  selectedTab = "video",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const markerElementsRef = useRef<{ [key: string]: HTMLElement }>({});
  const cachedIssuesRef = useRef<IssueData[]>([]);
  const blinkIntervalRef = useRef<number | null>(null);
  const mapInitializedRef = useRef<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueData, setSelectedIssueData] = useState<IssueData | null>(null);
  const [activeTab, setActiveTab] = useState(selectedTab);
  const [issues, setIssues] = useState<IssueData[]>([]);
  
  const mapboxToken = "pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ";

  useEffect(() => {
    const fetchIssues = async () => {
      console.log("Fetching issues from database...");
      
      const { data, error } = await supabase
        .from('JusticeIssue')
        .select(`
          *,
          issue_community_members (*),
          justice_champions (*),
          issue_documents (*)
        `);

      if (error) {
        console.error("Error fetching issues:", error);
        toast({
          title: "Error",
          description: "Failed to fetch issues. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        console.log("Raw data from database:", data);
        console.log(`Total number of issues fetched: ${data.length}`);
        
        const formattedData = data.map((issue: any) => {
          console.log(`Processing issue ID: ${issue.id}, Title: ${issue.issue_title}, City: ${issue.city}, Coordinates: [${issue.longitude_of_issue}, ${issue.latitude_of_issue}]`);
          
          return {
            id: String(issue.id),
            title: issue.issue_title || '',
            description: issue.issue_desc || '',
            solution: issue.solution_of_issue || '',
            videoUrl: issue.issue_video_problem_statement || '',
            city: issue.city || '',
            location: {
              latitude: issue.latitude_of_issue || 0,
              longitude: issue.longitude_of_issue || 0,
              address: issue.address || '',
            },
            communityMembers: issue.issue_community_members || [],
            documents: issue.issue_documents || [],
            tags: issue.tags || [],
            justiceChampion: issue.justice_champions && issue.justice_champions[0] 
              ? {
                  id: String(issue.justice_champions[0].id),
                  name: issue.justice_champions[0].name,
                  role: issue.justice_champions[0].role,
                  avatarUrl: issue.justice_champions[0].avatar_url || '',
                }
              : undefined,
            createdAt: issue.created_at,
            updatedAt: issue.created_at,
            upvotes: issue.upvotes || 0,
            downvotes: issue.downvotes || 0,
            severity: issue.severity || 'moderate',
          };
        });
        
        console.log("Formatted data:", formattedData);
        setIssues(formattedData);
        cachedIssuesRef.current = formattedData;
      }
    };

    fetchIssues();
  }, [toast]);

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    if (selectedIssue) {
      const issue = issues.find(i => i.id === selectedIssue);
      if (issue) {
        setSelectedIssueData(issue);
      }
    }
  }, [selectedIssue, issues]);

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "pedestrian_infrastructure":
        return "#ef4444";
      case "cyclist_facilities":
        return "#10b981";
      case "public_bus_transport":
      case "public_metro":
        return "#3b82f6";
      case "high_risk_intersections":
        return "#f59e0b";
      case "accessibility_issues":
        return "#8b5cf6";
      case "traffic_signal_compliance":
        return "#ec4899";
      case "green_spaces":
        return "#22c55e";
      case "pollution_hotspots":
        return "#64748b";
      default:
        return "#64748b";
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "critical":
        return "#ef4444";
      case "moderate":
        return "#f59e0b";
      case "minor":
        return "#22c55e";
      default:
        return "#64748b";
    }
  };

  const stopBlinking = () => {
    if (blinkIntervalRef.current) {
      window.clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
    }

    Object.entries(markerElementsRef.current).forEach(([issueId, element]) => {
      const issue = issues.find(i => i.id === issueId);
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
    
    const issue = issues.find(i => i.id === issueId);
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
    if (map.current || !mapContainer.current) return;
    
    try {
      console.log("Initializing map...");
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: zoom,
      });
  
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
      );
  
      map.current.on("load", () => {
        console.log("Map loaded successfully");
        mapInitializedRef.current = true;
        if (cachedIssuesRef.current.length > 0) {
          addMarkers();
        }
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

  const handleMarkerClick = (issue: IssueData) => {
    console.log(`Marker clicked: ${issue.id}, Title: ${issue.title}`);
    
    if (onSelectIssue) {
      onSelectIssue(issue.id);
    }
    
    setSelectedIssueData(issue);
    setIsDialogOpen(true);
  };

  const addMarkers = () => {
    if (!map.current || !mapInitializedRef.current) {
      console.log("Map not initialized yet, cannot add markers");
      return;
    }

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    markerElementsRef.current = {};

    console.log(`Adding markers for ${issues.length} issues`);
    console.log(`Category filter: ${categoryFilter}, Severity filter: ${severityFilter}`);

    const selectedCityName = center[0] === 77.5946 && center[1] === 12.9716 ? "Bangalore" : 
                            center[0] === 72.8777 && center[1] === 19.0760 ? "Mumbai" :
                            center[0] === 77.2090 && center[1] === 28.6139 ? "Delhi" :
                            center[0] === 80.2707 && center[1] === 13.0827 ? "Chennai" : "";
    
    console.log(`Selected city for filtering: ${selectedCityName}`);

    const filteredIssues = issues.filter(issue => {
      if (!issue.location.latitude || !issue.location.longitude) {
        console.warn(`Issue ${issue.id} has invalid coordinates`, issue.location);
        return false;
      }

      if (selectedCityName && issue.city) {
        const issueCity = issue.city.trim().toLowerCase();
        const selectedCity = selectedCityName.trim().toLowerCase();
        
        if (issueCity !== selectedCity && 
            issueCity !== selectedCity.charAt(0).toLowerCase() + selectedCity.slice(1)) {
          console.log(`Filtering out issue ${issue.id} due to city mismatch: '${issue.city}' vs '${selectedCityName}'`);
          return false;
        }
      }
      
      if (categoryFilter !== "all") {
        const categoryMatch = issue.tags.some(tag => tag === categoryFilter);
        if (!categoryMatch) {
          console.log(`Filtering out issue ${issue.id} due to category mismatch`);
          return false;
        }
      }
      
      if (severityFilter !== "all" && issue.severity !== severityFilter) {
        console.log(`Filtering out issue ${issue.id} due to severity mismatch`);
        return false;
      }
        
      return true;
    });

    console.log(`Filtered to ${filteredIssues.length} issues after applying all filters`);
    
    filteredIssues.forEach(issue => {
      console.log(`Issue in filtered list: ID=${issue.id}, Title=${issue.title}, City=${issue.city}, Coords=[${issue.location.longitude}, ${issue.location.latitude}]`);
    });

    filteredIssues.forEach(issue => {
      console.log(`Creating marker for issue: ${issue.id}, Title: ${issue.title}, Location: [${issue.location.longitude}, ${issue.location.latitude}]`);
      
      const mainCategory = issue.tags[0] || "other";
      const isSelected = issue.id === selectedIssue;
      
      const markerEl = document.createElement("div");
      markerEl.className = "marker-wrapper";
      markerEl.style.position = "relative";
      markerEl.style.zIndex = "100";
      markerEl.style.display = "block";
      markerEl.style.visibility = "visible";
      markerEl.style.opacity = "1";
      markerEl.style.pointerEvents = "auto";
      markerEl.style.cursor = "pointer";
      
      markerEl.style.width = "24px";
      markerEl.style.height = "24px";
      
      const categoryColor = getCategoryColor(mainCategory);
      const severityColor = getSeverityColor(issue.severity);
      
      markerEl.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border-2 ${isSelected ? 'scale-150' : ''}" 
             style="border-color: ${categoryColor}; z-index: 100; display: flex !important; position: relative; opacity: 1 !important; visibility: visible !important;">
          <div class="w-3 h-3 rounded-full" 
               style="background-color: ${severityColor}; display: block !important; opacity: 1 !important; visibility: visible !important;"></div>
        </div>
      `;

      document.body.appendChild(markerEl);
      document.body.removeChild(markerEl);
      
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'center',
      })
      .setLngLat([issue.location.longitude, issue.location.latitude])
      .addTo(map.current!);
      
      setTimeout(() => {
        if (marker.getElement()) {
          marker.getElement().style.display = 'block';
          marker.getElement().style.visibility = 'visible';
          marker.getElement().style.opacity = '1';
        }
      }, 100);
      
      markerEl.addEventListener('click', () => {
        handleMarkerClick(issue);
      });

      markersRef.current[issue.id] = marker;
      markerElementsRef.current[issue.id] = markerEl;
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
  };

  useEffect(() => {
    console.log("MapComponent mounted, initializing map");
    initializeMap();

    return () => {
      console.log("MapComponent unmounting, cleaning up");
      stopBlinking();
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapInitializedRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (map.current && mapInitializedRef.current) {
      console.log("Map updating with center:", center, "zoom:", zoom);
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true,
        duration: 1500
      });
      addMarkers();
    }
  }, [center, zoom, categoryFilter, severityFilter, selectedIssue, issues]);

  useEffect(() => {
    stopBlinking();
    
    if (selectedIssue && mapInitializedRef.current) {
      startBlinking(selectedIssue);
    }
    
    return () => stopBlinking();
  }, [selectedIssue]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <TooltipProvider>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm">
        {issues.map(issue => (
          <Tooltip key={issue.id}>
            <TooltipTrigger asChild>
              <div 
                className="marker-tooltip-trigger" 
                data-issue-id={issue.id}
              />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-bold">{issue.title}</p>
                <p className="text-muted-foreground">Severity: {issue.severity}</p>
                <p className="text-muted-foreground">Category: {issue.tags[0]}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[90%] h-[80vh] max-h-[90vh] p-0">
          {selectedIssueData && (
            <IssueDetail 
              issue={selectedIssueData} 
              onClose={handleDialogClose} 
              initialTab={activeTab}
            />
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default MapComponent;

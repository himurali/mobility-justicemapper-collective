
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IssueData, IssueCategory, IssueSeverity } from "@/types";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IssueDetail from "@/components/IssueDetail";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mapbox access token - users need to replace this with their own token
// or provide it via the UI
const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ';

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  selectedIssue?: string;
  issues: IssueData[];
  onSelectIssue?: (issueId: string) => void;
  selectedTab?: string;
  categoryFilter?: IssueCategory | 'all';
  severityFilter?: IssueSeverity | 'all';
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [77.5946, 12.9716],
  zoom = 12,
  selectedIssue,
  issues = [],
  onSelectIssue,
  selectedTab = "video",
  categoryFilter = 'all',
  severityFilter = 'all'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssueData, setSelectedIssueData] = useState<IssueData | null>(null);
  const [activeTab, setActiveTab] = useState(selectedTab);
  const [mapboxToken, setMapboxToken] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
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

      map.current.on('error', (e) => {
        console.error("Mapbox error:", e);
        if (e.error.message.includes('access token')) {
          setTokenError("Invalid Mapbox access token. Please provide a valid token.");
          setShowTokenInput(true);
        }
      });
    } catch (error: any) {
      console.error("Error initializing map:", error);
      if (error.message.includes('access token')) {
        setTokenError("A valid Mapbox access token is required");
        setShowTokenInput(true);
      }
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true,
        duration: 1500
      });
    }
  }, [center, zoom]);

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  const handleMarkerClick = (issue: IssueData) => {
    if (onSelectIssue) {
      onSelectIssue(issue.id);
    }
    setSelectedIssueData(issue);
    setIsDialogOpen(true);
  };

  // Filter issues based on category and severity filters
  const filteredIssues = issues.filter(issue => {
    if (categoryFilter !== 'all') {
      const categoryNormalized = categoryFilter.toLowerCase().replace(/[_\s-]/g, '');
      if (!issue.tags.some(tag => tag.toLowerCase().replace(/[_\s-]/g, '') === categoryNormalized)) {
        return false;
      }
    }

    if (severityFilter !== 'all') {
      if (issue.severity !== severityFilter) {
        return false;
      }
    }

    return true;
  });

  const { markersRef, markerElementsRef } = useMapMarkers({
    map: map.current,
    issues: filteredIssues,
    selectedIssue,
    onMarkerClick: handleMarkerClick,
  });

  const handleTokenChange = (newToken: string) => {
    setMapboxToken(newToken);
    localStorage.setItem('mapbox_token', newToken);
    setTokenError(null);
    // This will trigger the useEffect to recreate the map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  // Load token from localStorage if available
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="relative w-full h-full">
        {tokenError && showTokenInput && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 p-6">
            <div className="w-full max-w-md space-y-4 bg-card p-6 shadow-lg rounded-lg">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{tokenError}</AlertDescription>
              </Alert>
              <p className="text-sm">
                Please provide your Mapbox access token. You can get one by signing up at{" "}
                <a 
                  href="https://mapbox.com/signup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  mapbox.com
                </a>.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your Mapbox token"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                />
                <Button onClick={() => handleTokenChange(mapboxToken)}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm" />
        
        {filteredIssues.map(issue => (
          <Tooltip key={issue.id}>
            <TooltipTrigger asChild>
              <div className="marker-tooltip-trigger" data-issue-id={issue.id} />
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
              onClose={() => setIsDialogOpen(false)} 
              initialTab={activeTab}
            />
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default MapComponent;

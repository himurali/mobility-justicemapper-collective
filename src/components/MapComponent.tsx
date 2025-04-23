
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IssueData } from "@/types";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IssueDetail from "@/components/IssueDetail";
import { useMapMarkers } from "@/hooks/useMapMarkers";

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  selectedIssue?: string;
  issues: IssueData[];
  onSelectIssue?: (issueId: string) => void;
  selectedTab?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [77.5946, 12.9716],
  zoom = 12,
  selectedIssue,
  issues,
  onSelectIssue,
  selectedTab = "video",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedIssueData, setSelectedIssueData] = React.useState<IssueData | null>(null);
  const [activeTab, setActiveTab] = React.useState(selectedTab);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

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

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

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

  const { markersRef, markerElementsRef } = useMapMarkers({
    map: map.current,
    issues,
    selectedIssue,
    onMarkerClick: handleMarkerClick,
  });

  return (
    <TooltipProvider>
      <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm">
        {issues.map(issue => (
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

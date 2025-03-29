
import { IssueData } from "@/types";

// Returns the appropriate color for category styling
export const getCategoryColor = (category: string): string => {
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

// Returns the appropriate color for severity styling
export const getSeverityColor = (severity: string): string => {
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

// Converts issues to GeoJSON for Mapbox
export const issuesToGeoJSON = (issues: IssueData[]) => {
  return {
    type: 'FeatureCollection' as const,
    features: issues.map(issue => ({
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
    }))
  };
};

// Filters issues based on provided criteria
export const filterIssues = (
  issues: IssueData[],
  center: [number, number],
  categoryFilter: string,
  severityFilter: string
) => {
  return issues.filter(issue => {
    // For city comparison, check if the issue's city matches the current city
    // Most center[1] values are coordinates, not city names, so we need a special case for Bangalore
    const currentCity = center[1].toString();
    const cityName = issue.city.toLowerCase();
    
    if (currentCity !== cityName) {
      // Special case for Bangalore - its coordinates are frequently used
      const isBangalore = cityName === "bangalore" && 
                          (currentCity === "12.9716" || // Standard Bangalore latitude
                           Math.abs(parseFloat(currentCity) - 12.9716) < 0.1); // Close to Bangalore
      
      if (!isBangalore) return false;
    }
    
    // Category filter
    if (categoryFilter !== "all") {
      const categoryMatch = issue.tags.some(tag => tag === categoryFilter);
      if (!categoryMatch) return false;
    }
    
    // Severity filter
    if (severityFilter !== "all" && issue.severity !== severityFilter) {
      return false;
    }
      
    return true;
  });
};

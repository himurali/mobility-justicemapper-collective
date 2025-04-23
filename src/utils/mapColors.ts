
export const getCategoryColor = (category: string): string => {
  const formattedCategory = category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const colorMap: { [key: string]: string } = {
    "Cycling": "#10b981",
    "Safety": "#ef4444",
    "Infrastructure": "#3b82f6",
    "Intersection": "#f59e0b",
    "Accessibility": "#8b5cf6",
    "Sidewalks": "#6366f1",
    "Public Transit": "#ec4899",
    "pedestrian_infrastructure": "#ef4444",
    "cyclist_facilities": "#10b981",
    "public_bus_transport": "#3b82f6",
    "public_metro": "#3b82f6",
    "high_risk_intersections": "#f59e0b",
    "accessibility_issues": "#8b5cf6",
    "traffic_signal_compliance": "#ec4899",
    "green_spaces": "#22c55e",
    "pollution_hotspots": "#64748b"
  };

  return colorMap[formattedCategory] || colorMap[category] || "#64748b";
};

export const getSeverityColor = (severity: string): string => {
  const severityColors: { [key: string]: string } = {
    critical: "#ef4444",
    moderate: "#f59e0b",
    minor: "#22c55e"
  };
  return severityColors[severity] || "#64748b";
};

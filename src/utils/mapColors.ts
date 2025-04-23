
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
    "Public Bus Transport": "#3b82f6",
    "Public Metro": "#3b82f6",
    "Pedestrian Infrastructure": "#ef4444",
    "Cyclist Facilities": "#10b981",
    "High Risk Intersections": "#f59e0b",
    "Accessibility Issues": "#8b5cf6",
    "Traffic Signal Compliance": "#ec4899",
    "Green Spaces": "#22c55e",
    "Pollution Hotspots": "#64748b",
    // Also map the non-formatted versions
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

// Export category colors for use in badges and other UI elements
export const tagColors: { [key: string]: string } = {
  "Cycling": "bg-[#10b981]",
  "Safety": "bg-[#ef4444]",
  "Infrastructure": "bg-[#3b82f6]",
  "Intersection": "bg-[#f59e0b]",
  "Accessibility": "bg-[#8b5cf6]",
  "Sidewalks": "bg-[#6366f1]",
  "Public Transit": "bg-[#ec4899]",
  "Public Bus Transport": "bg-[#3b82f6]",
  "Public Metro": "bg-[#3b82f6]",
  "Pedestrian Infrastructure": "bg-[#ef4444]",
  "Cyclist Facilities": "bg-[#10b981]",
  "High Risk Intersections": "bg-[#f59e0b]",
  "Accessibility Issues": "bg-[#8b5cf6]",
  "Traffic Signal Compliance": "bg-[#ec4899]",
  "Green Spaces": "bg-[#22c55e]",
  "Pollution Hotspots": "bg-[#64748b]"
};

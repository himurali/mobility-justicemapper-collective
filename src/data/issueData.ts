
export const mobilityCategories = [
  {
    id: "pedestrian_infrastructure",
    name: "🚶 Pedestrian Infrastructure",
    subcategories: [
      { id: "sidewalk_condition", name: "🧱 Sidewalk Condition" },
      { id: "crosswalk_availability", name: "🦓 Crosswalk Availability" },
      { id: "pedestrian_signals", name: "🚦 Pedestrian Signals" },
      { id: "ada_compliance", name: "♿ ADA Compliance" },
    ],
  },
  {
    id: "cyclist_facilities",
    name: "🚴 Cyclist Facilities",
    subcategories: [
      { id: "bike_lanes", name: "🛣️ Bike Lanes" },
      { id: "bike_racks", name: "🅿️ Bike Racks" },
      { id: "bike_paths", name: "🛤️ Bike Paths" },
      { id: "bike_sharing", name: "🚲 Bike Sharing" },
    ],
  },
  {
    id: "public_bus_transport",
    name: "🚌 Public Bus Transport",
    subcategories: [
      { id: "bus_stop_accessibility", name: "♿ Bus Stop Accessibility" },
      { id: "bus_frequency", name: "⏱️ Bus Frequency" },
      { id: "bus_shelters", name: "🚏 Bus Shelters" },
      { id: "real_time_info", name: "ℹ️ Real-Time Info" },
    ],
  },
  {
    id: "public_metro",
    name: "🚇 Public Metro",
    subcategories: [
      { id: "station_accessibility", name: "♿ Station Accessibility" },
      { id: "metro_frequency", name: "⏱️ Metro Frequency" },
      { id: "platform_safety", name: "⚠️ Platform Safety" },
      { id: "last_mile_connectivity", name: "🔗 Last Mile Connectivity" },
    ],
  },
  {
    id: "high_risk_intersections",
    name: "🚧 High-Risk Intersections",
    subcategories: [
      { id: "visibility_issues", name: "👁️ Visibility Issues" },
      { id: "collision_history", name: "💥 Collision History" },
      { id: "signal_timing", name: "⏱️ Signal Timing" },
      { id: "pedestrian_islands", name: "🏝️ Pedestrian Islands" },
    ],
  },
  {
    id: "accessibility_issues",
    name: "♿ Accessibility Issues",
    subcategories: [
      { id: "ramp_availability", name: "🛤️ Ramp Availability" },
      { id: "elevator_access", name: "Elevator Access" },
      { id: "tactile_paving", name: "Tactile Paving" },
      { id: "audio_signals", name: "Audio Signals" },
    ],
  },
  {
    id: "traffic_signal_compliance",
    name: "🚦 Traffic Signal Compliance",
    subcategories: [
      { id: "red_light_running", name: "🛑 Red Light Running" },
      { id: "pedestrian_signal_timing", name: "⏱️ Pedestrian Signal Timing" },
      { id: "crosswalk_enforcement", name: "👮 Crosswalk Enforcement" },
      { id: "turning_vehicles", name: "🚗 Turning Vehicles" },
    ],
  },
  {
    id: "green_spaces",
    name: "🌳 Green Spaces",
    subcategories: [
      { id: "park_access", name: "🏞️ Park Access" },
      { id: "walkability", name: "🚶 Walkability" },
      { id: "shade_availability", name: "⛱️ Shade Availability" },
      { id: "seating_areas", name: "💺 Seating Areas" },
    ],
  },
  {
    id: "pollution_hotspots",
    name: "💨 Pollution Hotspots",
    subcategories: [
      { id: "air_quality", name: "🌬️ Air Quality" },
      { id: "noise_pollution", name: "🔈 Noise Pollution" },
      { id: "vehicular_emissions", name: "🚗 Vehicular Emissions" },
      { id: "industrial_sources", name: "🏭 Industrial Sources" },
    ],
  },
];

// Create an empty array for mockIssues - it's no longer used but still imported
export const mockIssues: any[] = [];

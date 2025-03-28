
import React, { useState } from "react";
import MapComponent from "@/components/MapComponent";
import { IssueCategory, IssueSeverity, City } from "@/types";
import { cities } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin,
  Filter
} from "lucide-react";
import CitySelector from "@/components/CitySelector";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]); // Default to first city
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all');

  return (
    <div className="flex flex-col h-screen">
      {/* Header will be added using layout pattern in a future update */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-sidebar border-r p-4 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-primary">Mobility Justice</h1>
          <p className="text-sm text-sidebar-foreground">
            Report and discover urban mobility issues in your community
          </p>
          
          <div className="border-t border-sidebar-border my-4"></div>
          
          {/* City Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin size={16} />
              Select City
            </label>
            <CitySelector 
              cities={cities} 
              selectedCity={selectedCity} 
              onSelectCity={setSelectedCity} 
            />
          </div>
          
          {/* Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Filter size={16} />
              Filters
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs text-sidebar-foreground">Category</label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as IssueCategory | 'all')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="cycling">Cycling</SelectItem>
                  <SelectItem value="sidewalks">Sidewalks</SelectItem>
                  <SelectItem value="accessibility">Accessibility</SelectItem>
                  <SelectItem value="public_transport">Public Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-sidebar-foreground">Severity</label>
              <Select
                value={severityFilter}
                onValueChange={(value) => setSeverityFilter(value as IssueSeverity | 'all')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border-t border-sidebar-border my-4"></div>
          
          {/* Actions */}
          <button className="w-full bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
            Report New Issue
          </button>
        </div>
        
        {/* Map Area */}
        <div className="flex-1 relative">
          <MapComponent 
            center={[selectedCity.coordinates[0], selectedCity.coordinates[1]]}
            zoom={selectedCity.zoom}
            categoryFilter={categoryFilter}
            severityFilter={severityFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

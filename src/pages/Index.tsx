import React, { useState, useMemo, useEffect, useRef } from "react";
import MapComponent from "@/components/MapComponent";
import { IssueCategory, IssueSeverity, City } from "@/types";
import { mockIssues } from "@/data/issueData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin,
  Filter,
  Search
} from "lucide-react";
import CitySelector from "@/components/CitySelector";
import IssueCard from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IssueDetail from "@/components/IssueDetail";
import { IssueData } from "@/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NavTabs from "@/components/NavTabs";

// Define the Bangalore city data
const bangaloreCity: City = {
  id: "bangalore",
  name: "Bangalore",
  coordinates: [77.5946, 12.9716],
  zoom: 12,
};

// Create a cities array with Bangalore as the first city
const cityOptions: City[] = [
  bangaloreCity,
  {
    id: "delhi",
    name: "Delhi",
    coordinates: [77.2090, 28.6139],
    zoom: 11,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    coordinates: [72.8777, 19.0760],
    zoom: 12,
  },
  {
    id: "chennai",
    name: "Chennai",
    coordinates: [80.2707, 13.0827],
    zoom: 12,
  },
];

// All possible tags for filtering
const allTags = [
  "safety", 
  "traffic", 
  "cycling", 
  "sidewalks", 
  "accessibility", 
  "public_transport",
  "infrastructure",
  "pedestrian",
  "urban_design",
  "maintenance",
  "commuting"
];

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City>(bangaloreCity); // Default to Bangalore
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);
  const selectedIssueRef = useRef<HTMLDivElement>(null);

  // Filter issues based on selected city, category, severity, tags, and search query
  const filteredIssues = useMemo(() => {
    return mockIssues.filter(issue => {
      // Filter by city
      if (issue.city.toLowerCase() !== selectedCity.name.toLowerCase()) {
        return false;
      }

      // Filter by category if not "all"
      if (categoryFilter !== 'all') {
        if (!issue.tags.includes(categoryFilter)) {
          return false;
        }
      }

      // Filter by severity if not "all"
      if (severityFilter !== 'all') {
        if (!issue.tags.includes(severityFilter)) {
          return false;
        }
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(tag => 
          issue.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          issue.title.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedCity, categoryFilter, severityFilter, selectedTags, searchQuery]);

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle issue card click
  const handleIssueClick = (issue: IssueData) => {
    setSelectedIssue(issue);
    setIsDialogOpen(true);
  };

  // Handle issue selection from map
  const handleSelectIssue = (issueId: string) => {
    const issue = mockIssues.find(i => i.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
    }
  };

  // Scroll selected issue into view when it changes
  useEffect(() => {
    if (selectedIssue && selectedIssueRef.current) {
      // Find the element with the issue ID
      const issueElement = document.getElementById(`issue-card-${selectedIssue.id}`);
      if (issueElement) {
        issueElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedIssue]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero section */}
      <Hero
        cities={cityOptions}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />
      
      {/* Navigation tabs */}
      <div className="container mx-auto px-4 md:px-6 mt-4 mb-6">
        <NavTabs />
      </div>

      <div className="container mx-auto px-4 md:px-6 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col md:flex-row h-full">
          {/* Left Sidebar */}
          <div className="w-full md:w-96 bg-sidebar border-r p-4 flex flex-col h-[600px] md:h-auto overflow-hidden">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                  className="text-sm rounded-full h-auto py-1"
                  onClick={() => toggleTag(tag)}
                >
                  {tag.replace('_', ' ')}
                </Button>
              ))}
            </div>
            
            {/* Issue Cards */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2" ref={selectedIssueRef}>
              {filteredIssues.length > 0 ? (
                filteredIssues.map(issue => (
                  <div 
                    key={issue.id} 
                    id={`issue-card-${issue.id}`}
                  >
                    <IssueCard
                      issue={issue}
                      onClick={() => handleIssueClick(issue)}
                      isSelected={selectedIssue?.id === issue.id}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No issues found matching your filters
                </div>
              )}
            </div>
          </div>
          
          {/* Map Area */}
          <div className="flex-1 relative h-[400px] md:h-auto">
            <MapComponent 
              center={[selectedCity.coordinates[0], selectedCity.coordinates[1]]}
              zoom={selectedCity.zoom}
              categoryFilter={categoryFilter}
              severityFilter={severityFilter}
              selectedIssue={selectedIssue?.id}
              onSelectIssue={handleSelectIssue}
            />
          </div>
        </div>
      </div>
      
      {/* Issue Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[90%] h-[80vh] max-h-[90vh] p-0">
          {selectedIssue && (
            <IssueDetail 
              issue={selectedIssue} 
              onClose={() => setIsDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

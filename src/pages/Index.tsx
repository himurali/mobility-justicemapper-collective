
import React, { useState, useMemo, useEffect, useRef } from "react";
import MapComponent from "@/components/MapComponent";
import { IssueCategory, IssueSeverity, City } from "@/types";
import { mockIssues } from "@/data/issueData";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CitySelector from "@/components/CitySelector";
import IssueCard from "@/components/IssueCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IssueDetail from "@/components/IssueDetail";
import { IssueData } from "@/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { useLocation } from "react-router-dom";
import FilterBar from "@/components/FilterBar";
import { useToast } from "@/components/ui/use-toast";

const bangaloreCity: City = {
  id: "bangalore",
  name: "Bangalore",
  coordinates: [77.5946, 12.9716],
  zoom: 12,
};

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

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City>(bangaloreCity);
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);
  const [activeDialogTab, setActiveDialogTab] = useState<string>("video");
  const [showMap, setShowMap] = useState(true);
  const [sortBy, setSortBy] = useState<'most_critical' | 'most_recent' | 'most_upvoted'>('most_recent');
  const [issues, setIssues] = useState<IssueData[]>(mockIssues);
  
  const selectedIssueRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { toast } = useToast();

  const filteredIssues = useMemo(() => {
    let filtered = issues.filter(issue => {
      if (issue.city.toLowerCase() !== selectedCity.name.toLowerCase()) {
        return false;
      }

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

      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some(selectedTag => {
          const normalizedSelectedTag = selectedTag.toLowerCase().replace(/[_\s-]/g, '');
          return issue.tags.some(tag => 
            tag.toLowerCase().replace(/[_\s-]/g, '') === normalizedSelectedTag
          );
        });
        if (!hasMatchingTag) {
          return false;
        }
      }

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          issue.title.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Sort the filtered issues
    return filtered.sort((a, b) => {
      if (sortBy === 'most_critical') {
        const severityOrder = { 'critical': 0, 'moderate': 1, 'minor': 2 };
        return severityOrder[a.severity as IssueSeverity] - severityOrder[b.severity as IssueSeverity];
      } else if (sortBy === 'most_recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else { // most_upvoted
        return b.upvotes - a.upvotes;
      }
    });
  }, [selectedCity, categoryFilter, severityFilter, selectedTags, searchQuery, issues, sortBy]);

  const handleIssueClick = (issue: IssueData) => {
    setSelectedIssue(issue);
    setIsDialogOpen(true);
  };

  const handleSelectIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
    }
  };

  const handleTabSelect = (tab?: string) => {
    if (tab) {
      setActiveDialogTab(tab);
      
      if (selectedIssue) {
        setIsDialogOpen(true);
      } else if (filteredIssues.length > 0) {
        setSelectedIssue(filteredIssues[0]);
        setIsDialogOpen(true);
      }
    }
  };

  const handleUpvote = (id: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    ));
    toast({
      title: "Upvoted",
      description: "Thank you for your feedback!",
      duration: 2000,
    });
  };

  const handleDownvote = (id: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, downvotes: issue.downvotes + 1 } : issue
    ));
    toast({
      title: "Downvoted",
      description: "Thank you for your feedback!",
      duration: 2000,
    });
  };

  const toggleMapVisibility = () => {
    setShowMap(prev => !prev);
  };

  useEffect(() => {
    if (selectedIssue && selectedIssueRef.current) {
      const issueElement = document.getElementById(`issue-card-${selectedIssue.id}`);
      if (issueElement) {
        issueElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedIssue]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero
        cities={cityOptions}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />
      <div className="container mx-auto px-4 md:px-6 flex-1 flex flex-col">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <FilterBar 
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          issueCount={filteredIssues.length}
          showMap={showMap}
          toggleMap={toggleMapVisibility}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        <div className="flex-1 flex flex-col md:flex-row h-full">
          <div className="w-full md:w-96 bg-sidebar border-r p-4 flex flex-col h-[600px] md:h-auto overflow-hidden">
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
                      onUpvote={handleUpvote}
                      onDownvote={handleDownvote}
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
          {showMap && (
            <div className="flex-1 relative h-[400px] md:h-auto">
              <MapComponent 
                center={[selectedCity.coordinates[0], selectedCity.coordinates[1]]}
                zoom={selectedCity.zoom}
                categoryFilter={categoryFilter}
                severityFilter={severityFilter}
                selectedIssue={selectedIssue?.id}
                onSelectIssue={handleSelectIssue}
                selectedTab={activeDialogTab}
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[90%] h-[80vh] max-h-[90vh] p-0">
          {selectedIssue && (
            <IssueDetail 
              issue={selectedIssue} 
              onClose={() => setIsDialogOpen(false)} 
              initialTab={activeDialogTab}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

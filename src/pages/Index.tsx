
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
import CustomFilter from "@/components/CustomFilter";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  const [showCustomFilter, setShowCustomFilter] = useState(false);
  const [visibleIssueIds, setVisibleIssueIds] = useState<string[]>([]);
  
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

    // If we have visible issue IDs from the map (from expanded clusters),
    // filter to only show those issues in the sidebar
    if (visibleIssueIds.length > 0) {
      filtered = filtered.filter(issue => visibleIssueIds.includes(issue.id));
    }

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
  }, [selectedCity, categoryFilter, severityFilter, selectedTags, searchQuery, issues, sortBy, visibleIssueIds]);

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

  // This function will be called from the MapComponent when clusters are clicked
  // and will update the visible issue IDs to sync with what's shown on the map
  const handleMapIssuesUpdate = (issueId: string) => {
    handleSelectIssue(issueId);
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
    <div className="flex flex-col h-screen">
      <Header />
      <Hero
        cities={cityOptions}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />
      <div className="container mx-auto px-4 md:px-0 flex-1 flex flex-col">
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
          onShowCustomFilter={() => setShowCustomFilter(true)}
        />
        
        <div className="flex-1 h-[calc(100vh-13rem)]">
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full overflow-y-auto bg-sidebar" ref={selectedIssueRef}>
                <div className="grid grid-cols-2 gap-2 p-2">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => (
                      <div 
                        key={issue.id} 
                        id={`issue-card-${issue.id}`}
                        className="col-span-1"
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
                    <div className="text-center py-8 text-muted-foreground col-span-2">
                      No issues found matching your filters
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50} minSize={30}>
              {showMap && (
                <div className="h-full">
                  <MapComponent 
                    center={[selectedCity.coordinates[0], selectedCity.coordinates[1]]}
                    zoom={selectedCity.zoom}
                    categoryFilter={categoryFilter}
                    severityFilter={severityFilter}
                    selectedIssue={selectedIssue?.id}
                    onSelectIssue={handleMapIssuesUpdate}
                    selectedTab={activeDialogTab}
                  />
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
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
      
      <CustomFilter
        open={showCustomFilter}
        onClose={() => setShowCustomFilter(false)}
        selectedCity={selectedCity}
        cityOptions={cityOptions}
        onSelectCity={setSelectedCity}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
      />
    </div>
  );
};

export default Index;

import React, { useState, useMemo, useEffect, useRef } from "react";
import MapComponent from "@/components/MapComponent";
import { IssueCategory, IssueSeverity, City } from "@/types";
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
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

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
  const [issues, setIssues] = useState<IssueData[]>([]);
  const [showCustomFilter, setShowCustomFilter] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(selectedCity.coordinates);
  const [mapZoom, setMapZoom] = useState<number>(selectedCity.zoom);
  
  const selectedIssueRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { toast } = useToast();

  const { data: fetchedIssues, isLoading } = useQuery({
    queryKey: ['issues', selectedCity.name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('JusticeIssue')
        .select(`
          *,
          issue_community_members (*),
          justice_champions (*),
          issue_documents (*)
        `)
        .eq('city', selectedCity.name);

      if (error) throw error;
      
      return data.map((issue: Tables<'JusticeIssue'> & {
        issue_community_members: Tables<'issue_community_members'>[],
        justice_champions: Tables<'justice_champions'>[],
        issue_documents: Tables<'issue_documents'>[],
      }) => ({
        id: String(issue.id),
        title: issue.issue_title || '',
        description: issue.issue_desc || '',
        solution: issue.solution_of_issue || '',
        videoUrl: issue.issue_video_problem_statement || '',
        city: issue.city || '',
        location: {
          latitude: issue.latitude_of_issue || 0,
          longitude: issue.longitude_of_issue || 0,
          address: issue.address || '',
        },
        communityMembers: issue.issue_community_members.map(member => ({
          id: String(member.id),
          name: member.name,
          role: member.role || '',
          avatarUrl: member.avatar_url || '',
        })),
        documents: issue.issue_documents.map(doc => ({
          name: doc.name,
          url: doc.url,
          type: doc.type || '',
        })),
        tags: issue.tags || [],
        justiceChampion: issue.justice_champions[0] ? {
          id: String(issue.justice_champions[0].id),
          name: issue.justice_champions[0].name,
          role: issue.justice_champions[0].role || '',
          avatarUrl: issue.justice_champions[0].avatar_url || '',
        } : undefined,
        createdAt: issue.created_at,
        updatedAt: issue.created_at,
        upvotes: issue.upvotes || 0,
        downvotes: issue.downvotes || 0,
        severity: issue.severity || 'moderate',
      }));
    },
  });

  useEffect(() => {
    if (fetchedIssues) {
      setIssues(fetchedIssues);
    }
  }, [fetchedIssues]);

  useEffect(() => {
    setMapCenter(selectedCity.coordinates);
    setMapZoom(selectedCity.zoom);
    
    setSelectedIssue(null);
  }, [selectedCity]);

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
    
    setMapCenter([issue.location.longitude, issue.location.latitude]);
    setMapZoom(15);
  };

  const handleSelectIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
      
      setMapCenter([issue.location.longitude, issue.location.latitude]);
      setMapZoom(15);
    }
  };

  const handleCitySelect = (city: City) => {
    console.log("Selected city:", city.name);
    setSelectedCity(city);
    toast({
      title: `Viewing ${city.name}`,
      description: `Showing mobility issues in ${city.name}`,
      duration: 2000,
    });
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

  const handleUpvote = async (id: string) => {
    const issueToUpdate = issues.find(i => i.id === id);
    if (!issueToUpdate) return;
    
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.error("Invalid issue ID:", id);
      return;
    }

    const { error } = await supabase
      .from('JusticeIssue')
      .update({ upvotes: issueToUpdate.upvotes + 1 })
      .eq('id', numericId);

    if (!error) {
      setIssues(prev => prev.map(issue => 
        issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      ));
      toast({
        title: "Upvoted",
        description: "Thank you for your feedback!",
        duration: 2000,
      });
    } else {
      console.error("Error upvoting:", error);
    }
  };

  const handleDownvote = async (id: string) => {
    const issueToUpdate = issues.find(i => i.id === id);
    if (!issueToUpdate) return;
    
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.error("Invalid issue ID:", id);
      return;
    }

    const { error } = await supabase
      .from('JusticeIssue')
      .update({ downvotes: issueToUpdate.downvotes + 1 })
      .eq('id', numericId);

    if (!error) {
      setIssues(prev => prev.map(issue => 
        issue.id === id ? { ...issue, downvotes: issue.downvotes + 1 } : issue
      ));
      toast({
        title: "Downvoted",
        description: "Thank you for your feedback!",
        duration: 2000,
      });
    } else {
      console.error("Error downvoting:", error);
    }
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
        onSelectCity={handleCitySelect}
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
                    center={mapCenter}
                    zoom={mapZoom}
                    categoryFilter={categoryFilter}
                    severityFilter={severityFilter}
                    selectedIssue={selectedIssue?.id}
                    onSelectIssue={handleSelectIssue}
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
        onSelectCity={handleCitySelect}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
      />
    </div>
  );
};

export default Index;

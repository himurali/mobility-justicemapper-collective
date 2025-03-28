
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapIcon, FilterIcon, SlidersHorizontal } from "lucide-react";
import { mobilityCategories } from "@/data/issueData";
import { IssueCategory, IssueSeverity } from "@/types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  categoryFilter: IssueCategory | 'all';
  setCategoryFilter: (category: IssueCategory | 'all') => void;
  severityFilter: IssueSeverity | 'all';
  setSeverityFilter: (severity: IssueSeverity | 'all') => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  issueCount: number;
  showMap: boolean;
  toggleMap: () => void;
  sortBy: 'most_critical' | 'most_recent' | 'most_upvoted';
  setSortBy: (sort: 'most_critical' | 'most_recent' | 'most_upvoted') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  categoryFilter,
  setCategoryFilter,
  severityFilter,
  setSeverityFilter,
  selectedTags,
  setSelectedTags,
  issueCount,
  showMap,
  toggleMap,
  sortBy,
  setSortBy
}) => {
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCategorySelect = (category: IssueCategory | 'all') => {
    setCategoryFilter(category);
  };

  const handleSeveritySelect = (severity: IssueSeverity | 'all') => {
    setSeverityFilter(severity);
  };

  const handleClearFilters = () => {
    setCategoryFilter('all');
    setSeverityFilter('all');
    setSelectedTags([]);
  };

  // Count active filters
  const activeFilterCount = (categoryFilter !== 'all' ? 1 : 0) + 
                           (severityFilter !== 'all' ? 1 : 0) + 
                           selectedTags.length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 mt-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-2">{issueCount} issues found</h2>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80" onClick={handleClearFilters}>
              {activeFilterCount} filters
              <span className="ml-1">×</span>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {sortBy === 'most_critical' ? 'Most Critical' : 
                 sortBy === 'most_recent' ? 'Most Recent' : 'Most Upvoted'}
                <SlidersHorizontal className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSortBy('most_critical')} className={sortBy === 'most_critical' ? 'bg-accent' : ''}>
                  Most Critical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('most_recent')} className={sortBy === 'most_recent' ? 'bg-accent' : ''}>
                  Most Recent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('most_upvoted')} className={sortBy === 'most_upvoted' ? 'bg-accent' : ''}>
                  Most Upvoted
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleMap}
            className={cn("h-8", showMap ? "bg-primary text-primary-foreground hover:bg-primary/90" : "")}
          >
            <MapIcon className="h-4 w-4 mr-1" />
            Map
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <FilterIcon className="h-4 w-4 mr-1" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <div className="px-2 py-1.5 text-sm font-semibold">Severity</div>
                <DropdownMenuItem onClick={() => handleSeveritySelect('all')} className={severityFilter === 'all' ? 'bg-accent' : ''}>
                  All Severities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSeveritySelect('critical')} className={severityFilter === 'critical' ? 'bg-accent' : ''}>
                  Critical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSeveritySelect('moderate')} className={severityFilter === 'moderate' ? 'bg-accent' : ''}>
                  Moderate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSeveritySelect('minor')} className={severityFilter === 'minor' ? 'bg-accent' : ''}>
                  Minor
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {mobilityCategories.map(category => (
                <DropdownMenuGroup key={category.id}>
                  <div className="px-2 py-1.5 text-sm font-semibold">{category.name}</div>
                  {category.subcategories.map(subcat => (
                    <DropdownMenuItem 
                      key={subcat.id} 
                      onClick={() => handleTagSelect(subcat.id)}
                      className={selectedTags.includes(subcat.id) ? 'bg-accent' : ''}
                    >
                      {subcat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {categoryFilter !== 'all' && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer" onClick={() => setCategoryFilter('all')}>
              {categoryFilter.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              <span className="ml-1">×</span>
            </Badge>
          )}
          
          {severityFilter !== 'all' && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer" onClick={() => setSeverityFilter('all')}>
              {severityFilter.charAt(0).toUpperCase() + severityFilter.slice(1)}
              <span className="ml-1">×</span>
            </Badge>
          )}
          
          {selectedTags.map(tag => {
            // Find the subcategory to get its name with emoji
            let displayName = tag;
            for (const category of mobilityCategories) {
              const subcategory = category.subcategories.find(sub => sub.id === tag);
              if (subcategory) {
                displayName = subcategory.name;
                break;
              }
            }
            
            return (
              <Badge 
                key={tag} 
                className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                onClick={() => handleTagSelect(tag)}
              >
                {displayName}
                <span className="ml-1">×</span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterBar;

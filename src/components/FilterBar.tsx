import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Settings, Search, Tag } from "lucide-react";
import { mobilityCategories } from "@/data/issueData";
import { IssueCategory, IssueSeverity } from "@/types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  categoryFilter: IssueCategory | 'all';
  setCategoryFilter: (category: IssueCategory | 'all') => void;
  severityFilter: IssueSeverity | 'all';
  setSeverityFilter: (severity: IssueSeverity | 'all') => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  issueCount: number;
  sortBy: 'most_critical' | 'most_recent' | 'most_upvoted';
  setSortBy: (sort: 'most_critical' | 'most_recent' | 'most_upvoted') => void;
  onShowCustomFilter?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  categoryFilter,
  setCategoryFilter,
  severityFilter,
  setSeverityFilter,
  selectedTags,
  setSelectedTags,
  issueCount,
  sortBy,
  setSortBy,
  onShowCustomFilter
}) => {
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  
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

  const activeFilterCount = (categoryFilter !== 'all' ? 1 : 0) + 
                           (severityFilter !== 'all' ? 1 : 0) + 
                           selectedTags.length;
                           
  const getAllTags = () => {
    let allTags: {id: string, name: string, category: string}[] = [];
    
    mobilityCategories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        allTags.push({
          id: subcategory.id,
          name: subcategory.name,
          category: category.name
        });
      });
    });
    
    return allTags.sort((a, b) => a.name.localeCompare(b.name));
  };
  
  const getFilteredTags = () => {
    const allTags = getAllTags();
    if (!tagSearchQuery) return allTags;
    
    return allTags.filter(tag => 
      tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()) ||
      tag.category.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  };

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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Tag className="h-4 w-4 mr-1" />
                Tags
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <div className="p-2">
                <Input
                  placeholder="Search tags..."
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  className="mb-2"
                />
              </div>
              
              <DropdownMenuSeparator />
              
              <div className="max-h-80 overflow-y-auto">
                {getFilteredTags().map(tag => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <DropdownMenuItem
                      key={tag.id}
                      className={cn(
                        "flex items-center justify-between",
                        isSelected && "bg-accent"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTagSelect(tag.id);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{tag.name.split(' ')[0]}</span>
                        <span>{tag.name.split(' ').slice(1).join(' ')}</span>
                      </div>
                      {isSelected && <Badge variant="secondary">Selected</Badge>}
                    </DropdownMenuItem>
                  );
                })}
                
                {getFilteredTags().length === 0 && (
                  <div className="text-center py-2 text-muted-foreground">
                    No tags found
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onShowCustomFilter}
          >
            <Settings className="h-4 w-4 mr-1" />
            Filters
          </Button>
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
                className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer truncate max-w-[120px]"
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


import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { City, IssueCategory, IssueSeverity } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, X, AlertTriangle, Home, Building, Building2, ParkingCircle, Leaf, GraduationCap, User, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { mobilityCategories } from "@/data/issueData";

interface CustomFilterProps {
  open: boolean;
  onClose: () => void;
  selectedCity: City;
  cityOptions: City[];
  onSelectCity: (city: City) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  severityFilter: IssueSeverity | 'all';
  onSeverityChange: (severity: IssueSeverity | 'all') => void;
}

const CustomFilter: React.FC<CustomFilterProps> = ({
  open,
  onClose,
  selectedCity,
  cityOptions,
  onSelectCity,
  selectedTags,
  onTagsChange,
  severityFilter,
  onSeverityChange
}) => {
  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(t => t !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleClearAll = () => {
    onTagsChange([]);
    onSeverityChange('all');
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'pedestrian_infrastructure':
        return <User className="h-4 w-4" />;
      case 'cyclist_facilities':
        return <ParkingCircle className="h-4 w-4" />;
      case 'public_bus_transport':
      case 'public_metro':
        return <Building className="h-4 w-4" />;
      case 'accessibility_issues':
        return <Building2 className="h-4 w-4" />;
      case 'green_spaces':
        return <Leaf className="h-4 w-4" />; 
      case 'urban_education':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <Gem className="h-4 w-4" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>Custom Filter</SheetTitle>
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear all
            </Button>
          </div>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Severity Filter */}
          <div className="filter-section">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-lg font-medium">Severity</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full"
                onClick={() => onSeverityChange('all')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <RadioGroup 
              value={severityFilter} 
              onValueChange={(value) => onSeverityChange(value as IssueSeverity | 'all')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-muted rounded-md p-2">
                <RadioGroupItem value="all" id="severity-all" />
                <Label htmlFor="severity-all" className="cursor-pointer">All Severities</Label>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-muted rounded-md p-2">
                <RadioGroupItem value="critical" id="severity-critical" />
                <Label htmlFor="severity-critical" className="cursor-pointer">Critical</Label>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-muted rounded-md p-2">
                <RadioGroupItem value="moderate" id="severity-moderate" />
                <Label htmlFor="severity-moderate" className="cursor-pointer">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-muted rounded-md p-2">
                <RadioGroupItem value="minor" id="severity-minor" />
                <Label htmlFor="severity-minor" className="cursor-pointer">Minor</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Category Types */}
          <div className="filter-section">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                <h3 className="text-lg font-medium">Issue Categories</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full"
                onClick={() => onTagsChange([])}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {mobilityCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground">{category.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.subcategories.map((subcat) => (
                      <div 
                        key={subcat.id} 
                        className={cn(
                          "flex items-center space-x-2 cursor-pointer hover:bg-muted rounded-md p-2",
                          selectedTags.includes(subcat.id) && "bg-muted"
                        )}
                        onClick={() => handleTagToggle(subcat.id)}
                      >
                        <div className={cn(
                          "h-5 w-5 rounded border flex items-center justify-center",
                          selectedTags.includes(subcat.id) 
                            ? "bg-primary border-primary text-white" 
                            : "border-gray-300"
                        )}>
                          {selectedTags.includes(subcat.id) && <Check className="h-3 w-3" />}
                        </div>
                        <Label className="cursor-pointer text-sm">{subcat.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Amenities style badge selection - for popular filters */}
          <div className="filter-section">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Gem className="h-5 w-5" />
                <h3 className="text-lg font-medium">Popular Filters</h3>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {mobilityCategories.slice(0, 3).map((category) => (
                category.subcategories.slice(0, 1).map((subcat) => (
                  <Badge
                    key={subcat.id}
                    variant={selectedTags.includes(subcat.id) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-2 text-sm",
                      selectedTags.includes(subcat.id) 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-background hover:bg-muted"
                    )}
                    onClick={() => handleTagToggle(subcat.id)}
                  >
                    {getCategoryIcon(category.id)}
                    <span className="ml-1">{subcat.name.split(' ')[0]}</span>
                  </Badge>
                ))
              ))}
            </div>
          </div>
        </div>
        
        <SheetFooter>
          <Button onClick={onClose} className="w-full">Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CustomFilter;


import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ThumbsUp, ThumbsDown, AlertTriangle, Clock } from "lucide-react";
import type { IssueData } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mobilityCategories } from "@/data/issueData";

interface IssueCardProps {
  issue: IssueData;
  onClick?: () => void;
  isSelected?: boolean;
  onUpvote?: (id: string) => void;
  onDownvote?: (id: string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ 
  issue, 
  onClick, 
  isSelected = false,
  onUpvote,
  onDownvote
}) => {
  // Get the first 2 tags to display
  const visibleTags = issue.tags.slice(0, 2);
  const hasMoreTags = issue.tags.length > 2;
  
  const getCategoryEmoji = (tag: string) => {
    // Find the category that contains this tag
    for (const category of mobilityCategories) {
      const subcategory = category.subcategories.find(sub => sub.id === tag);
      if (subcategory) {
        return subcategory.name.split(' ')[0]; // Return the emoji part
      }
    }
    return '🏷️'; // Default emoji if not found
  };
  
  const formatCategoryName = (tag: string) => {
    return tag.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpvote) onUpvote(issue.id);
  };
  
  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownvote) onDownvote(issue.id);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card 
      className={`mb-4 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? "border-primary border-2 bg-primary/5 shadow-md" 
          : "hover:border-primary"
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg text-primary font-medium line-clamp-2 flex-1">
            {issue.title}
          </CardTitle>
          <Badge className={cn(
            "shrink-0",
            issue.severity === 'critical' ? "bg-red-100 text-red-800" : 
            issue.severity === 'moderate' ? "bg-amber-100 text-amber-800" : 
            "bg-green-100 text-green-800"
          )}>
            {issue.severity === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {issue.severity && issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin size={12} className="mr-1" />
          <span className="truncate mr-3">
            {issue.location.address || issue.city}
          </span>
          <Clock size={12} className="mr-1" />
          <span>{formatDate(issue.createdAt)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {issue.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {visibleTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs flex items-center">
              <span className="mr-1">{getCategoryEmoji(tag)}</span>
              {formatCategoryName(tag)}
            </Badge>
          ))}
          {hasMoreTags && (
            <Badge variant="outline" className="text-xs">
              +{issue.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="mr-2">
              {issue.communityMembers.length} supporters
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-green-50 hover:text-green-600"
              onClick={handleUpvote}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="sr-only">Upvote</span>
            </Button>
            <span className="text-sm font-medium">{issue.upvotes || 0}</span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600 ml-1"
              onClick={handleDownvote}
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="sr-only">Downvote</span>
            </Button>
            <span className="text-sm font-medium">{issue.downvotes || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;


import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ThumbsUp, ThumbsDown, AlertTriangle, Clock, Image as ImageIcon } from "lucide-react";
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
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Reset image states when issue changes
    setImageError(false);
    setImageLoaded(false);

    // Log full image URL with params
    console.log("Full image URL with params:", issue.image_url);

    // Log image URL for debugging
    if (issue.image_url) {
      console.log(`Issue ${issue.id} has image URL:`, issue.image_url);
    } else {
      console.log(`Issue ${issue.id} has no image URL`);
    }
  }, [issue]);
  
  // Get the first tag to display
  const visibleTag = issue.tags?.length > 0 ? issue.tags[0] : null;
  
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
    // Shorten long tags to keep them compact
    const formatted = tag.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return formatted.length > 12 ? formatted.substring(0, 10) + '...' : formatted;
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleImageError = () => {
    console.error("Failed to load image for issue:", issue.id, "URL:", issue.image_url);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log("Successfully loaded image for issue:", issue.id);
    setImageLoaded(true);
  };

  // Normalize image URL if needed
  let imageUrl = issue.image_url;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `https://${imageUrl}`;
    console.log("Normalized image URL:", imageUrl);
  }

  // Check if image URL is valid
  const hasValidImage = imageUrl && imageUrl.trim() !== "" && !imageError;

  return (
    <Card 
      className={`mb-2 cursor-pointer transition-all duration-300 h-full ${
        isSelected 
          ? "border-primary border-2 bg-primary/5 shadow-md" 
          : "hover:border-primary"
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-1 pt-2 px-3">
        <div className="flex justify-between items-start gap-1">
          <CardTitle className="text-sm text-primary font-medium line-clamp-1 flex-1">
            {issue.title}
          </CardTitle>
          <Badge className={cn(
            "shrink-0 text-[10px] px-1.5 py-0",
            issue.severity === 'critical' ? "bg-red-100 text-red-800" : 
            issue.severity === 'moderate' ? "bg-amber-100 text-amber-800" : 
            "bg-green-100 text-green-800"
          )}>
            {issue.severity === 'critical' && <AlertTriangle className="h-2 w-2 mr-0.5" />}
            {issue.severity && issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2 px-3">
        <div className="flex items-center text-[10px] text-muted-foreground mb-1">
          <MapPin size={10} className="mr-0.5" />
          <span className="truncate mr-2">
            {issue.location.address || issue.city}
          </span>
          <Clock size={10} className="mr-0.5" />
          <span>{formatDate(issue.createdAt)}</span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {issue.description}
        </p>
        
        {visibleTag && (
          <Badge variant="secondary" className="text-[10px] flex items-center mb-2 max-w-[90%] truncate">
            <span className="mr-1">{getCategoryEmoji(visibleTag)}</span>
            {formatCategoryName(visibleTag)}
          </Badge>
        )}
        
        {/* Display the image if available */}
        {hasValidImage ? (
          <div className="mb-2 w-full h-24 rounded-md overflow-hidden bg-gray-100 relative">
            <img 
              src={imageUrl} 
              alt={issue.title} 
              className="w-full h-full object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="eager"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-pulse">Loading image...</div>
              </div>
            )}
          </div>
        ) : issue.image_url ? (
          <div className="mb-2 w-full h-24 flex items-center justify-center bg-gray-100 rounded-md">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <span className="text-xs text-gray-500 ml-2">
              Image unavailable: {issue.image_url.substring(0, 30)}...
            </span>
          </div>
        ) : null}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>
              {issue.communityMembers.length} supporters
            </span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full hover:bg-green-50 hover:text-green-600 ml-1"
              onClick={handleUpvote}
            >
              <ThumbsUp className="h-3 w-3" />
              <span className="sr-only">Upvote</span>
            </Button>
            <span className="font-medium">{issue.upvotes || 0}</span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full hover:bg-red-50 hover:text-red-600 ml-1"
              onClick={handleDownvote}
            >
              <ThumbsDown className="h-3 w-3" />
              <span className="sr-only">Downvote</span>
            </Button>
            <span className="text-xs font-medium">{issue.downvotes || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;

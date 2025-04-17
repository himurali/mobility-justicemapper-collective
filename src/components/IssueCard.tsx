
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { IssueData } from "@/types";
import { cn } from "@/lib/utils";
import { mobilityCategories } from "@/data/issueData";
import { supabase } from "@/integrations/supabase/client";
import IssueImage from "./issue/IssueImage";
import IssueVotes from "./issue/IssueVotes";
import IssueMetadata from "./issue/IssueMetadata";

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
  const [directImageUrl, setDirectImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const checkImageUrl = async () => {
      try {
        if (issue.id) {
          console.log(`Fetching image data directly for issue ${issue.id}...`);
          
          const { data, error } = await supabase
            .from('JusticeIssue')
            .select('image_url')
            .eq('id', parseInt(issue.id, 10))
            .single();
          
          if (error) {
            console.error("Error fetching image URL from database:", error);
            return;
          }
          
          if (data) {
            console.log(`Direct database image_url for issue ${issue.id}:`, data.image_url);
            setDirectImageUrl(data.image_url);
          }
        }
      } catch (err) {
        console.error("Error in database image fetch:", err);
      }
    };
    
    checkImageUrl();
    
    console.log(`Issue ${issue.id} data:`, {
      'image_url from props': issue.image_url,
      'full issue object': issue
    });
  }, [issue]);
  
  const visibleTag = issue.tags?.length > 0 ? issue.tags[0] : null;
  
  const getCategoryEmoji = (tag: string) => {
    for (const category of mobilityCategories) {
      const subcategory = category.subcategories.find(sub => sub.id === tag);
      if (subcategory) {
        return subcategory.name.split(' ')[0];
      }
    }
    return '🏷️';
  };
  
  const formatCategoryName = (tag: string) => {
    const formatted = tag.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
        <IssueMetadata 
          location={issue.location.address}
          city={issue.city}
          createdAt={issue.createdAt}
        />
        
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {issue.description}
        </p>
        
        {visibleTag && (
          <Badge variant="secondary" className="text-[10px] flex items-center mb-2 max-w-[90%] truncate">
            <span className="mr-1">{getCategoryEmoji(visibleTag)}</span>
            {formatCategoryName(visibleTag)}
          </Badge>
        )}
        
        <IssueImage 
          imageUrl={directImageUrl || issue.image_url}
          title={issue.title}
          id={issue.id}
        />
        
        <IssueVotes 
          communityMembersCount={issue.communityMembers.length}
          upvotes={issue.upvotes}
          downvotes={issue.downvotes}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      </CardContent>
    </Card>
  );
};

export default IssueCard;

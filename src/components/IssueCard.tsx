
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { IssueData } from "@/types";

interface IssueCardProps {
  issue: IssueData;
  onClick?: () => void;
  isSelected?: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick, isSelected = false }) => {
  // Get the first 3 tags to display
  const visibleTags = issue.tags.slice(0, 3);
  const hasMoreTags = issue.tags.length > 3;

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
        <CardTitle className="text-lg text-primary font-medium">
          {issue.title}
        </CardTitle>
        <span className="text-sm text-muted-foreground bg-accent/30 px-2 py-0.5 rounded-full inline-block">
          {issue.city}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {issue.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {visibleTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {hasMoreTags && (
            <Badge variant="outline" className="text-xs">
              +{issue.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin size={12} className="mr-1" />
          <span className="truncate">
            {issue.city}
          </span>
          <span className="ml-auto">
            {issue.communityMembers.length} supporters
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssueCard;

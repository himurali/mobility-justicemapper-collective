
import React from 'react';
import { IssueData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface IssueHeaderProps {
  issue: IssueData;
  onClose: () => void;
  onJoinCommunity?: () => void;
  isJoining?: boolean;
  tagColors: Record<string, string>;
}

const IssueHeader: React.FC<IssueHeaderProps> = ({
  issue,
  onClose,
  onJoinCommunity,
  isJoining,
  tagColors,
}) => {
  const formatTag = (tag: string) => {
    return tag.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{issue.title}</h2>
          <p className="text-muted-foreground">{issue.location.address}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {issue.tags.map((tag, index) => (
          <Badge
            key={index}
            className={tagColors[formatTag(tag)] || "bg-secondary"}
          >
            {formatTag(tag)}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default IssueHeader;

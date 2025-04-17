
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface IssueVotesProps {
  communityMembersCount: number;
  upvotes: number;
  downvotes: number;
  onUpvote: (e: React.MouseEvent) => void;
  onDownvote: (e: React.MouseEvent) => void;
}

const IssueVotes: React.FC<IssueVotesProps> = ({
  communityMembersCount,
  upvotes = 0,
  downvotes = 0,
  onUpvote,
  onDownvote
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <span>
          {communityMembersCount} supporters
        </span>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full hover:bg-green-50 hover:text-green-600 ml-1"
          onClick={onUpvote}
        >
          <ThumbsUp className="h-3 w-3" />
          <span className="sr-only">Upvote</span>
        </Button>
        <span className="font-medium">{upvotes}</span>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full hover:bg-red-50 hover:text-red-600 ml-1"
          onClick={onDownvote}
        >
          <ThumbsDown className="h-3 w-3" />
          <span className="sr-only">Downvote</span>
        </Button>
        <span className="text-xs font-medium">{downvotes}</span>
      </div>
    </div>
  );
};

export default IssueVotes;

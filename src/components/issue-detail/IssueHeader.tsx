
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IssueData } from '@/types';

interface IssueHeaderProps {
  issue: IssueData;
  onClose: () => void;
  onJoinCommunity: () => void;
  isJoining: boolean;
  tagColors: Record<string, string>;
}

const IssueHeader: React.FC<IssueHeaderProps> = ({ 
  issue, 
  onClose, 
  onJoinCommunity, 
  isJoining,
  tagColors 
}) => {
  const getTagColor = (tag: string) => {
    return tagColors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <div className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold leading-none tracking-tight text-blue-700 dark:text-blue-300">
            {issue.title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {issue.city}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {issue.location.address}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {issue.tags.map(tag => (
              <Badge key={tag} className={`${getTagColor(tag)} text-xs`}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose} 
          className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
        >
          Close
        </Button>
      </div>
      
      {issue.justiceChampion && (
        <div className="w-full mt-4 border-t pt-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                  Justice Champion
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-8 w-8 border-2 border-orange-300 dark:border-orange-700">
                    <AvatarImage src={issue.justiceChampion.avatarUrl} />
                    <AvatarFallback className="bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200">
                      {issue.justiceChampion.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-300">
                      {issue.justiceChampion.name}
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-400">
                      {issue.justiceChampion.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={onJoinCommunity}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Community"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueHeader;

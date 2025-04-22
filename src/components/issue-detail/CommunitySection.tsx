
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UiCommunityMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

interface CommunitySectionProps {
  communityMembers: UiCommunityMember[];
  onJoinCommunity: () => void;
  isJoining: boolean;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({
  communityMembers,
  onJoinCommunity,
  isJoining
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">
          Community Members
        </h3>
        <Button 
          onClick={onJoinCommunity}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          disabled={isJoining}
        >
          {isJoining ? "Joining..." : "Join Community"}
        </Button>
      </div>
      
      <div className="space-y-3">
        {communityMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors">
            <Avatar>
              <AvatarImage src={member.avatarUrl || undefined} />
              <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {member.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitySection;

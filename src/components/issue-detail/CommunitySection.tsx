
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface UiCommunityMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

interface CommunitySectionProps {
  communityMembers: UiCommunityMember[];
  onJoinCommunity: () => void;
  onLeaveCommunity: () => void;
  isJoining: boolean;
  isLeaving?: boolean;
  isMember: boolean;
  currentUserEmail?: string;
  memberName?: string;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({
  communityMembers,
  onJoinCommunity,
  onLeaveCommunity,
  isJoining,
  isLeaving = false,
  isMember,
  currentUserEmail,
  memberName
}) => {
  const { user } = useAuth();
  
  // Helper to check if a member is the current user
  const isCurrentUser = (memberName: string) => {
    if (!user) return false;
    
    return (
      memberName === currentUserEmail || 
      memberName === user.email
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">
          Community Members
        </h3>
        {!isMember ? (
          <Button 
            onClick={onJoinCommunity}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            disabled={isJoining}
            aria-live="polite"
          >
            {isJoining ? "Joining..." : "Join Community"}
          </Button>
        ) : (
          <div className="flex gap-2 items-center">
            <div className="px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-md">
              {memberName ? `You're a member as ${memberName}` : "You're a member"}
            </div>
            <Button 
              onClick={onLeaveCommunity}
              variant="destructive"
              size="sm"
              disabled={isLeaving}
              aria-live="polite"
            >
              {isLeaving ? "Leaving..." : "Leave"}
            </Button>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {communityMembers.length > 0 ? (
          communityMembers.map((member) => (
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
                {isCurrentUser(member.name) && (
                  <span className="text-xs bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No members yet. Be the first to join!</p>
        )}
      </div>
    </div>
  );
};

export default CommunitySection;

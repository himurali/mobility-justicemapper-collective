
import React from 'react';

interface JoinCommunityTabProps {
  isMember: boolean;
  isJoining: boolean;
  onJoinCommunity: () => void;
  onLeaveCommunity: () => void;
  isLeaving?: boolean;
  user: any;
}

const JoinCommunityTab: React.FC<JoinCommunityTabProps> = ({
  isMember,
  isJoining,
  isLeaving = false,
  onJoinCommunity,
  onLeaveCommunity,
  user
}) => {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-300">Join the Community</h3>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Join our community of advocates working together to address mobility justice issues. Your voice matters in creating positive change.
      </p>
      <div className="flex flex-col items-center gap-4">
        {!isMember ? (
          <button 
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium px-8 py-2 rounded"
            onClick={onJoinCommunity}
            disabled={isJoining}
          >
            {isJoining ? "Joining..." : "Join Now"}
          </button>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium px-8 py-2 rounded">
              You're already a member!
            </div>
            <button 
              className="bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200 font-medium px-8 py-2 rounded transition-colors"
              onClick={onLeaveCommunity}
              disabled={isLeaving}
            >
              {isLeaving ? "Leaving..." : "Leave Community"}
            </button>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          {!user ? "Sign in to participate" : "Thank you for your interest in this issue"}
        </p>
      </div>
    </div>
  );
};

export default JoinCommunityTab;

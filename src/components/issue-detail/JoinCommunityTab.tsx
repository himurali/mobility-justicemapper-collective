
import React from 'react';

interface JoinCommunityTabProps {
  isMember: boolean;
  isJoining: boolean;
  onJoinCommunity: () => void;
  user: any;
}

const JoinCommunityTab: React.FC<JoinCommunityTabProps> = ({
  isMember,
  isJoining,
  onJoinCommunity,
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
          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium px-8 py-2 rounded">
            You're already a member!
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

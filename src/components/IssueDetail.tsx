
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import IssueHeader from './issue-detail/IssueHeader';
import IssueTabs from './issue-detail/IssueTabs';

import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import type { IssueData } from '@/types';

interface IssueDetailProps {
  issue: IssueData | null;
  onClose: () => void;
  initialTab?: string;
}

const IssueDetail: React.FC<IssueDetailProps> = ({
  issue,
  onClose,
  initialTab = "video"
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState(issue?.documents || []);

  const {
    communityMembers,
    isMember,
    isJoining,
    isLeaving,
    memberName,
    handleJoinCommunity,
    handleLeaveCommunity,
  } = useCommunityMembers(issue, user);

  if (!issue) return null;

  const handleDocumentAdded = (newDoc: any) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  return (
    <Card className="w-full h-full overflow-hidden shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <IssueHeader
          issue={issue}
          onClose={onClose}
          onJoinCommunity={handleJoinCommunity}
          isJoining={isJoining}
        />
      </CardHeader>
      <CardContent className="p-0">
        <IssueTabs
          issue={issue}
          documents={documents}
          onDocumentAdded={handleDocumentAdded}
          onClose={onClose}
          user={user}
          initialTab={initialTab}
          isMember={isMember}
          isJoining={isJoining}
          isLeaving={isLeaving}
          memberName={memberName}
          communityMembers={communityMembers}
          handleJoinCommunity={handleJoinCommunity}
          handleLeaveCommunity={handleLeaveCommunity}
        />
      </CardContent>
      <CardFooter className="border-t p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="w-full text-center text-sm text-muted-foreground">
          {isMember
            ? "You're part of this community. Thank you for contributing!"
            : "Join the community to contribute to this issue's resolution"}
        </div>
      </CardFooter>
    </Card>
  );
};

export default IssueDetail;

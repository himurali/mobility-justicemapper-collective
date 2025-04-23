
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

const tagColors: Record<string, string> = {
  'Cycling': 'bg-emerald-100 text-gray-600 dark:bg-emerald-900 dark:text-gray-300',
  'Safety': 'bg-red-100 text-gray-600 dark:bg-red-900 dark:text-gray-300',
  'Infrastructure': 'bg-blue-100 text-gray-600 dark:bg-blue-900 dark:text-gray-300',
  'Intersection': 'bg-amber-100 text-gray-600 dark:bg-amber-900 dark:text-gray-300',
  'Accessibility': 'bg-purple-100 text-gray-600 dark:bg-purple-900 dark:text-gray-300',
  'Sidewalks': 'bg-indigo-100 text-gray-600 dark:bg-indigo-900 dark:text-gray-300',
  'Wheelchair': 'bg-violet-100 text-gray-600 dark:bg-violet-900 dark:text-gray-300',
  'Urban Design': 'bg-teal-100 text-gray-600 dark:bg-teal-900 dark:text-gray-300',
  'Pedestrian': 'bg-orange-100 text-gray-600 dark:bg-orange-900 dark:text-gray-300',
  'Crossing': 'bg-yellow-100 text-gray-600 dark:bg-yellow-900 dark:text-gray-300',
  'Traffic': 'bg-rose-100 text-gray-600 dark:bg-rose-900 dark:text-gray-300',
  'Maintenance': 'bg-slate-100 text-gray-600 dark:bg-slate-900 dark:text-gray-300',
  'Lighting': 'bg-cyan-100 text-gray-600 dark:bg-cyan-900 dark:text-gray-300',
  'Public Transit': 'bg-fuchsia-100 text-gray-600 dark:bg-fuchsia-900 dark:text-gray-600',
  'Weather Protection': 'bg-sky-100 text-gray-600 dark:bg-sky-900 dark:text-gray-300',
  'Comfort': 'bg-lime-100 text-gray-600 dark:bg-lime-900 dark:text-gray-300',
};

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
          tagColors={tagColors}
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


import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueHeader from "./IssueHeader";
import IssueContent from "./IssueContent";
import SolutionSection from "./SolutionSection";
import CommunitySection from "./CommunitySection";
import JoinCommunityTab from "./JoinCommunityTab";
import DocumentsTab from "./DocumentsTab";
import Forum from "@/components/Forum";
import { mockForumPosts } from "@/data/mockData";

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

const IssueTabs = ({
  issue,
  documents,
  onDocumentAdded,
  onClose,
  user,
  initialTab,
  isMember,
  isJoining,
  isLeaving,
  memberName,
  communityMembers,
  handleJoinCommunity,
  handleLeaveCommunity,
}) => {
  const [currentDocuments, setCurrentDocuments] = useState(documents || []);
  useEffect(() => {
    setCurrentDocuments(documents || []);
  }, [documents]);

  const handleDocumentAddedInternal = (newDoc) => {
    setCurrentDocuments((prev) => [newDoc, ...prev]);
    if (onDocumentAdded) onDocumentAdded(newDoc);
  };

  return (
    <Tabs defaultValue={initialTab || "video"} className="w-full">
      <TabsList className="w-full justify-start px-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
        <TabsTrigger value="video" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-200">Video</TabsTrigger>
        <TabsTrigger value="solution" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-200">Solution</TabsTrigger>
        <TabsTrigger value="join" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800 dark:data-[state=active]:bg-yellow-900 dark:data-[state=active]:text-yellow-200">Join Community</TabsTrigger>
        <TabsTrigger value="community" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-200">Community</TabsTrigger>
        <TabsTrigger value="forum" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 dark:data-[state=active]:bg-orange-900 dark:data-[state=active]:text-orange-200">Forum</TabsTrigger>
        <TabsTrigger value="documents" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 dark:data-[state=active]:bg-amber-900 dark:data-[state=active]:text-amber-200">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="video" className="p-6 pt-4">
        <IssueContent issue={issue} />
      </TabsContent>

      <TabsContent value="solution" className="p-6 pt-4">
        <SolutionSection solution={issue.solution} />
      </TabsContent>

      <TabsContent value="join" className="p-6 pt-4">
        <JoinCommunityTab
          isMember={isMember}
          isJoining={isJoining}
          isLeaving={isLeaving}
          onJoinCommunity={handleJoinCommunity}
          onLeaveCommunity={handleLeaveCommunity}
          user={user}
          memberName={memberName}
        />
      </TabsContent>

      <TabsContent value="community" className="p-6 pt-4">
        <CommunitySection
          communityMembers={communityMembers}
          onJoinCommunity={handleJoinCommunity}
          onLeaveCommunity={handleLeaveCommunity}
          isJoining={isJoining}
          isLeaving={isLeaving}
          isMember={isMember}
          currentUserEmail={user?.email}
          memberName={memberName}
        />
      </TabsContent>

      <TabsContent value="forum" className="p-6 pt-4">
        <Forum posts={mockForumPosts} />
      </TabsContent>

      <TabsContent value="documents" className="p-6 pt-4">
        <DocumentsTab
          documents={currentDocuments}
          issueId={issue.id}
          isMember={isMember}
          user={user}
          onDocumentAdded={handleDocumentAddedInternal}
        />
      </TabsContent>
    </Tabs>
  );
};

export default IssueTabs;

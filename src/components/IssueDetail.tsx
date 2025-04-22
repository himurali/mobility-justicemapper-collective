
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IssueData } from '@/types';
import Forum from '@/components/Forum';
import { mockForumPosts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import IssueHeader from './issue-detail/IssueHeader';
import IssueContent from './issue-detail/IssueContent';
import SolutionSection from './issue-detail/SolutionSection';
import CommunitySection from './issue-detail/CommunitySection';
import JoinCommunityTab from './issue-detail/JoinCommunityTab';
import DocumentsTab from './issue-detail/DocumentsTab';

interface IssueDetailProps {
  issue: IssueData | null;
  onClose: () => void;
  initialTab?: string;
}

interface DbCommunityMember {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  issue_id: number;
  created_at?: string;
}

interface UiCommunityMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
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
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [communityMembers, setCommunityMembers] = useState<UiCommunityMember[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (issue) {
      fetchCommunityMembers();
    }
  }, [issue]);

  const fetchCommunityMembers = async () => {
    if (!issue) return;
    
    const { data, error } = await supabase
      .from('issue_community_members')
      .select('*')
      .eq('issue_id', parseInt(issue.id));

    if (error) {
      console.error("Error fetching community members:", error);
      return;
    }

    if (data) {
      const mappedMembers: UiCommunityMember[] = data.map((member: DbCommunityMember) => ({
        id: member.id,
        name: member.name,
        role: member.role || 'member',
        avatarUrl: member.avatar_url
      }));
      setCommunityMembers(mappedMembers);
      
      if (user) {
        const currentMember = mappedMembers.find(member => 
          member.name === user.email
        );
        
        if (currentMember) {
          setIsMember(true);
          setMembershipId(currentMember.id);
          setMemberName(currentMember.name);
        } else {
          setIsMember(false);
          setMembershipId(null);
          setMemberName(undefined);
        }
      }
    }
  };

  if (!issue) return null;

  const handleJoinCommunity = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join the community",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const { data: existingMember, error: checkError } = await supabase
        .from('community_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('issue_id', parseInt(issue.id));

      if (checkError) {
        console.error("Error checking membership:", checkError);
        throw checkError;
      }

      if (existingMember && existingMember.length > 0) {
        toast({
          title: "Already a member",
          description: "You are already part of this community!",
        });
        setIsMember(true);
        return;
      }

      const { error: insertError } = await supabase
        .from('community_members')
        .insert({
          user_id: user.id,
          issue_id: parseInt(issue.id),
          role: 'member'
        });

      if (insertError) {
        console.error("Error joining community:", insertError);
        throw insertError;
      }

      const userEmail = user.email || 'Anonymous';
      
      const { data: newMember, error: uiInsertError } = await supabase
        .from('issue_community_members')
        .insert({
          issue_id: parseInt(issue.id),
          name: userEmail,
          role: 'member',
          avatar_url: user.user_metadata?.avatar_url || null
        })
        .select('*')
        .single();

      if (uiInsertError) {
        console.error("Error updating UI members:", uiInsertError);
        throw uiInsertError;
      }

      // Add the new member to the state immediately
      if (newMember) {
        setMembershipId(newMember.id);
        setMemberName(userEmail);
        const newUiMember: UiCommunityMember = {
          id: newMember.id,
          name: newMember.name,
          role: newMember.role || 'member',
          avatarUrl: newMember.avatar_url
        };
        
        setCommunityMembers(prev => [...prev, newUiMember]);
      }
      
      setIsMember(true);

      toast({
        title: "Success!",
        description: "You've joined the community. Welcome!",
      });
    } catch (error: any) {
      console.error("Full error details:", error);
      toast({
        title: "Error joining community",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user || !isMember || !membershipId) {
      toast({
        title: "Cannot leave community",
        description: "You are not a member or not signed in",
        variant: "destructive",
      });
      return;
    }

    setIsLeaving(true);
    try {
      // Delete from community_members table
      const { error: deleteMemberError } = await supabase
        .from('community_members')
        .delete()
        .eq('user_id', user.id)
        .eq('issue_id', parseInt(issue.id));

      if (deleteMemberError) {
        console.error("Error leaving community:", deleteMemberError);
        throw deleteMemberError;
      }

      // Delete from issue_community_members table
      const { error: deleteUiMemberError } = await supabase
        .from('issue_community_members')
        .delete()
        .eq('id', membershipId);

      if (deleteUiMemberError) {
        console.error("Error removing from UI members:", deleteUiMemberError);
        throw deleteUiMemberError;
      }

      // Update the local state
      setCommunityMembers(prev => prev.filter(member => member.id !== membershipId));
      setIsMember(false);
      setMembershipId(null);
      setMemberName(undefined);

      toast({
        title: "Left community",
        description: "You've successfully left the community",
      });
    } catch (error: any) {
      console.error("Error leaving community:", error);
      toast({
        title: "Error leaving community",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLeaving(false);
    }
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
        <Tabs defaultValue={initialTab} className="w-full">
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
            />
          </TabsContent>
          
          <TabsContent value="forum" className="p-6 pt-4">
            <Forum posts={mockForumPosts} />
          </TabsContent>
          
          <TabsContent value="documents" className="p-6 pt-4">
            <DocumentsTab documents={issue.documents} />
          </TabsContent>
        </Tabs>
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

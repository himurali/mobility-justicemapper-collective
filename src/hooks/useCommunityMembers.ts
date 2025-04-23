
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UiCommunityMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}
  
export const useCommunityMembers = (issue: any, user: any) => {
  const { toast } = useToast();

  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [communityMembers, setCommunityMembers] = useState<UiCommunityMember[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string | undefined>(undefined);

  // Fetch community members for an issue
  const fetchCommunityMembers = useCallback(async () => {
    if (!issue) return;
    try {
      const { data, error } = await supabase
        .from("issue_community_members")
        .select("*")
        .eq("issue_id", parseInt(issue.id));

      if (error) {
        console.error("Error fetching community members:", error);
        return;
      }

      if (data) {
        const mappedMembers: UiCommunityMember[] = data.map((member: any) => ({
          id: member.id,
          name: member.name,
          role: member.role || "member",
          avatarUrl: member.avatar_url,
        }));
        setCommunityMembers(mappedMembers);
        if (user) checkMembershipStatus(mappedMembers);
      }
    } catch (error) {
      console.error("Failed to fetch community members:", error);
    }
  }, [issue, user]);

  // Check if the logged-in user is a member
  const checkMembershipStatus = useCallback(async (members = communityMembers) => {
    if (!user || !issue) {
      setIsMember(false);
      setMembershipId(null);
      setMemberName(undefined);
      return;
    }

    const userEmail = user.email || "";

    const currentMember = members.find((member) => member.name === userEmail);
    if (currentMember) {
      setIsMember(true);
      setMembershipId(currentMember.id);
      setMemberName(currentMember.name);
      return;
    }

    try {
      const { data: dbMembers, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('issue_id', parseInt(issue.id));

      if (error) {
        console.error("Error checking membership in database:", error);
        return;
      }

      if (dbMembers && dbMembers.length > 0) {
        setIsMember(true);
        setMembershipId(dbMembers[0].id);
        setMemberName(userEmail);

        if (!members.some((m) => m.id === dbMembers[0].id)) {
          const { data: existingUiMember } = await supabase
            .from('issue_community_members')
            .select('*')
            .eq('name', userEmail)
            .eq('issue_id', parseInt(issue.id))
            .single();

          if (!existingUiMember) {
            const { data: newUiMember } = await supabase
              .from('issue_community_members')
              .insert({
                issue_id: parseInt(issue.id),
                name: userEmail,
                role: dbMembers[0].role || 'member',
                avatar_url: user.user_metadata?.avatar_url || null
              })
              .select('*')
              .single();

            if (newUiMember) {
              setCommunityMembers((prev) => [
                ...prev,
                {
                  id: newUiMember.id,
                  name: newUiMember.name,
                  role: newUiMember.role || 'member',
                  avatarUrl: newUiMember.avatar_url,
                }
              ]);
            }
          }
        }
      } else {
        setIsMember(false);
        setMembershipId(null);
        setMemberName(undefined);
      }
    } catch (error) {
      console.error("Error in membership check:", error);
    }
  }, [user, issue, communityMembers]);

  useEffect(() => {
    if (issue) {
      fetchCommunityMembers();
    } else {
      setCommunityMembers([]);
      setIsMember(false);
      setMembershipId(null);
      setMemberName(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue]);

  useEffect(() => {
    if (issue && user) {
      checkMembershipStatus();
    } else if (!user) {
      setIsMember(false);
      setMembershipId(null);
      setMemberName(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, issue?.id]);

  // JOIN community
  const handleJoinCommunity = async (skipCheck = false) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join the community",
        variant: "destructive",
      });
      return;
    }

    if (isJoining || (isMember && !skipCheck)) return;

    setIsJoining(true);
    try {
      if (!skipCheck) {
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
          await fetchCommunityMembers();
          setIsJoining(false);
          return;
        }
      }

      const userEmail = user.email || "Anonymous";

      const { error: insertError } = await supabase
        .from('community_members')
        .insert({
          user_id: user.id,
          issue_id: parseInt(issue.id),
          role: 'member',
        });

      if (insertError) {
        console.error("Error joining community:", insertError);
        throw insertError;
      }

      const { data: newMember, error: uiInsertError } = await supabase
        .from('issue_community_members')
        .insert({
          issue_id: parseInt(issue.id),
          name: userEmail,
          role: 'member',
          avatar_url: user.user_metadata?.avatar_url || null,
        })
        .select('*')
        .single();

      if (uiInsertError) {
        console.error("Error updating UI members:", uiInsertError);
        throw uiInsertError;
      }

      if (newMember) {
        setMembershipId(newMember.id);
        setMemberName(userEmail);
        const newUiMember: UiCommunityMember = {
          id: newMember.id,
          name: newMember.name,
          role: newMember.role || 'member',
          avatarUrl: newMember.avatar_url,
        };
        setCommunityMembers((prev) => [...prev, newUiMember]);
        setIsMember(true);
      }

      if (!skipCheck) {
        toast({
          title: "Success!",
          description: "You've joined the community. Welcome!",
        });
      }
    } catch (error: any) {
      console.error("Full error details:", error);
      if (!skipCheck) {
        toast({
          title: "Error joining community",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsJoining(false);
    }
  };

  // LEAVE community
  const handleLeaveCommunity = async () => {
    if (!user || !isMember) {
      toast({
        title: "Cannot leave community",
        description: "You are not a member or not signed in",
        variant: "destructive",
      });
      return;
    }

    if (isLeaving) return;

    setIsLeaving(true);
    let idToDelete = membershipId;
    try {
      if (!idToDelete) {
        const { data } = await supabase
          .from('issue_community_members')
          .select('id')
          .eq('issue_id', parseInt(issue.id))
          .eq('name', user.email)
          .single();
        if (data?.id) {
          idToDelete = data.id;
        } else {
          throw new Error("Could not find your membership record");
        }
      }

      const { error: deleteMemberError } = await supabase
        .from('community_members')
        .delete()
        .eq('user_id', user.id)
        .eq('issue_id', parseInt(issue.id));

      if (deleteMemberError) {
        console.error("Error leaving community:", deleteMemberError);
        throw deleteMemberError;
      }

      const { error: deleteUiMemberError } = await supabase
        .from('issue_community_members')
        .delete()
        .eq('id', idToDelete);

      if (deleteUiMemberError) {
        console.error("Error removing from UI members:", deleteUiMemberError);
        throw deleteUiMemberError;
      }

      setCommunityMembers((prev) => prev.filter((member) => member.id !== idToDelete));
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

  return {
    communityMembers,
    isMember,
    isJoining,
    isLeaving,
    membershipId,
    memberName,
    handleJoinCommunity,
    handleLeaveCommunity,
    fetchCommunityMembers,
    setCommunityMembers,
  };
};

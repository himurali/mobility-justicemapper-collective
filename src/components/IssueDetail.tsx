import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IssueData } from '@/types';
import Forum from '@/components/Forum';
import { mockForumPosts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  'Public Transit': 'bg-fuchsia-100 text-gray-600 dark:bg-fuchsia-900 dark:text-gray-300',
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

  if (!issue) return null;

  const getTagColor = (tag: string) => {
    return tagColors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const handleJoinCommunity = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join the community",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          user_id: user.id,
          issue_id: parseInt(issue.id),
          role: 'member',
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've joined the community. Welcome!",
      });
    } catch (error: any) {
      toast({
        title: "Error joining community",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full h-full overflow-hidden shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-blue-700 dark:text-blue-300">{issue.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{issue.city}</Badge>
              <span className="text-xs text-muted-foreground">
                {issue.location.address}
              </span>
            </CardDescription>
            <div className="flex flex-wrap gap-1 mt-2">
              {issue.tags.map(tag => (
                <Badge key={tag} className={`${getTagColor(tag)} text-xs`}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
            Close
          </Button>
        </div>
        
        {issue.justiceChampion && (
          <div className="w-full mt-4 border-t pt-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300">Justice Champion</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-8 w-8 border-2 border-orange-300 dark:border-orange-700">
                      <AvatarImage src={issue.justiceChampion.avatarUrl} />
                      <AvatarFallback className="bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200">
                        {issue.justiceChampion.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-300">{issue.justiceChampion.name}</p>
                      <p className="text-xs text-orange-700 dark:text-orange-400">{issue.justiceChampion.role}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                    {issue.communityMembers.length} supporters
                  </Badge>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Join Community
              </Button>
            </div>
          </div>
        )}
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
            <div className="flex justify-center mb-4">
              <div className="w-3/4 aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden shadow-md">
                {issue.videoUrl ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${getYoutubeId(issue.videoUrl)}`}
                    className="w-full h-full"
                    allowFullScreen
                    title={issue.title}
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No video available</p>
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2 text-blue-700 dark:text-blue-300">Problem Description</h3>
            <p className="text-muted-foreground">{issue.description}</p>
          </TabsContent>
          
          <TabsContent value="solution" className="p-6 pt-4">
            <h3 className="text-lg font-medium mb-2 text-green-700 dark:text-green-300">Proposed Solution</h3>
            <p className="text-muted-foreground">{issue.solution}</p>
          </TabsContent>
          
          <TabsContent value="join" className="p-6 pt-4">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-300">Join the Community</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join our community of advocates working together to address mobility justice issues. Your voice matters in creating positive change.
              </p>
              <div className="flex flex-col items-center gap-4">
                <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium px-8">
                  Join Now
                </Button>
                <p className="text-sm text-muted-foreground">
                  Already a member? Sign in to participate
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="community" className="p-6 pt-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300">Community Members</h3>
                <Button 
                  onClick={handleJoinCommunity}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                >
                  Join Community
                </Button>
              </div>
              
              <div className="space-y-3">
                {issue.communityMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forum" className="p-6 pt-4">
            <Forum posts={mockForumPosts} />
          </TabsContent>
          
          <TabsContent value="documents" className="p-6 pt-4">
            <h3 className="text-lg font-medium mb-4 text-amber-700 dark:text-amber-300">Related Documents</h3>
            {issue.documents && issue.documents.length > 0 ? (
              <div className="space-y-2">
                {issue.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span>{doc.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No documents available</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="w-full text-center text-sm text-muted-foreground">
          Join the community to contribute to this issue's resolution
        </div>
      </CardFooter>
    </Card>
  );
};

function getYoutubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

export default IssueDetail;

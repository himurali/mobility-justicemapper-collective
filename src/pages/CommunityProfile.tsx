
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Users, MapPin, Star, MessageSquare, Lightbulb } from 'lucide-react';
import { UserSkillsCard } from '@/components/community/UserSkillsCard';
import { CommunityEvents } from '@/components/community/CommunityEvents';
import { ImpactMetrics } from '@/components/community/ImpactMetrics';
import { mockCommunityMember } from '@/data/mockData';

const CommunityProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  
  // For demo purposes, we'll use mock data
  // In a real app, you would fetch this based on the userId
  const user = mockCommunityMember;
  
  // Determine user level based on contribution points
  const getUserLevel = (points: number) => {
    if (points >= 1000) return { title: 'Justice Leader', color: 'bg-gradient-to-r from-amber-500 to-orange-600', progress: 100 };
    if (points >= 500) return { title: 'Justice Champion', color: 'bg-gradient-to-r from-blue-500 to-indigo-600', progress: 75 };
    if (points >= 200) return { title: 'Justice Advocate', color: 'bg-gradient-to-r from-emerald-500 to-teal-600', progress: 50 };
    return { title: 'Justice Observer', color: 'bg-gradient-to-r from-slate-400 to-gray-500', progress: 25 };
  };
  
  const userLevel = getUserLevel(user.contributionPoints);
  
  // Calculate progress to next level
  const getProgressToNextLevel = () => {
    if (user.contributionPoints >= 1000) return 100; // Max level
    if (user.contributionPoints >= 500) return ((user.contributionPoints - 500) / 500) * 100;
    if (user.contributionPoints >= 200) return ((user.contributionPoints - 200) / 300) * 100;
    return (user.contributionPoints / 200) * 100;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Card className="mb-8 overflow-hidden border-0 shadow-lg">
        <div className={`h-32 ${userLevel.color}`}></div>
        <CardContent className="pt-0 relative pb-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-12">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.bio}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge className={userLevel.color.replace('bg-gradient-to-r', '') + ' text-white'}>
                    {userLevel.title}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {user.city}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Progress to next level</span>
                  <span className="text-sm font-medium">{user.contributionPoints} points</span>
                </div>
                <Progress value={getProgressToNextLevel()} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-sm font-medium">Badges</div>
                    <div className="text-xl font-bold">{user.badges.length}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-md">
                  <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="text-sm font-medium">Solutions</div>
                    <div className="text-xl font-bold">{user.solutions}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-950 rounded-md">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-sm font-medium">Forum Posts</div>
                    <div className="text-xl font-bold">{user.forumPosts}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {user.badges.map((badge) => (
                  <Badge 
                    key={badge.id} 
                    className="flex items-center gap-1 px-2 py-1"
                    style={{ backgroundColor: badge.color, color: 'white' }}
                  >
                    <span className="text-xs">{badge.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="skills">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="skills">Skills & Matching</TabsTrigger>
              <TabsTrigger value="events">Community Events</TabsTrigger>
              <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="mt-6">
              <UserSkillsCard skills={user.skills} matchedIssues={user.matchedIssues} />
            </TabsContent>
            
            <TabsContent value="events" className="mt-6">
              <CommunityEvents events={user.events} />
            </TabsContent>
            
            <TabsContent value="impact" className="mt-6">
              <ImpactMetrics metrics={user.impactMetrics} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Challenges
              </CardTitle>
              <CardDescription>
                Join community challenges to earn rewards and make a bigger impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.challenges.map(challenge => (
                <div key={challenge.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <Badge variant={challenge.completed ? "default" : "outline"}>
                      {challenge.completed ? "Completed" : `${challenge.progress}%`}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                  {!challenge.completed && (
                    <Progress value={challenge.progress} className="h-1 mt-2" />
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" /> View All Challenges
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfile;

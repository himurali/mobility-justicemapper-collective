
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skill, MatchedIssue } from '@/types';

interface UserSkillsCardProps {
  skills: Skill[];
  matchedIssues: MatchedIssue[];
}

export const UserSkillsCard: React.FC<UserSkillsCardProps> = ({ skills, matchedIssues }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <Card key={index} className="overflow-hidden border">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">
                    <Badge style={{ backgroundColor: skill.color, color: 'white' }}>
                      {skill.name}
                    </Badge>
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {skill.endorsed ? '✓ Endorsed' : 'Not endorsed'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Beginner</span>
                  <Progress value={skill.level} className="h-1 flex-1" />
                  <span className="text-xs">Expert</span>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="overflow-hidden border border-dashed flex items-center justify-center h-full">
            <CardContent className="p-4 text-center">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                + Add new skill
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Matched Issues</h3>
        <div className="space-y-4">
          {matchedIssues.map((issue) => (
            <Card key={issue.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/issues/${issue.id}`} className="font-medium hover:underline text-blue-600 dark:text-blue-400">
                      {issue.title}
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {issue.location || 'Unknown location'}
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    {issue.match}% Match
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {issue.tags && issue.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" className="gap-1">
                    <LinkIcon className="h-3 w-3" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ForumPost } from '@/types';

interface ForumProps {
  posts: ForumPost[];
}

const Forum: React.FC<ForumProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No forum posts available for this issue yet.</p>
        <Button className="mt-4">Create First Post</Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-full">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.author.avatarUrl} />
                  <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    by {post.author.name} · {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M7 10v12l10-6-10-6z"/>
                  </svg>
                  {post.likes}
                </Button>
              </div>
            </div>
            
            <p className="my-3 text-sm">{post.content}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
            
            {post.replies.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                {post.replies.map(reply => (
                  <div key={reply.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.author.avatarUrl} />
                        <AvatarFallback className="text-xs">{reply.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{reply.author.name}</span>
                      <span className="text-xs text-muted-foreground">{new Date(reply.date).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 ml-8">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Forum;

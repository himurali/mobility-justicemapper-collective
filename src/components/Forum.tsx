
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ForumPost } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ForumProps {
  posts: ForumPost[];
}

const getTodayDateIso = () => {
  const d = new Date();
  return d.toISOString().substring(0, 10);
};

const Forum: React.FC<ForumProps> = ({ posts: initialPosts }) => {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const newPost: ForumPost = {
      id: `local-${Date.now()}`,
      issueId: '',
      title: newTitle,
      author: 'Anonymous',
      date: getTodayDateIso(),
      content: newContent,
      tags: [],
      likes: 0,
      replies: [],
    };
    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-muted rounded-t-lg pb-2">
        {isAdding ? (
          <form onSubmit={handleAddPost} className="space-y-2">
            <Input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full"
              required
              maxLength={100}
            />
            <Textarea
              placeholder="Write your post..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              required
              maxLength={800}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">Post</Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle('');
                  setNewContent('');
                }}
              >Cancel</Button>
            </div>
          </form>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            + Add Post
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 p-4 min-h-0 max-h-[calc(80vh-4rem)]">
        {posts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No forum posts available for this issue yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        by {post.author} · {new Date(post.date).toLocaleDateString()}
                      </p>
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
                            <span className="font-medium">{reply.author}</span>
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
        )}
      </ScrollArea>
    </div>
  );
};

export default Forum;

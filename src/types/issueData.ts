
import type { IssueLocation, IssueCategory, IssueSeverity } from './index';

// Update the ForumPost type so author and reply author are just the name (string)
export interface IssueData {
  id: string;
  title: string;
  description: string;
  solution: string;
  videoUrl: string;
  city: string;
  location: IssueLocation;
  communityMembers: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
  }[];
  documents: {
    name: string;
    url: string;
    type: string;
  }[];
  tags: string[];
  justiceChampion?: {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  severity: IssueSeverity;
  image_url?: string;
}

// Here, author and reply.author are now just 'name: string'
export interface ForumPost {
  id: string;
  issueId: string;
  title: string;
  author: string;
  date: string;
  content: string;
  tags: string[];
  likes: number;
  replies: {
    id: string;
    author: string;
    date: string;
    content: string;
    likes: number;
  }[];
}

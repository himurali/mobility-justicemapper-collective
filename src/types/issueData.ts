
import type { IssueLocation, IssueCategory, IssueSeverity } from './index';

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
  justiceChampion: {
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
}

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

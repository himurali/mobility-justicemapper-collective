
import { IssueData, ForumPost } from './issueData';

// Location and category types
export interface IssueLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export type IssueCategory = 
  | 'safety' 
  | 'traffic' 
  | 'cycling' 
  | 'sidewalks' 
  | 'accessibility' 
  | 'public_transport'
  | 'other';

export type IssueSeverity = 'low' | 'medium' | 'high';

export interface City {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  zoom: number;
}

// Define types for forum posts
export interface ForumReply {
  id: string;
  author: string;
  date: string;
  content: string;
  likes: number;
}

export type { IssueData, ForumPost };

// Define types for community member data
export interface Badge {
  id: string;
  name: string;
  color: string;
}

export interface Skill {
  name: string;
  level: number;
  proficiency?: string;
  endorsed?: boolean;
  color?: string;
}

export interface MatchedIssue {
  id: string;
  title: string;
  match: number;
  skills: string[];
  skillsMatch?: number[];
  location?: string;
  tags?: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  role: string;
  description?: string;
  time?: string;
  type?: string;
  participants?: string[];
  isRegistered?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
}

export interface ImpactMetric {
  category: string;
  value: number;
  color: string;
}

export interface ContributionData {
  month: string;
  contributions: number;
}

export interface ImpactMetrics {
  impactCategories: ImpactMetric[];
  contributionHistory: ContributionData[];
  impactScore: number;
  issuesSolved: number;
  communitiesJoined: number;
  peopleImpacted: number;
}

export interface CommunityMember {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  city: string;
  contributionPoints: number;
  badges: Badge[];
  skills: Skill[];
  matchedIssues: MatchedIssue[];
  solutions: number;
  forumPosts: number;
  events: Event[];
  impactMetrics: ImpactMetrics;
  challenges: Challenge[];
}


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

export interface IssueReport {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  location: IssueLocation;
  images: string[];
  date: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  upvotes: number;
  comments: Comment[];
  status: 'open' | 'in_progress' | 'resolved';
}

export interface Comment {
  id: string;
  text: string;
  date: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface City {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  zoom: number;
}

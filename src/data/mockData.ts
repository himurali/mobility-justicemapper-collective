
import { ForumPost, IssueData } from '@/types';

export const mockForumPosts: ForumPost[] = [
  {
    id: "forum-1",
    issueId: "1",
    title: "Monthly Community Meeting - Downtown Cycling Infrastructure",
    author: "Maria Rodriguez",
    date: "2025-03-10",
    content: "I'd like to invite everyone to our monthly community meeting where we'll discuss the progress on downtown cycling infrastructure improvements. We'll review the city's response to our collective feedback and plan next steps.",
    tags: ["Meeting", "Cycling", "Infrastructure"],
    likes: 24,
    replies: [
      {
        id: "reply-1-1",
        author: "James Wilson",
        date: "2025-03-10",
        content: "I'll be there! I've documented several problematic intersections that we should discuss.",
        likes: 8
      },
      {
        id: "reply-1-2",
        author: "Sarah Chen",
        date: "2025-03-11",
        content: "Can we also discuss the new bike lane proposal for Oak Street? I have some concerns about the current design.",
        likes: 12
      }
    ]
  },
  {
    id: "forum-2",
    issueId: "2",
    title: "Action Plan for Improving Wheelchair Accessibility in Public Transit",
    author: "David Johnson",
    date: "2025-03-08",
    content: "After our survey of transit stations, I've drafted an action plan for improving wheelchair accessibility. The document includes prioritized improvements, estimated costs, and potential funding sources. I'd appreciate everyone's feedback before we present this to the city council.",
    tags: ["Action Plan", "Accessibility", "Public Transit", "Wheelchair"],
    likes: 37,
    replies: [
      {
        id: "reply-2-1",
        author: "Lisa Thompson",
        date: "2025-03-09",
        content: "This is excellent work, David! I've reviewed the document and added some comments about the Central Station ramps that need urgent attention.",
        likes: 15
      }
    ]
  },
  {
    id: "forum-3",
    issueId: "8",
    title: "Volunteer Group for Sidewalk Condition Documentation",
    author: "Michael Brown",
    date: "2025-03-05",
    content: "I'm organizing a volunteer group to systematically document sidewalk conditions in the eastern neighborhoods. We'll use the app to record issues and create a comprehensive report. Looking for 10-15 volunteers who can commit to covering specific areas over the next two weekends.",
    tags: ["Volunteer", "Sidewalks", "Documentation"],
    likes: 19,
    replies: [
      {
        id: "reply-3-1",
        author: "Emma Davis",
        date: "2025-03-06",
        content: "I can help cover the Riverside district. I walk there daily and have already noticed several problem areas.",
        likes: 7
      },
      {
        id: "reply-3-2",
        author: "Robert Kim",
        date: "2025-03-06",
        content: "Count me in for the University area. I can bring my measuring tools to document exact dimensions of problematic spots.",
        likes: 9
      },
      {
        id: "reply-3-3",
        author: "Jennifer Lopez",
        date: "2025-03-07",
        content: "I'll volunteer for downtown. I use a wheelchair and can provide valuable perspective on accessibility issues.",
        likes: 21
      }
    ]
  },
  {
    id: "forum-4",
    issueId: "3",
    title: "Update on City Council Meeting - Pedestrian Safety Initiatives",
    author: "Alexandra Wong",
    date: "2025-03-01",
    content: "I attended yesterday's city council meeting where our pedestrian safety proposals were discussed. The council was receptive to our data-driven approach and has agreed to allocate funding for improved crosswalks at the five most dangerous intersections we identified. They've requested more detailed information on our other recommendations.",
    tags: ["Update", "Pedestrian", "Safety", "City Council"],
    likes: 42,
    replies: [
      {
        id: "reply-4-1",
        author: "Thomas Garcia",
        date: "2025-03-01",
        content: "This is great news! Thanks for representing us, Alexandra. I can help prepare the additional information they requested.",
        likes: 11
      },
      {
        id: "reply-4-2",
        author: "Sophia Miller",
        date: "2025-03-02",
        content: "Did they mention any timeline for the crosswalk improvements? We should follow up to ensure this doesn't get delayed.",
        likes: 8
      }
    ]
  },
  {
    id: "forum-5",
    issueId: "4",
    title: "Proposal for Night Safety Audit of Street Lighting",
    author: "Daniel Lee",
    date: "2025-02-28",
    content: "I'm proposing we conduct a night safety audit to assess street lighting adequacy in residential areas. Poor lighting has been mentioned in several mobility issues, and a systematic assessment would strengthen our case for improvements. I've created a simple methodology and reporting template we could use.",
    tags: ["Proposal", "Lighting", "Safety", "Night Audit"],
    likes: 31,
    replies: [
      {
        id: "reply-5-1",
        author: "Olivia Williams",
        date: "2025-03-01",
        content: "This is a great idea. I work late shifts and would be happy to help with the audits. The lighting on my route home is definitely inadequate.",
        likes: 14
      }
    ]
  }
];

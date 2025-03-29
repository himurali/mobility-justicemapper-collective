
import { IssueData, ForumPost } from "@/types/issueData";
import { IssueSeverity } from "@/types";

export const cities = ['All Cities', 'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Bangalore'];

export const mobilityCategories = [
  {
    id: 'active_mobility',
    name: 'Active Mobility',
    subcategories: [
      { id: 'pedestrian_infrastructure', name: '🚶 Pedestrian Infrastructure', description: 'Footpaths, crossings' },
      { id: 'cyclist_facilities', name: '🚴 Cyclist Facilities', description: 'Bike lanes, cycle parking' }
    ]
  },
  {
    id: 'public_transport',
    name: 'Public Transport',
    subcategories: [
      { id: 'public_bus_transport', name: '🚌 Public Bus Transport', description: 'Bus stops, BRT corridors' },
      { id: 'public_metro', name: '🚆 Public Metro', description: 'Stations, last-mile connectivity' }
    ]
  },
  {
    id: 'road_safety',
    name: 'Road Safety & Accessibility',
    subcategories: [
      { id: 'high_risk_intersections', name: '⚠️ High-Risk Intersections', description: 'Accident-prone areas' },
      { id: 'accessibility_issues', name: '♿ Accessibility Issues', description: 'Barriers for disabled people' },
      { id: 'traffic_signal_compliance', name: '🚦 Traffic Signal Compliance', description: 'Zebra crossings, signals' }
    ]
  },
  {
    id: 'environmental',
    name: 'Environmental Factors',
    subcategories: [
      { id: 'green_spaces', name: '🌳 Green Spaces', description: 'Parks, walkable areas' },
      { id: 'pollution_hotspots', name: '🌫️ Pollution Hotspots', description: 'AQI data integration' }
    ]
  }
];

export const mockIssues: IssueData[] = [
  // Bangalore issues
  {
    id: '6',
    title: 'Dangerous Traffic Junction',
    description: 'The junction at MG Road and Brigade Road has no proper traffic signals, causing frequent accidents and near-misses for pedestrians.',
    solution: 'Install proper traffic signals with dedicated pedestrian crossing time and improve visibility with better lighting.',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    city: 'Bangalore',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'MG Road & Brigade Road Junction, Bangalore'
    },
    communityMembers: [
      {
        id: 'user15',
        name: 'Rahul Sharma',
        role: 'Local Resident',
        avatarUrl: ''
      },
      {
        id: 'user16',
        name: 'Priya Patel',
        role: 'Traffic Safety Advocate',
        avatarUrl: ''
      }
    ],
    documents: [
      {
        name: 'Junction Safety Report.pdf',
        url: '#',
        type: 'pdf'
      }
    ],
    tags: ['high_risk_intersections', 'traffic_signal_compliance', 'pedestrian_infrastructure'],
    justiceChampion: {
      id: 'user16',
      name: 'Priya Patel',
      role: 'Traffic Safety Advocate',
      avatarUrl: ''
    },
    createdAt: '2025-02-10T09:30:00Z',
    updatedAt: '2025-02-15T14:20:00Z',
    upvotes: 24,
    downvotes: 3,
    severity: 'critical' as IssueSeverity
  },
  {
    id: '7',
    title: 'Inadequate Cycling Infrastructure',
    description: 'Cubbon Park area lacks dedicated cycling lanes, making it dangerous for cyclists to navigate through heavy traffic.',
    solution: 'Create dedicated cycling lanes around Cubbon Park and connect them to existing cycling infrastructure in the city.',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    city: 'Bangalore',
    location: {
      latitude: 12.9763,
      longitude: 77.5929,
      address: 'Cubbon Park, Bangalore'
    },
    communityMembers: [
      {
        id: 'user17',
        name: 'Vikram Menon',
        role: 'Cycling Club Leader',
        avatarUrl: ''
      },
      {
        id: 'user18',
        name: 'Ananya Reddy',
        role: 'Environmental Activist',
        avatarUrl: ''
      }
    ],
    documents: [],
    tags: ['cyclist_facilities', 'green_spaces', 'road_safety'],
    justiceChampion: {
      id: 'user17',
      name: 'Vikram Menon',
      role: 'Cycling Club Leader',
      avatarUrl: ''
    },
    createdAt: '2025-01-25T11:45:00Z',
    updatedAt: '2025-02-05T10:30:00Z',
    upvotes: 37,
    downvotes: 5,
    severity: 'moderate' as IssueSeverity
  },
  {
    id: '8',
    title: 'Poor Sidewalk Conditions in Indiranagar',
    description: 'Sidewalks on 100 Feet Road in Indiranagar are broken, uneven, and often blocked by parked vehicles, forcing pedestrians to walk on the road.',
    solution: 'Repair sidewalks, enforce no-parking rules, and widen pedestrian paths where possible.',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    city: 'Bangalore',
    location: {
      latitude: 12.9784,
      longitude: 77.6408,
      address: '100 Feet Road, Indiranagar, Bangalore'
    },
    communityMembers: [
      {
        id: 'user19',
        name: 'Deepak Kumar',
        role: 'Local Business Owner',
        avatarUrl: ''
      },
      {
        id: 'user20',
        name: 'Meera Iyer',
        role: 'Urban Planning Consultant',
        avatarUrl: ''
      }
    ],
    documents: [
      {
        name: 'Sidewalk Assessment.pdf',
        url: '#',
        type: 'pdf'
      },
      {
        name: 'Pedestrian Count Data.pdf',
        url: '#',
        type: 'pdf'
      }
    ],
    tags: ['pedestrian_infrastructure', 'accessibility_issues'],
    justiceChampion: {
      id: 'user20',
      name: 'Meera Iyer',
      role: 'Urban Planning Consultant',
      avatarUrl: ''
    },
    createdAt: '2025-03-05T08:15:00Z',
    updatedAt: '2025-03-10T16:40:00Z',
    upvotes: 42,
    downvotes: 8,
    severity: 'critical' as IssueSeverity
  },
  {
    id: '9',
    title: 'Lack of Public Transit in Outer Ring Road',
    description: 'The tech corridor on Outer Ring Road has insufficient public transit options, leading to severe traffic congestion during peak hours.',
    solution: 'Increase frequency of buses, add dedicated bus lanes, and expedite metro construction to this area.',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    city: 'Bangalore',
    location: {
      latitude: 12.9352,
      longitude: 77.6245,
      address: 'Outer Ring Road, Bangalore'
    },
    communityMembers: [
      {
        id: 'user21',
        name: 'Suresh Nair',
        role: 'IT Professional',
        avatarUrl: ''
      },
      {
        id: 'user22',
        name: 'Lakshmi Rao',
        role: 'Public Transit Advocate',
        avatarUrl: ''
      }
    ],
    documents: [
      {
        name: 'Traffic Analysis Report.pdf',
        url: '#',
        type: 'pdf'
      }
    ],
    tags: ['public_bus_transport', 'public_metro', 'pollution_hotspots'],
    justiceChampion: {
      id: 'user22',
      name: 'Lakshmi Rao',
      role: 'Public Transit Advocate',
      avatarUrl: ''
    },
    createdAt: '2025-02-20T13:10:00Z',
    updatedAt: '2025-03-01T09:25:00Z',
    upvotes: 56,
    downvotes: 7,
    severity: 'moderate' as IssueSeverity
  },
  
  // Delhi Issues
  {
    id: '10',
    title: 'Congested Metro Stations',
    description: 'Rajiv Chowk and Kashmere Gate metro stations are severely overcrowded during peak hours, creating safety hazards.',
    solution: 'Implement better crowd management systems and increase the frequency of trains during rush hours.',
    videoUrl: 'https://www.youtube.com/watch?v=delhi1',
    city: 'Delhi',
    location: {
      latitude: 28.6330,
      longitude: 77.2195,
      address: 'Rajiv Chowk Metro Station, Delhi'
    },
    communityMembers: [
      {
        id: 'user23',
        name: 'Amit Singh',
        role: 'Daily Commuter',
        avatarUrl: ''
      },
      {
        id: 'user24',
        name: 'Neha Gupta',
        role: 'Urban Transport Researcher',
        avatarUrl: ''
      }
    ],
    documents: [
      {
        name: 'Crowd Analysis.pdf',
        url: '#',
        type: 'pdf'
      }
    ],
    tags: ['public_metro', 'accessibility_issues'],
    justiceChampion: {
      id: 'user24',
      name: 'Neha Gupta',
      role: 'Urban Transport Researcher',
      avatarUrl: ''
    },
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-01-20T16:45:00Z',
    upvotes: 87,
    downvotes: 5,
    severity: 'critical' as IssueSeverity
  },
  {
    id: '11',
    title: 'Air Pollution at Major Intersections',
    description: 'ITO and Connaught Place intersections have dangerously high levels of air pollution affecting pedestrians and street vendors.',
    solution: 'Install air purifiers at major intersections and implement vehicle pollution checks more strictly.',
    videoUrl: 'https://www.youtube.com/watch?v=delhi2',
    city: 'Delhi',
    location: {
      latitude: 28.6292,
      longitude: 77.2410,
      address: 'ITO Crossing, Delhi'
    },
    communityMembers: [
      {
        id: 'user25',
        name: 'Dr. Rajesh Mehta',
        role: 'Environmental Health Expert',
        avatarUrl: ''
      }
    ],
    documents: [
      {
        name: 'Air Quality Report.pdf',
        url: '#',
        type: 'pdf'
      }
    ],
    tags: ['pollution_hotspots', 'pedestrian_infrastructure'],
    justiceChampion: {
      id: 'user25',
      name: 'Dr. Rajesh Mehta',
      role: 'Environmental Health Expert',
      avatarUrl: ''
    },
    createdAt: '2025-03-01T10:20:00Z',
    updatedAt: '2025-03-15T09:10:00Z',
    upvotes: 103,
    downvotes: 12,
    severity: 'critical' as IssueSeverity
  },
  {
    id: '12',
    title: 'Lack of Cycling Infrastructure in Central Delhi',
    description: 'Central Delhi lacks safe cycling lanes, discouraging eco-friendly commuting options.',
    solution: 'Develop dedicated cycling lanes connecting major landmarks and residential areas in Central Delhi.',
    videoUrl: 'https://www.youtube.com/watch?v=delhi3',
    city: 'Delhi',
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'Central Delhi, New Delhi'
    },
    communityMembers: [
      {
        id: 'user26',
        name: 'Sanjay Verma',
        role: 'Cycling Advocate',
        avatarUrl: ''
      }
    ],
    documents: [],
    tags: ['cyclist_facilities', 'green_spaces'],
    justiceChampion: {
      id: 'user26',
      name: 'Sanjay Verma',
      role: 'Cycling Advocate',
      avatarUrl: ''
    },
    createdAt: '2025-02-05T14:50:00Z',
    updatedAt: '2025-02-20T11:30:00Z',
    upvotes: 45,
    downvotes: 8,
    severity: 'moderate' as IssueSeverity
  },
  
  // Mumbai Issues
  {
    id: '13',
    title: 'Overcrowded Local Trains',
    description: 'Mumbai local trains are dangerously overcrowded, especially on the Western and Central lines during peak hours.',
    solution: 'Increase train frequency and implement better crowd management systems at major stations.',
    videoUrl: 'https://www.youtube.com/watch?v=mumbai1',
    city: 'Mumbai',
    location: {
      latitude: 19.0821,
      longitude: 72.8416,
      address: 'Dadar Station, Mumbai'
    },
    communityMembers: [
      {
        id: 'user27',
        name: 'Prakash Joshi',
        role: 'Railway Safety Activist',
        avatarUrl: ''
      }
    ],
    documents: [
      {
        name: 'Railway Safety Audit.pdf',
        url: '#',
        type: 'pdf'
      }
    ],
    tags: ['public_metro', 'accessibility_issues'],
    justiceChampion: {
      id: 'user27',
      name: 'Prakash Joshi',
      role: 'Railway Safety Activist',
      avatarUrl: ''
    },
    createdAt: '2025-01-10T09:15:00Z',
    updatedAt: '2025-01-25T16:40:00Z',
    upvotes: 119,
    downvotes: 7,
    severity: 'critical' as IssueSeverity
  },
  {
    id: '14',
    title: 'Flooding on Major Roads',
    description: 'Several major roads in Mumbai, including S.V. Road and LBS Marg, regularly flood during monsoon season, disrupting transportation.',
    solution: 'Improve drainage systems and implement better water management protocols during heavy rainfall.',
    videoUrl: 'https://www.youtube.com/watch?v=mumbai2',
    city: 'Mumbai',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'S.V. Road, Mumbai'
    },
    communityMembers: [
      {
        id: 'user28',
        name: 'Anjali Patil',
        role: 'Urban Infrastructure Specialist',
        avatarUrl: ''
      }
    ],
    documents: [],
    tags: ['pedestrian_infrastructure', 'high_risk_intersections'],
    justiceChampion: {
      id: 'user28',
      name: 'Anjali Patil',
      role: 'Urban Infrastructure Specialist',
      avatarUrl: ''
    },
    createdAt: '2025-03-05T11:30:00Z',
    updatedAt: '2025-03-20T09:45:00Z',
    upvotes: 81,
    downvotes: 5,
    severity: 'critical' as IssueSeverity
  },
  {
    id: '15',
    title: 'Inadequate Pedestrian Bridges',
    description: 'Pedestrian bridges at key locations like Bandra and Andheri are insufficient for the volume of pedestrians, causing safety concerns.',
    solution: 'Widen existing foot-over bridges and construct additional pedestrian crossings at high-traffic areas.',
    videoUrl: 'https://www.youtube.com/watch?v=mumbai3',
    city: 'Mumbai',
    location: {
      latitude: 19.0596,
      longitude: 72.8295,
      address: 'Bandra Station, Mumbai'
    },
    communityMembers: [
      {
        id: 'user29',
        name: 'Rohan Desai',
        role: 'Pedestrian Safety Advocate',
        avatarUrl: ''
      }
    ],
    documents: [
      {
        name: 'Pedestrian Flow Analysis.pdf',
        url: '#',
        type: 'pdf'
      }
    ],
    tags: ['pedestrian_infrastructure', 'accessibility_issues'],
    justiceChampion: {
      id: 'user29',
      name: 'Rohan Desai',
      role: 'Pedestrian Safety Advocate',
      avatarUrl: ''
    },
    createdAt: '2025-02-15T13:20:00Z',
    updatedAt: '2025-03-01T10:15:00Z',
    upvotes: 63,
    downvotes: 9,
    severity: 'moderate' as IssueSeverity
  },
  
  // Chennai Issues
  {
    id: '16',
    title: 'Poor Road Conditions in T. Nagar',
    description: 'T. Nagar, a major commercial area, has deteriorating road conditions with potholes and uneven surfaces.',
    solution: 'Implement regular road maintenance schedule and use higher quality materials for road construction.',
    videoUrl: 'https://www.youtube.com/watch?v=chennai1',
    city: 'Chennai',
    location: {
      latitude: 13.0418,
      longitude: 80.2341,
      address: 'T. Nagar, Chennai'
    },
    communityMembers: [
      {
        id: 'user30',
        name: 'Karthik Raman',
        role: 'Local Business Association Leader',
        avatarUrl: ''
      }
    ],
    documents: [],
    tags: ['pedestrian_infrastructure', 'accessibility_issues'],
    justiceChampion: {
      id: 'user30',
      name: 'Karthik Raman',
      role: 'Local Business Association Leader',
      avatarUrl: ''
    },
    createdAt: '2025-01-20T10:45:00Z',
    updatedAt: '2025-02-05T15:30:00Z',
    upvotes: 53,
    downvotes: 7,
    severity: 'moderate' as IssueSeverity
  },
  {
    id: '17',
    title: 'Insufficient Bus Services to Suburbs',
    description: 'Chennai suburbs like Tambaram and Chromepet have inadequate bus services, especially during non-peak hours.',
    solution: 'Increase bus frequency to suburbs and introduce mini-buses for better connectivity to metro stations.',
    videoUrl: 'https://www.youtube.com/watch?v=chennai2',
    city: 'Chennai',
    location: {
      latitude: 12.9247,
      longitude: 80.1252,
      address: 'Tambaram, Chennai'
    },
    communityMembers: [
      {
        id: 'user31',
        name: 'Priya Sundaram',
        role: 'Public Transport User Group Representative',
        avatarUrl: ''
      }
    ],
    documents: [
      {
        name: 'Suburban Connectivity Report.pdf',
        url: '#',
        type: 'pdf'
      }
    ],
    tags: ['public_bus_transport', 'public_metro'],
    justiceChampion: {
      id: 'user31',
      name: 'Priya Sundaram',
      role: 'Public Transport User Group Representative',
      avatarUrl: ''
    },
    createdAt: '2025-02-25T09:10:00Z',
    updatedAt: '2025-03-10T14:25:00Z',
    upvotes: 74,
    downvotes: 6,
    severity: 'critical' as IssueSeverity
  },
  {
    id: '18',
    title: 'Lack of Cycling Lanes Along East Coast Road',
    description: 'East Coast Road, a scenic route, lacks dedicated cycling lanes despite being popular among recreational cyclists.',
    solution: 'Develop dedicated cycling tracks along East Coast Road with proper safety barriers from motorized traffic.',
    videoUrl: 'https://www.youtube.com/watch?v=chennai3',
    city: 'Chennai',
    location: {
      latitude: 12.9850,
      longitude: 80.2707,
      address: 'East Coast Road, Chennai'
    },
    communityMembers: [
      {
        id: 'user32',
        name: 'Venkat Krishnan',
        role: 'Cycling Club Coordinator',
        avatarUrl: ''
      }
    ],
    documents: [],
    tags: ['cyclist_facilities', 'green_spaces'],
    justiceChampion: {
      id: 'user32',
      name: 'Venkat Krishnan',
      role: 'Cycling Club Coordinator',
      avatarUrl: ''
    },
    createdAt: '2025-03-01T11:20:00Z',
    updatedAt: '2025-03-15T10:05:00Z',
    upvotes: 47,
    downvotes: 5,
    severity: 'minor' as IssueSeverity
  }
];

export const mockForumPosts: ForumPost[] = [
  {
    id: "forum-1",
    issueId: "6",
    title: "Monthly Community Meeting - Bangalore Traffic Safety",
    author: "Rahul Sharma",
    date: "2025-03-10",
    content: "I'd like to invite everyone to our monthly community meeting where we'll discuss the progress on MG Road junction improvements. We'll review the city's response to our collective feedback and plan next steps.",
    tags: ["Meeting", "Traffic Safety", "Infrastructure"],
    likes: 24,
    replies: [
      {
        id: "reply-1-1",
        author: "Priya Patel",
        date: "2025-03-10",
        content: "I'll be there! I've documented several problematic intersections that we should discuss.",
        likes: 8
      },
      {
        id: "reply-1-2",
        author: "Arun Kumar",
        date: "2025-03-11",
        content: "Can we also discuss the new pedestrian crossing proposal for Brigade Road? I have some concerns about the current design.",
        likes: 12
      }
    ]
  },
  {
    id: "forum-2",
    issueId: "7",
    title: "Action Plan for Improving Cycling Infrastructure in Cubbon Park",
    author: "Vikram Menon",
    date: "2025-03-08",
    content: "After our survey of Cubbon Park area, I've drafted an action plan for improving cycling infrastructure. The document includes prioritized improvements, estimated costs, and potential funding sources. I'd appreciate everyone's feedback before we present this to the city council.",
    tags: ["Action Plan", "Cycling", "Infrastructure", "Cubbon Park"],
    likes: 37,
    replies: [
      {
        id: "reply-2-1",
        author: "Ananya Reddy",
        date: "2025-03-09",
        content: "This is excellent work, Vikram! I've reviewed the document and added some comments about the environmental benefits we should highlight.",
        likes: 15
      }
    ]
  },
  {
    id: "forum-3",
    issueId: "8",
    title: "Volunteer Group for Sidewalk Condition Documentation in Indiranagar",
    author: "Deepak Kumar",
    date: "2025-03-05",
    content: "I'm organizing a volunteer group to systematically document sidewalk conditions in Indiranagar. We'll use the app to record issues and create a comprehensive report. Looking for 10-15 volunteers who can commit to covering specific areas over the next two weekends.",
    tags: ["Volunteer", "Sidewalks", "Documentation", "Indiranagar"],
    likes: 19,
    replies: [
      {
        id: "reply-3-1",
        author: "Meera Iyer",
        date: "2025-03-06",
        content: "I can help coordinate the documentation effort and provide urban planning expertise to categorize the issues properly.",
        likes: 7
      },
      {
        id: "reply-3-2",
        author: "Rajesh Singh",
        date: "2025-03-06",
        content: "Count me in for the 12th Main Road area. I can bring my measuring tools to document exact dimensions of problematic spots.",
        likes: 9
      },
      {
        id: "reply-3-3",
        author: "Sunitha Rao",
        date: "2025-03-07",
        content: "I'll volunteer for 100 Feet Road section. I use a wheelchair and can provide valuable perspective on accessibility issues.",
        likes: 21
      }
    ]
  },
  {
    id: "forum-4",
    issueId: "9",
    title: "Update on BBMP Meeting - Public Transit Initiatives for ORR",
    author: "Lakshmi Rao",
    date: "2025-03-01",
    content: "I attended yesterday's BBMP meeting where our public transit proposals for Outer Ring Road were discussed. The council was receptive to our data-driven approach and has agreed to allocate funding for increased bus frequency during peak hours. They've requested more detailed information on our other recommendations.",
    tags: ["Update", "Public Transit", "BBMP", "Outer Ring Road"],
    likes: 42,
    replies: [
      {
        id: "reply-4-1",
        author: "Suresh Nair",
        date: "2025-03-01",
        content: "This is great news! Thanks for representing us, Lakshmi. I can help prepare the additional information they requested about commuter patterns.",
        likes: 11
      },
      {
        id: "reply-4-2",
        author: "Kavita Menon",
        date: "2025-03-02",
        content: "Did they mention any timeline for the bus frequency improvements? We should follow up to ensure this doesn't get delayed.",
        likes: 8
      }
    ]
  }
];

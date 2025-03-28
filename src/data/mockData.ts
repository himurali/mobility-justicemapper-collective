
import { City, IssueReport } from "@/types";

export const cities: City[] = [
  {
    id: "nyc",
    name: "New York City",
    coordinates: [-74.006, 40.7128],
    zoom: 11,
  },
  {
    id: "sf",
    name: "San Francisco",
    coordinates: [-122.4194, 37.7749],
    zoom: 12,
  },
  {
    id: "chicago",
    name: "Chicago",
    coordinates: [-87.6298, 41.8781],
    zoom: 11,
  },
  {
    id: "la",
    name: "Los Angeles",
    coordinates: [-118.2437, 34.0522],
    zoom: 10,
  },
];

export const mockIssues: IssueReport[] = [
  {
    id: "1",
    title: "Broken bike lane on Main Street",
    description:
      "The bike lane on Main Street between 5th and 7th Ave has large potholes making it dangerous to cycle.",
    category: "cycling",
    severity: "high",
    location: {
      latitude: 40.7128,
      longitude: -73.999,
      address: "Main St between 5th and 7th Ave",
    },
    images: [
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop",
    ],
    date: "2023-09-15T14:30:00Z",
    user: {
      id: "user1",
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=user1",
    },
    upvotes: 24,
    comments: [
      {
        id: "c1",
        text: "I ride here daily and it's becoming increasingly dangerous. Someone is going to get hurt.",
        date: "2023-09-16T10:15:00Z",
        user: {
          id: "user2",
          name: "Sam Rivera",
          avatar: "https://i.pravatar.cc/150?u=user2",
        },
      },
      {
        id: "c2",
        text: "I've reported this to the city twice already. No response.",
        date: "2023-09-17T09:22:00Z",
        user: {
          id: "user3",
          name: "Taylor Kim",
          avatar: "https://i.pravatar.cc/150?u=user3",
        },
      },
    ],
    status: "open",
  },
  {
    id: "2",
    title: "No wheelchair access at Central Station",
    description:
      "The east entrance to Central Station has no wheelchair ramp, making it inaccessible for people with mobility issues.",
    category: "accessibility",
    severity: "high",
    location: {
      latitude: 40.7158,
      longitude: -74.004,
      address: "Central Station, East Entrance",
    },
    images: [
      "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=800&h=600&fit=crop",
    ],
    date: "2023-09-10T09:15:00Z",
    user: {
      id: "user4",
      name: "Jordan Lee",
      avatar: "https://i.pravatar.cc/150?u=user4",
    },
    upvotes: 42,
    comments: [
      {
        id: "c3",
        text: "This affects me every day. I have to take a 15-minute detour to use the north entrance.",
        date: "2023-09-11T16:40:00Z",
        user: {
          id: "user5",
          name: "Casey Morgan",
          avatar: "https://i.pravatar.cc/150?u=user5",
        },
      },
    ],
    status: "in_progress",
  },
  {
    id: "3",
    title: "Dangerous pedestrian crossing",
    description:
      "The crossing at Oak and Pine has a very short signal, insufficient for elderly people to cross safely.",
    category: "safety",
    severity: "medium",
    location: {
      latitude: 40.7098,
      longitude: -74.001,
      address: "Intersection of Oak St and Pine Ave",
    },
    images: [
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
    ],
    date: "2023-09-05T11:20:00Z",
    user: {
      id: "user6",
      name: "Robin Chen",
      avatar: "https://i.pravatar.cc/150?u=user6",
    },
    upvotes: 17,
    comments: [
      {
        id: "c4",
        text: "My grandmother lives nearby and won't go out alone because of this crossing.",
        date: "2023-09-07T14:10:00Z",
        user: {
          id: "user7",
          name: "Parker Williams",
          avatar: "https://i.pravatar.cc/150?u=user7",
        },
      },
    ],
    status: "open",
  },
  {
    id: "4",
    title: "Bus shelter removed",
    description:
      "The bus shelter at Green Street stop was removed two months ago and has not been replaced. Passengers have no protection from weather.",
    category: "public_transport",
    severity: "medium",
    location: {
      latitude: 40.7148,
      longitude: -73.996,
      address: "Green Street Bus Stop",
    },
    images: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
    ],
    date: "2023-08-28T08:45:00Z",
    user: {
      id: "user8",
      name: "Quinn Taylor",
      avatar: "https://i.pravatar.cc/150?u=user8",
    },
    upvotes: 9,
    comments: [],
    status: "open",
  },
  {
    id: "5",
    title: "Traffic light timing issue",
    description:
      "The traffic light at the corner of Market and State stays green for only 10 seconds, causing congestion.",
    category: "traffic",
    severity: "low",
    location: {
      latitude: 40.7138,
      longitude: -74.008,
      address: "Market St and State Ave intersection",
    },
    images: [
      "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=600&fit=crop",
    ],
    date: "2023-09-01T17:30:00Z",
    user: {
      id: "user9",
      name: "Dakota Smith",
      avatar: "https://i.pravatar.cc/150?u=user9",
    },
    upvotes: 12,
    comments: [],
    status: "open",
  },
  {
    id: "6",
    title: "Narrow sidewalk with obstacles",
    description:
      "The sidewalk on Elm Street is too narrow and has lampposts right in the middle, blocking passage for strollers and wheelchairs.",
    category: "sidewalks",
    severity: "medium",
    location: {
      latitude: 40.7108,
      longitude: -73.992,
      address: "Elm Street between 10th and 12th",
    },
    images: [
      "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=800&h=600&fit=crop",
    ],
    date: "2023-09-18T13:15:00Z",
    user: {
      id: "user10",
      name: "Morgan Rivera",
      avatar: "https://i.pravatar.cc/150?u=user10",
    },
    upvotes: 7,
    comments: [],
    status: "open",
  },
];

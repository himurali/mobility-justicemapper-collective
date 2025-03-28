
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  type: 'workshop' | 'meetup' | 'audit' | 'advocacy';
  participants: {
    count: number;
    max?: number;
  };
  isRegistered: boolean;
}

interface CommunityEventsProps {
  events: Event[];
}

export const CommunityEvents: React.FC<CommunityEventsProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'meetup':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'audit':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'advocacy':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Filter events by type
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const myEvents = events.filter(e => e.isRegistered);
  
  return (
    <div>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center min-w-[80px]">
                    <div className="text-2xl font-bold">{formatEventDate(event.date).split(' ')[2]}</div>
                    <div className="text-sm">{formatEventDate(event.date).split(' ')[1]}</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant={event.isRegistered ? "outline" : "default"}
                            onClick={() => setSelectedEvent(event)}
                          >
                            {event.isRegistered ? 'Registered' : 'Join Event'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {selectedEvent && (
                            <>
                              <DialogHeader>
                                <DialogTitle>{selectedEvent.title}</DialogTitle>
                                <DialogDescription>
                                  {selectedEvent.description}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedEvent.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{formatEventDate(selectedEvent.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedEvent.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {selectedEvent.participants.count} 
                                    {selectedEvent.participants.max ? 
                                      ` / ${selectedEvent.participants.max} participants` : 
                                      ' participants'}
                                  </span>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Add to Calendar</Button>
                                <Button>
                                  {selectedEvent.isRegistered ? 'Cancel Registration' : 'Register Now'}
                                </Button>
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="mt-2 text-sm text-muted-foreground">{event.description}</div>
                    
                    <div className="mt-2 flex flex-wrap gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mr-4">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1 mr-4">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                          {event.participants.count} 
                          {event.participants.max ? ` / ${event.participants.max}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="my-events" className="space-y-4 mt-4">
          {myEvents.length > 0 ? (
            myEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-md text-center min-w-[80px]">
                      <div className="text-2xl font-bold">{formatEventDate(event.date).split(' ')[2]}</div>
                      <div className="text-sm">{formatEventDate(event.date).split(' ')[1]}</div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                      
                      <div className="mt-2 flex flex-wrap gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mr-4">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1 mr-4">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't registered for any events yet.</p>
              <Button variant="outline" className="mt-2">Browse Upcoming Events</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-center">
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Create New Community Event
        </Button>
      </div>
    </div>
  );
};

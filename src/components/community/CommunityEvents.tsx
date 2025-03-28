
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/types';

interface CommunityEventsProps {
  events: Event[];
}

export const CommunityEvents: React.FC<CommunityEventsProps> = ({ events }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Community Events</h3>
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <div className="text-lg font-bold">
                    {event.date ? format(new Date(event.date), 'dd') : 'TBD'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {event.date ? format(new Date(event.date), 'MMM yyyy') : ''}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{event.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description || 'No description available'}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.time || format(new Date(event.date), 'h:mm a')}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      {event.attendees} attendees
                    </div>
                    {event.type && (
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="md:w-1/6 flex flex-col items-center justify-center gap-2">
                  <Badge className={event.isRegistered ? "bg-green-500" : "bg-blue-500"} variant="secondary">
                    {event.isRegistered ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Registered
                      </span>
                    ) : "Register"}
                  </Badge>
                  <div className="text-sm text-muted-foreground text-center">
                    Role: {event.role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

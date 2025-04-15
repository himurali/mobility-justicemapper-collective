
import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MapPin } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface IssueFormData {
  issue_title: string;
  issue_desc: string;
  latitude_of_issue: number;
  longitude_of_issue: number;
  tags: string[];
}

const ReportInjustice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const marker = React.useRef<mapboxgl.Marker | null>(null);

  const form = useForm<IssueFormData>({
    defaultValues: {
      issue_title: "",
      issue_desc: "",
      tags: [],
    },
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
      toast({
        title: "Authentication required",
        description: "Please sign in to report an issue",
        variant: "destructive",
      });
    }
  }, [user, navigate]);

  React.useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.5946, 12.9716], // Default to Bangalore
      zoom: 12
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create a marker
    marker.current = new mapboxgl.Marker({
      draggable: true
    });

    // Click on map to set marker
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setLocation({ lng, lat });
      form.setValue('latitude_of_issue', lat);
      form.setValue('longitude_of_issue', lng);
      
      marker.current?.setLngLat([lng, lat]).addTo(map.current!);
    });

    // Handle marker drag end
    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        setLocation({ lng: lngLat.lng, lat: lngLat.lat });
        form.setValue('latitude_of_issue', lngLat.lat);
        form.setValue('longitude_of_issue', lngLat.lng);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          form.setValue('latitude_of_issue', latitude);
          form.setValue('longitude_of_issue', longitude);
          
          // Update map and marker
          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 14
          });
          
          marker.current?.setLngLat([longitude, latitude]).addTo(map.current!);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get your current location. Please try again.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const onSubmit = async (data: IssueFormData) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to report an issue",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('JusticeIssue')
        .insert([
          {
            ...data,
            user_id: user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your issue has been reported successfully",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to report issue",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Report an Injustice</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="issue_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter issue title" {...field} />
                </FormControl>
                <FormDescription>
                  Provide a clear and concise title for the issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issue_desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the injustice issue in detail" 
                    className="min-h-[150px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Provide detailed information about the issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                type="button"
                onClick={getCurrentLocation}
                variant="outline"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Get Current Location
              </Button>
              {location && (
                <span className="text-sm text-muted-foreground">
                  Location set: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </span>
              )}
            </div>
            
            <div 
              ref={mapContainer} 
              className="w-full h-[300px] rounded-lg border border-gray-200 shadow-sm"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Report
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReportInjustice;

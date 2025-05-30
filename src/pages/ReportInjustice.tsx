import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import CitySelector from "@/components/CitySelector";
import { City } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageIcon, MapPin } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const DEFAULT_MAPBOX_TOKEN = 'pk.eyJ1IjoibXVyYWxpaHIiLCJhIjoiYXNJRUtZNCJ9.qCHETqk-pqaoRaK4e_VcvQ';

interface IssueFormData {
  issue_title: string;
  issue_desc: string;
  latitude_of_issue: number;
  longitude_of_issue: number;
  tags: string[];
  issue_video_problem_statement: string;
  solution_of_issue: string;
  doclink1_of_issue: string;
  doclink2_of_issue: string;
  city: string;
  image_url?: string;
}

const cities: City[] = [
  { id: "Bangalore", name: "Bangalore", coordinates: [77.5946, 12.9716], zoom: 12 },
  { id: "Mumbai", name: "Mumbai", coordinates: [72.8777, 19.0760], zoom: 12 },
  { id: "Delhi", name: "Delhi", coordinates: [77.2090, 28.6139], zoom: 12 },
  { id: "Chennai", name: "Chennai", coordinates: [80.2707, 13.0827], zoom: 12 }
];

const ReportInjustice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const marker = React.useRef<mapboxgl.Marker | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(DEFAULT_MAPBOX_TOKEN);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);

  const form = useForm<IssueFormData>({
    defaultValues: {
      issue_title: "",
      issue_desc: "",
      tags: [],
      issue_video_problem_statement: "",
      solution_of_issue: "",
      doclink1_of_issue: "",
      doclink2_of_issue: "",
      city: cities[0].id,
      image_url: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      toast({
        title: "Authentication required",
        description: "Please sign in to report an issue",
        variant: "destructive",
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: selectedCity.coordinates, 
        zoom: selectedCity.zoom
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      marker.current = new mapboxgl.Marker({
        draggable: true
      });

      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setLocation({ lng, lat });
        form.setValue('latitude_of_issue', lat);
        form.setValue('longitude_of_issue', lng);
        
        marker.current?.setLngLat([lng, lat]).addTo(map.current!);
      });

      map.current.on('error', (e) => {
        console.error("Mapbox error:", e);
        if (e.error.message.includes('access token')) {
          setTokenError("Invalid Mapbox access token. Please provide a valid token.");
          setShowTokenInput(true);
        }
      });

      if (marker.current) {
        marker.current.on('dragend', () => {
          const lngLat = marker.current?.getLngLat();
          if (lngLat) {
            setLocation({ lng: lngLat.lng, lat: lngLat.lat });
            form.setValue('latitude_of_issue', lngLat.lat);
            form.setValue('longitude_of_issue', lngLat.lng);
          }
        });
      }
    } catch (error: any) {
      console.error("Error initializing map:", error);
      if (error.message && error.message.includes('access token')) {
        setTokenError("A valid Mapbox access token is required");
        setShowTokenInput(true);
      }
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, selectedCity]);

  const handleTokenChange = (newToken: string) => {
    setMapboxToken(newToken);
    localStorage.setItem('mapbox_token', newToken);
    setTokenError(null);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          form.setValue('latitude_of_issue', latitude);
          form.setValue('longitude_of_issue', longitude);
          
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

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('image_url', url);
    setImagePreview(url);
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

      console.log("Submitting form with data:", data);

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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <CitySelector
                    cities={cities}
                    selectedCity={selectedCity}
                    onSelectCity={(city) => {
                      setSelectedCity(city);
                      field.onChange(city.id);
                      if (map.current) {
                        map.current.flyTo({
                          center: city.coordinates,
                          zoom: city.zoom
                        });
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Select the city where the issue is located
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="issue_video_problem_statement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Video Link</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter YouTube video URL showing the issue" 
                    type="url"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Add a YouTube video link that demonstrates the issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="solution_of_issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solution Video Link</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter YouTube video URL explaining the solution" 
                    type="url"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Add a YouTube video link that explains your proposed solution
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doclink1_of_issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Link 1</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter URL for supporting document" 
                    type="url"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Add a link to any supporting documentation (e.g., PDF, images)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doclink2_of_issue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Link 2</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter URL for additional supporting document" 
                    type="url"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Add another link to supporting documentation if needed
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
            
            <div className="relative">
              {tokenError && showTokenInput && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 p-6">
                  <div className="w-full space-y-4 bg-card p-6 shadow-lg rounded-lg">
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{tokenError}</AlertDescription>
                    </Alert>
                    <p className="text-sm">
                      Please provide your Mapbox access token. You can get one by signing up at{" "}
                      <a 
                        href="https://mapbox.com/signup" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        mapbox.com
                      </a>.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter your Mapbox token"
                        value={mapboxToken}
                        onChange={(e) => setMapboxToken(e.target.value)}
                      />
                      <Button onClick={() => handleTokenChange(mapboxToken)}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div 
                ref={mapContainer} 
                className="w-full h-[300px] rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Image URL</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Enter URL for issue image" 
                      type="url"
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleImageUrlChange(e);
                      }}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">Image Preview:</p>
                        <img 
                          src={imagePreview} 
                          alt="Issue preview" 
                          className="w-full max-h-60 object-contain rounded border border-gray-200" 
                          onError={() => setImagePreview(null)}
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Provide a URL to an image that illustrates the issue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Report
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReportInjustice;

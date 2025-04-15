
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

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          form.setValue('latitude_of_issue', position.coords.latitude);
          form.setValue('longitude_of_issue', position.coords.longitude);
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

          <Button type="submit" className="w-full">
            Submit Report
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ReportInjustice;

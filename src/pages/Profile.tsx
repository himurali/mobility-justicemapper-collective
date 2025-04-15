
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { Home, User, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
});

const Profile: React.FC = () => {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || '',
    },
  });
  
  // Update form when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile, form]);
  
  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // File size validation (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Avatar image must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
    try {
      // Check if Storage bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error("Error checking buckets:", bucketsError);
        throw new Error("Error checking storage buckets");
      }
      
      // Make sure 'avatars' bucket exists
      const avatarsBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarsBucketExists) {
        toast({
          title: 'Storage not configured',
          description: 'Avatar storage is not properly configured',
          variant: 'destructive',
        });
        console.error("Avatars bucket does not exist");
        return null;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
      
      // Upload with progress tracking
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          }
        });
        
      if (error) {
        console.error("Upload error details:", error);
        throw error;
      }
      
      // Get public URL after successful upload
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({
        title: 'Error uploading avatar',
        description: error.message || "Failed to upload avatar",
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadProgress(0); // Reset progress
    }
  };
  
  const handleSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      let avatarUrl = values.avatar_url;
      
      // Upload new avatar if selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(user.id, avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          // If avatar upload failed but other profile info is valid, continue
          toast({
            title: 'Warning',
            description: 'Profile updated but avatar upload failed',
            variant: 'default',
          });
        }
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          full_name: values.full_name,
          bio: values.bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
      // Refresh profile data
      await refreshProfile();
      setAvatarFile(null); // Clear selected file
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: 'Error updating profile',
        description: error.message || "Failed to update profile",
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 container mx-auto py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-purple-600">Your Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
            </div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update your profile information visible to other users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                          <div className="flex flex-col items-center gap-3">
                            <Avatar className="w-24 h-24">
                              <AvatarImage src={avatarPreview || profile?.avatar_url} />
                              <AvatarFallback className="text-2xl bg-purple-100 text-purple-800">
                                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="w-full max-w-[240px]">
                              <Input 
                                type="file" 
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="mb-2"
                              />
                              <FormDescription className="text-center text-xs mb-2">
                                JPG, PNG or GIF, Max 2MB
                              </FormDescription>
                              
                              {uploadProgress > 0 && (
                                <div className="w-full space-y-2">
                                  <Progress value={uploadProgress} className="h-2" />
                                  <p className="text-xs text-center">{Math.round(uploadProgress)}% uploaded</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="username" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Your unique username on the platform
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="full_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Jane Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Tell us about yourself..." 
                                      className="resize-none min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            className="bg-purple-700 hover:bg-purple-800"
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account and authentication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Email Address</h3>
                      <p className="text-gray-500 mb-2">{user?.email}</p>
                      <Button variant="outline" size="sm" disabled>
                        Change Email
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Password</h3>
                      <p className="text-gray-500 mb-2">Reset or change your password</p>
                      <Button variant="outline" size="sm" disabled>
                        Change Password
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                      <p className="text-gray-500 mb-4">Permanently log out from all devices</p>
                      <Button 
                        variant="destructive" 
                        onClick={signOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;

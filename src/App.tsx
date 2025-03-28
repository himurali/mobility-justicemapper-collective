
import React from 'react'; // Make sure React is explicitly imported
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CommunityProfile from "./pages/CommunityProfile";

// Create QueryClient outside of component to avoid re-instantiation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<div>About page (coming soon)</div>} />
              <Route path="/resources" element={<div>Resources page (coming soon)</div>} />
              <Route path="/register" element={<div>Register page (coming soon)</div>} />
              <Route path="/signin" element={<div>Sign In page (coming soon)</div>} />
              <Route path="/video" element={<div>Video page (coming soon)</div>} />
              <Route path="/solution" element={<div>Solution page (coming soon)</div>} />
              <Route path="/community" element={<div>Community page (coming soon)</div>} />
              <Route path="/forum" element={<div>Forum page (coming soon)</div>} />
              <Route path="/documents" element={<div>Documents page (coming soon)</div>} />
              <Route path="/issues/:issueId" element={<div>Issue Details page (coming soon)</div>} />
              <Route path="/community/profile/:userId" element={<CommunityProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

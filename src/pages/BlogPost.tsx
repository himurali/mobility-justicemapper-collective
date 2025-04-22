
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MarkdownBlogPost from "../components/blog/MarkdownBlogPost";
import { loadBlogPost } from "../utils/markdownLoader";
import Header from "@/components/Header";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => loadBlogPost(slug || '')
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse">Loading post...</div>
      </div>
    </div>
  );
  
  if (error || !data) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Blog Post Not Found</h2>
        <p className="text-gray-600">The blog post you're looking for could not be loaded.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarkdownBlogPost metadata={data.metadata} content={data.content} />
    </div>
  );
}

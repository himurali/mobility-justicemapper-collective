
import React from "react";
import { useQuery } from "@tanstack/react-query";
import MarkdownBlogPost from "../../components/blog/MarkdownBlogPost";
import { loadBlogPost } from "../../utils/markdownLoader";
import Header from "@/components/Header";

export default function LetGodInYourHeartAndSoul() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogPost', 'let-god-in-your-heart-and-soul'],
    queryFn: () => loadBlogPost('let-god-in-your-heart-and-soul')
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Post not found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MarkdownBlogPost metadata={data.metadata} content={data.content} />
    </div>
  );
}

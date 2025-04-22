import React, { useState } from "react";
import Container from "@/components/UI/Container";
import { Calendar, Book, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const categories = [
  { name: "All", key: "all" },
  { name: "Mobility & Justice", key: "mobility" },
  { name: "Wellness", key: "wellness" },
  { name: "Community", key: "community" },
  { name: "Technology", key: "technology" },
];

const blogPosts = [
  {
    id: "1",
    title: "Let God in your Heart and Soul",
    summary: "Discover the transformative power of faith and the profound impact it can have on your journey through urban mobility justice. Learn how spiritual connections can help navigate challenges.",
    author: "Jane Doe",
    authorAvatar: "/placeholder.svg",
    date: "February 2, 2023",
    readTime: "9 min",
    image: "/lovable-uploads/24ac4175-f301-47ad-9ace-3dba49cfa75f.png",
    category: "wellness",
    slug: "let-god-in-your-heart-and-soul",
  },
  {
    id: "2",
    title: "Finding Peace in Urban Mobility",
    summary: "Explore how mindfulness and spiritual awareness can transform your daily commute. Discover practical strategies for maintaining inner peace while navigating transportation challenges.",
    author: "John Smith",
    authorAvatar: "/placeholder.svg",
    date: "March 15, 2023",
    readTime: "7 min",
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=640&q=80",
    category: "mobility",
    slug: "finding-peace-in-urban-mobility",
  },
  {
    id: "3",
    title: "Community and Connection",
    summary: "Learn how building stronger community bonds can lead to more equitable transportation solutions. Discover inspiring stories of neighborhoods coming together to create positive change.",
    author: "Priya Mehra",
    authorAvatar: "/placeholder.svg",
    date: "April 1, 2023",
    readTime: "5 min",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?w=640&q=80",
    category: "community",
    slug: "community-and-connection",
  }
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts = selectedCategory === "all"
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Container>
        <div className="max-w-4xl mx-auto pt-14 pb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold pb-1 tracking-tight">
            Latest from Our <span className="text-purple-600">Blog</span>
          </h1>
          <p className="text-lg text-gray-600 pb-6">
            Insights, stories, and perspectives on urban mobility justice.
          </p>
          
          <div className="flex flex-wrap gap-2 md:gap-4 mt-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition 
                ${selectedCategory === cat.key ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-purple-50"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1"
            >
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-gray-500 text-sm mb-1">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <span className="mx-1">•</span>
                  <div className="flex items-center">
                    <Book size={14} className="mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h2 className="font-bold text-lg mb-1 text-gray-900">{post.title}</h2>
                <p className="text-gray-700 text-sm mb-3 flex-1">{post.summary}</p>
                <div className="flex items-center mb-3">
                  <User size={16} className="text-gray-400 mr-1" />
                  <span className="text-gray-600">{post.author}</span>
                </div>
                <Link to={`/blog/${post.slug}`} className="text-purple-700 font-medium hover:underline flex items-center gap-1 group">
                  Read More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

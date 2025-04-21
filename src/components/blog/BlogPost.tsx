
import React from "react";
import Container from "../UI/Container";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

interface BlogPostProps {
  title: string;
  subtitle?: string;
  date?: string;
  readTime?: string;
  imageUrl: string;
  content: string;
  onBack?: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  subtitle,
  date,
  readTime,
  imageUrl,
  content,
  onBack,
}) => {
  return (
    <article className="min-h-screen">
      {/* Hero Section with Image Overlay */}
      <div className="relative h-[80vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <Container>
          <div className="relative h-full flex flex-col justify-end pb-20 lg:pb-28">
            {onBack && (
              <button
                onClick={onBack}
                className="absolute top-20 left-4 text-white hover:text-blue-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Blog
              </button>
            )}

            <div className="flex items-center gap-6 text-white/80 mb-4">
              {date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{date}</span>
                </div>
              )}
              {readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{readTime}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-white/90 max-w-2xl drop-shadow">
                {subtitle}
              </p>
            )}
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container>
        <div className="max-w-3xl mx-auto py-16">
          <div
            className="prose prose-lg prose-slate"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </Container>
    </article>
  );
};

export default BlogPost;

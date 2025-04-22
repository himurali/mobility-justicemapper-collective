
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import Container from '../UI/Container';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

interface BlogPostMetadata {
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  image: string;
  category: string;
}

interface MarkdownBlogPostProps {
  metadata: BlogPostMetadata;
  content: string;
}

const MarkdownBlogPost: React.FC<MarkdownBlogPostProps> = ({ metadata, content }) => {
  const navigate = useNavigate();

  return (
    <article className="min-h-screen">
      {/* Hero Section with Image Overlay */}
      <div className="relative h-[80vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${metadata.image})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <Container>
          <div className="relative h-full flex flex-col">
            <div className="absolute top-20 left-4 space-y-8">
              <button
                onClick={() => navigate('/blog')}
                className="text-white hover:text-blue-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Blog
              </button>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {metadata.title}
                </h1>

                <p className="text-xl text-white/90 max-w-2xl drop-shadow">
                  {metadata.subtitle}
                </p>

                <div className="flex items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{metadata.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{metadata.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content Section */}
      <Container>
        <div className="max-w-3xl mx-auto py-16">
          <div className="prose prose-lg prose-slate">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </Container>
    </article>
  );
};

export default MarkdownBlogPost;


import matter from 'gray-matter';

export interface BlogPostMetadata {
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  image: string;
  category: string;
}

export async function loadBlogPost(slug: string) {
  try {
    const response = await fetch(`/src/content/blog/${slug}.md`);
    const text = await response.text();
    const { data, content } = matter(text);
    
    return {
      metadata: data as BlogPostMetadata,
      content
    };
  } catch (error) {
    console.error('Error loading blog post:', error);
    throw error;
  }
}

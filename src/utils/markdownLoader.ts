
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
  if (!slug) {
    throw new Error('Blog post slug is required');
  }

  try {
    const response = await fetch(`/src/content/blog/${slug}.md`);
    
    if (!response.ok) {
      throw new Error(`Failed to load blog post: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    const { data, content } = matter(text);
    
    return {
      metadata: data as BlogPostMetadata,
      content
    };
  } catch (error) {
    console.error(`Error loading blog post '${slug}':`, error);
    throw error;
  }
}

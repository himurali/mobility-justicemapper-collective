
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
    // Fetch the markdown file
    const response = await fetch(`/src/content/blog/${slug}.md`);
    
    if (!response.ok) {
      throw new Error(`Failed to load blog post: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // Process frontmatter using gray-matter
    // This browser-safe implementation handles the parsing without using Buffer
    const parsed = parseFrontMatter(text);
    
    return {
      metadata: parsed.data as BlogPostMetadata,
      content: parsed.content
    };
  } catch (error) {
    console.error(`Error loading blog post '${slug}':`, error);
    throw error;
  }
}

// Simple browser-compatible frontmatter parser
function parseFrontMatter(markdown: string) {
  // Split by the frontmatter delimiter '---'
  const parts = markdown.split('---');
  
  if (parts.length < 3) {
    // No frontmatter found, return the content as is
    return {
      data: {},
      content: markdown
    };
  }
  
  // The second part (index 1) contains the frontmatter
  const frontMatterLines = parts[1].trim().split('\n');
  const data: Record<string, any> = {};
  
  // Parse each line as a key-value pair
  frontMatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      data[key] = value;
    }
  });
  
  // Everything after the second '---' is content
  const content = parts.slice(2).join('---').trim();
  
  return { data, content };
}


import React from "react";
import { useNavigate } from "react-router-dom";
import BlogPost from "../../components/blog/BlogPost";

const bicycleImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"; // Unsplash bicycle image

export default function LetGodInYourHeartAndSoul() {
  const navigate = useNavigate();

  return (
    <BlogPost
      title="Let God in your Heart and Soul"
      subtitle="Discover the transformative power of faith and the profound impact it can have on your life's journey."
      date="February 2, 2023"
      readTime="9 min"
      imageUrl={bicycleImage}
      content={`
        <h2>Let God in your Heart and Soul.</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet dui vel felis bibendum ut amet nunc turpis diam urna quam consectetur. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h3>Finding Your Path</h3>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <blockquote>
          "Faith is taking the first step even when you don't see the whole staircase." - Martin Luther King Jr.
        </blockquote>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
        <h3>Embracing Divine Guidance</h3>
        <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
      `}
      onBack={() => navigate("/blog")}
    />
  );
}

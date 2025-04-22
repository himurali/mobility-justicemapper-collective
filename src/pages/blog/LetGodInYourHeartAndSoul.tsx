
import React from "react";
import { useNavigate } from "react-router-dom";
import BlogPost from "../../components/blog/BlogPost";
import Header from "@/components/Header";

const bicycleImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";

export default function LetGodInYourHeartAndSoul() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BlogPost
        title="Let God in your Heart and Soul"
        subtitle="Discover the transformative power of faith and the profound impact it can have on your life's journey."
        date="February 2, 2023"
        readTime="9 min"
        imageUrl={bicycleImage}
        content={`
          <h2>The Journey Begins Within</h2>
          <p>In our fast-paced urban environment, finding spiritual connection can seem challenging. Yet, it's precisely in these bustling spaces where we most need to nurture our relationship with the divine. This journey begins with opening our hearts and allowing faith to guide our steps through the complex landscape of urban mobility justice.</p>

          <h3>Finding Sacred Spaces in Urban Places</h3>
          <p>Every street corner, bus stop, and bicycle lane can become a sacred space for reflection and connection. As we navigate our cities, we have countless opportunities to practice mindfulness and embrace the divine presence in our daily commutes.</p>

          <blockquote>
            "When we open our hearts to divine guidance, every journey becomes a sacred path toward justice and understanding." - Rev. Sarah Martinez
          </blockquote>

          <h3>Building Bridges Through Faith</h3>
          <p>Faith communities have long been at the forefront of social justice movements. Today, they continue to play a crucial role in advocating for equitable transportation and mobility rights. By connecting our spiritual practices with our commitment to justice, we create powerful catalysts for positive change.</p>

          <h3>Practical Steps for Spiritual Growth</h3>
          <p>Consider these practices to deepen your spiritual connection while advocating for mobility justice:</p>
          <ul>
            <li>Begin each journey with a moment of gratitude</li>
            <li>Practice mindfulness during your daily commute</li>
            <li>Engage with your faith community in mobility justice initiatives</li>
            <li>Share your spiritual insights with fellow advocates</li>
          </ul>

          <h3>The Path Forward</h3>
          <p>As we continue our work in urban mobility justice, let us remember that our spiritual foundation strengthens our resolve and guides our actions. By letting God into our hearts and souls, we become more effective advocates for positive change in our communities.</p>

          <h3>Conclusion</h3>
          <p>The intersection of faith and mobility justice offers rich opportunities for personal growth and community transformation. As we open ourselves to divine guidance, we find new ways to create more equitable and accessible transportation systems for all.</p>
        `}
        onBack={() => navigate("/blog")}
      />
    </div>
  );
}

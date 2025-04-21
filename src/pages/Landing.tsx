
import React, { useState } from "react";
import Header from "@/components/Layout/Header";
import HeroSection from "@/components/Hero/HeroSection";
import CardsSection from "@/components/Cards/CardsSection";
import ImpactSection from "@/components/Impact/ImpactSection";
import FAQSection from "@/components/FAQ/FAQSection";
// Import Explore page
import Explore from "@/pages/Explore";

const Landing = () => {
  // Simple router state: add "explore"
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const renderContent = () => {
    if (currentPage === 'explore') {
      // Render map page
      return <Explore />;
    }
    // For now, we just render the main sections
    // Add others (blog, about) if needed in future
    return (
      <>
        <HeroSection />
        <CardsSection />
        <ImpactSection />
        <FAQSection />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogoClick={() => {
          setCurrentPage('home');
          setSelectedPost(null);
        }}
      />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Landing;

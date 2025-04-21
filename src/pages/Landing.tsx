
import React, { useState } from "react";
import Header from "@/components/Layout/Header";
import HeroSection from "@/components/Hero/HeroSection";
import CardsSection from "@/components/Cards/CardsSection";
import ImpactSection from "@/components/Impact/ImpactSection";
import FAQSection from "@/components/FAQ/FAQSection";

const Landing = () => {
  // Simple router state for future blog functionality
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const renderContent = () => {
    // For now, we just render the main sections
    // In the future, this could handle blog posts as shown in your snippet
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

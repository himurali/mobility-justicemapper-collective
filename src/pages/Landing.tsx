
import React, { useState } from "react";
import Header from "@/components/Layout/Header";
import HeroSection from "@/components/Hero/HeroSection";
import CardsSection from "@/components/Cards/CardsSection";
import ImpactSection from "@/components/Impact/ImpactSection";
import FAQSection from "@/components/FAQ/FAQSection";
import Explore from "@/pages/Explore";

const Landing = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const renderContent = () => {
    if (currentPage === 'explore') {
      // Render Explore page (map)
      return <Explore />;
    }
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

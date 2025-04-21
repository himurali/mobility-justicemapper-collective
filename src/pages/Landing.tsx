
import React from "react";
import Header from "@/components/Layout/Header";
import HeroSection from "@/components/Hero/HeroSection";
import CardsSection from "@/components/Cards/CardsSection";
import ImpactSection from "@/components/Impact/ImpactSection";
import FAQSection from "@/components/FAQ/FAQSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <CardsSection />
        <ImpactSection />
        <FAQSection />
      </main>
    </div>
  );
};

export default Landing;

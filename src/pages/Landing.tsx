import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CardsSection from "@/components/CardsSection";
import ImpactSection from "@/components/ImpactSection";
import FAQSection from "@/components/FAQSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Landing = () => {
  const navigate = useNavigate();

  const processSteps = [
    {
      tag: "COMMUNITY LINKING",
      tagColor: "bg-primary",
      title: "Part I: The Demands of Justice",
      description: "Understanding community's mobility transformation needs",
      subtitle: "With alone VIX plan",
      image: "/lovable-uploads/bb1c0369-396d-4a0d-956a-16d034710170.png"
    },
    {
      tag: "COMMUNITY CHAINING",
      tagColor: "bg-secondary",
      title: "Part II: Forms of Reasoning",
      description: "Community's analytical approach to mobility",
      image: "/lovable-uploads/bb1c0369-396d-4a0d-956a-16d034710170.png"
    },
    {
      tag: "COMMUNITY PRODUCTION",
      tagColor: "bg-accent",
      title: "Part III: The Materials of Justice",
      description: "Physical and social infrastructure for community",
      image: "/lovable-uploads/bb1c0369-396d-4a0d-956a-16d034710170.png"
    },
    {
      tag: "COMMUNITY BUILDING",
      tagColor: "bg-primary/80",
      title: "Part IV: Public Reasoning and Democracy",
      description: "Community engagement in community",
      subtitle: "Community Stations",
      image: "/lovable-uploads/bb1c0369-396d-4a0d-956a-16d034710170.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      <HeroSection />

      <CardsSection />
      
      <ImpactSection />

      <FAQSection />
    </div>
  );
};

export default Landing;

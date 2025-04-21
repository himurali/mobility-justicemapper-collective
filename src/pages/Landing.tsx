import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CardsSection from "@/components/CardsSection";
import ImpactSection from "@/components/ImpactSection";
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

      <section className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white">
        <div className="bg-white border border-primary/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-primary">Issue Mapping</h3>
          <p className="mb-4 text-black">Document and visualize mobility challenges in your community.</p>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-primary">📍</span>
          </div>
        </div>
        
        <div className="bg-white border border-primary/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-primary">Community Action</h3>
          <p className="mb-4 text-black">Connect with others and organize for positive change.</p>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-primary">👥</span>
          </div>
        </div>
        
        <div className="bg-white border border-primary/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-primary">Data Analysis</h3>
          <p className="mb-4 text-black">Track progress and measure impact with powerful analytics.</p>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-primary">📊</span>
          </div>
        </div>
        
        <div className="bg-white border border-primary/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-primary">Resource Hub</h3>
          <p className="mb-4 text-black">Access tools and guides for effective advocacy.</p>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-primary">📚</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16 px-4 bg-white">
        <h2 className="text-3xl font-serif mb-8 text-center text-primary">
          Our Process
        </h2>
        <div className="relative">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {processSteps.map((step, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="relative h-[400px] rounded-2xl overflow-hidden group">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 p-6 flex flex-col justify-center items-center text-center text-white transition-opacity">
                      <span className={`${step.tagColor} px-3 py-1 rounded-full text-sm font-medium mb-4`}>
                        {step.tag}
                      </span>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-sm mb-2">{step.description}</p>
                      {step.subtitle && (
                        <p className="text-lg mt-2">{step.subtitle}</p>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif mb-8 text-primary">
          Your Questions Answered
        </h2>
        <div className="max-w-3xl mx-auto bg-white border border-primary/10 rounded-lg p-8">
          <Accordion type="single" collapsible className="space-y-6">
            <AccordionItem value="what-is" className="border-b-0">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-serif text-primary">01</span>
                  <span className="text-xl font-medium text-primary">What is JUSTMOVE all about?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-black pl-14">
                JUSTMOVE is a community-driven platform that empowers people to identify, 
                document, and address mobility justice issues in their communities. We 
                provide tools and resources to help create more equitable and accessible 
                urban spaces.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="get-involved" className="border-b-0">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-serif text-primary">02</span>
                  <span className="text-xl font-medium text-primary">How can I get involved?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-black pl-14">
                You can start by signing up for an account, reporting mobility issues 
                in your area, joining community discussions, and participating in local 
                initiatives. Every contribution helps make our cities more accessible!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cost" className="border-b-0">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-serif text-primary">03</span>
                  <span className="text-xl font-medium text-primary">Is there a cost to use?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-black pl-14">
                No, JUSTMOVE is completely free for community members. We believe that 
                access to mobility justice tools should be available to everyone who 
                wants to make a difference in their community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contribute" className="border-b-0">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-serif text-primary">04</span>
                  <span className="text-xl font-medium text-primary">Can I contribute my own data?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-black pl-14">
                Yes! We encourage community members to contribute their observations, 
                experiences, and data about mobility issues. Your contributions help 
                build a more comprehensive understanding of mobility challenges in your area.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Landing;

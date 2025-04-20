import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="flex items-center justify-between p-12 bg-purple-50/50">
        <div className="max-w-2xl">
          <p className="text-purple-600 mb-2 font-medium">More than just reporting</p>
          <h1 className="text-5xl font-serif font-bold mb-6 text-purple-900">
            Your mobility justice toolkit.<br/>
            Urban change made accessible.
          </h1>
          <p className="text-lg text-purple-700 mb-8">
            Smart reporting, community-driven tools, seamless collaboration, and built-in resources — 
            reimagine how you create change in your urban spaces.
          </p>
          <div className="space-x-4">
            <Button 
              onClick={() => navigate('/explore')}
              size="lg"
              className="bg-purple-900 hover:bg-purple-800 text-white"
            >
              Explore Map
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Join Us
            </Button>
          </div>
        </div>
        <div className="w-1/2 pl-12">
          <img 
            src="/lovable-uploads/bb1c0369-396d-4a0d-956a-16d034710170.png" 
            alt="Urban Mobility" 
            className="rounded-lg shadow-xl"
          />
        </div>
      </section>

      <section className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white">
        <div className="bg-purple-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-purple-900">Issue Mapping</h3>
          <p className="mb-4 text-purple-700">Document and visualize mobility challenges in your community.</p>
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-purple-700">📍</span>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-purple-900">Community Action</h3>
          <p className="mb-4 text-purple-700">Connect with others and organize for positive change.</p>
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-purple-700">👥</span>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-purple-900">Data Analysis</h3>
          <p className="mb-4 text-purple-700">Track progress and measure impact with powerful analytics.</p>
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-purple-700">📊</span>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-2 text-purple-900">Resource Hub</h3>
          <p className="mb-4 text-purple-700">Access tools and guides for effective advocacy.</p>
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-purple-700">📚</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif mb-8 text-purple-900">
          Your Questions Answered
        </h2>
        <div className="max-w-3xl mx-auto bg-purple-50/50 rounded-lg p-8">
          <Accordion type="single" collapsible className="space-y-6">
            <AccordionItem value="what-is" className="border-b-0">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-serif text-purple-900">01</span>
                  <span className="text-xl font-medium text-purple-900">What is JUSTMOVE all about?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-purple-700 pl-14">
                JUSTMOVE is a community-driven platform that empowers people to identify, 
                document, and address mobility justice issues in their communities. We 
                provide tools and resources to help create more equitable and accessible 
                urban spaces.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="get-involved" className="border-b-0">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-serif text-purple-900">02</span>
                  <span className="text-xl font-medium text-purple-900">How can I get involved?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-purple-700 pl-14">
                You can start by signing up for an account, reporting mobility issues 
                in your area, joining community discussions, and participating in local 
                initiatives. Every contribution helps make our cities more accessible!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cost" className="border-b-0">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-serif text-purple-900">03</span>
                  <span className="text-xl font-medium text-purple-900">Is there a cost to use?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-purple-700 pl-14">
                No, JUSTMOVE is completely free for community members. We believe that 
                access to mobility justice tools should be available to everyone who 
                wants to make a difference in their community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contribute" className="border-b-0">
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-serif text-purple-900">04</span>
                  <span className="text-xl font-medium text-purple-900">Can I contribute my own data?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-purple-700 pl-14">
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

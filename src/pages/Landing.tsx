
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-16 text-center bg-gradient-to-b from-purple-50 to-white">
        <h1 className="text-4xl md:text-6xl font-serif mb-6 text-purple-900">
          Transform Urban<br />Mobility Today
        </h1>
        <p className="text-lg md:text-xl text-purple-700 max-w-2xl mx-auto mb-8">
          Join the movement for fair and accessible urban spaces. Together, we can tackle mobility justice 
          issues and make cities work for everyone!
        </p>
        <Button 
          onClick={() => navigate('/auth')}
          size="lg"
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          Join Us
        </Button>
      </section>

      {/* Why Choose Section */}
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 bg-white">
        <div>
          <h2 className="text-3xl font-serif mb-6 text-purple-900">
            Why Choose JUSTMOVE?
          </h2>
          <p className="text-purple-700 text-lg">
            We empower communities to take charge of their mobility needs. 
            Document, visualize, and collaborate to create urban spaces that are 
            equitable and accessible for all. It's time to take action!
          </p>
        </div>
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white">
                01
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-900">Community Power</h3>
                <p className="text-purple-700">
                  Harness the strength of your community to address mobility challenges. 
                  Together, we can make a difference!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white">
                02
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-900">Visualize Change</h3>
                <p className="text-purple-700">
                  Use our tools to map out mobility issues and visualize solutions. 
                  See the change you want to create!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white">
                03
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-900">Collaborative Solutions</h3>
                <p className="text-purple-700">
                  Work with others to brainstorm and implement effective strategies 
                  for mobility justice. Teamwork makes the dream work!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-purple-50">
        <h2 className="text-3xl font-serif mb-8 text-purple-900">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl">
          <p className="text-purple-700 mb-6">
            Got questions? We've got answers! Here are some common queries
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="what-is">
              <AccordionTrigger className="text-left text-purple-900">
                What is JUSTMOVE?
              </AccordionTrigger>
              <AccordionContent className="text-purple-700">
                JUSTMOVE is a community-driven platform that empowers people to identify, 
                document, and address mobility justice issues in their communities. We 
                provide tools and resources to help create more equitable and accessible 
                urban spaces.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="get-involved">
              <AccordionTrigger className="text-left text-purple-900">
                How can I get involved?
              </AccordionTrigger>
              <AccordionContent className="text-purple-700">
                You can start by signing up for an account, reporting mobility issues 
                in your area, joining community discussions, and participating in local 
                initiatives. Every contribution helps make our cities more accessible!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default Landing;

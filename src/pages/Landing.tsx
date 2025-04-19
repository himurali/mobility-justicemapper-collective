
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { MapIcon, Route, Users2, Scale, ChevronRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-6">
            Making Urban Mobility 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-purple-600">
              {" "}Just for Everyone
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            JUSTMOVE empowers communities to document, visualize, and collaborate on mobility justice issues 
            to create more equitable and accessible urban spaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-purple-700 hover:bg-purple-800 text-white gap-2"
              size="lg"
              onClick={() => navigate('/explore')}
            >
              Explore Issues <MapIcon className="h-5 w-5" />
            </Button>
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 gap-2"
              size="lg"
              onClick={() => navigate('/report')}
            >
              Report Issue <Scale className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapIcon className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Interactive Mapping</h3>
            <p className="text-gray-600">
              Visualize and explore mobility justice issues in your city through our interactive map interface.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Users2 className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Community Collaboration</h3>
            <p className="text-gray-600">
              Connect with local advocates and stakeholders to address mobility challenges together.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Route className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Data-Driven Solutions</h3>
            <p className="text-gray-600">
              Use evidence-based insights to advocate for better mobility infrastructure and policies.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16 px-4 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community of advocates working towards more equitable urban mobility.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 gap-2"
            size="lg"
          >
            Get Started Now <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Landing;

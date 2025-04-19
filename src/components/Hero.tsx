
import React from 'react';
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector";
import { City } from "@/types";
import { MapPin, Scale, Users, Building, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface HeroProps {
  cities: City[];
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

const Hero: React.FC<HeroProps> = ({ cities, selectedCity, onSelectCity }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-purple-100/[0.3] bg-[size:20px_20px]" />
      
      <div className="relative">
        <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            {/* Left Column */}
            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500">
                    JUSTMOVE
                  </h2>
                  <div className="rounded-full bg-yellow-100 px-3 py-1 border border-yellow-200">
                    <span className="text-xs font-semibold text-purple-800">BETA</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-medium text-purple-800">
                  Mapping Justice Together
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Join our community in documenting, visualizing, and addressing mobility injustice. Help create more equitable and accessible urban spaces for everyone.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-purple-800">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Currently viewing: {selectedCity.name}</span>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-purple-700 hover:bg-purple-800 text-white"
                    onClick={() => navigate('/report')}
                  >
                    <Scale className="mr-2 h-5 w-5" />
                    Report Injustice
                  </Button>

                  <Button 
                    variant="outline"
                    className="border-purple-200 hover:bg-purple-50"
                    onClick={() => navigate('/about')}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <Card className="p-4 border-purple-100 bg-purple-50/50">
                  <div className="flex items-start gap-3">
                    <Users className="h-6 w-6 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-purple-900">Community Driven</h4>
                      <p className="text-sm text-gray-600">Collaborate with local advocates and experts</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-purple-100 bg-purple-50/50">
                  <div className="flex items-start gap-3">
                    <Building className="h-6 w-6 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-purple-900">Data Informed</h4>
                      <p className="text-sm text-gray-600">Make decisions based on real evidence</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-auto bg-white rounded-xl shadow-lg border border-purple-100 p-6">
              <div className="flex flex-col sm:flex-row gap-6 w-full">
                <div className="w-full sm:w-64">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Select Your City</label>
                    <CitySelector
                      cities={cities}
                      selectedCity={selectedCity}
                      onSelectCity={onSelectCity}
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  {!user ? (
                    <Button 
                      variant="secondary"
                      className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-medium"
                      onClick={() => navigate('/auth')}
                    >
                      Join Movement
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary"
                      className="w-full sm:w-auto bg-purple-700 text-white hover:bg-purple-800 font-medium"
                      onClick={() => navigate('/profile')}
                    >
                      My Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

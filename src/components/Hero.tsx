
import React from 'react';
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector";
import { City } from "@/types";
import { MapPin, Scale } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  cities: City[];
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

const Hero: React.FC<HeroProps> = ({ cities, selectedCity, onSelectCity }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-b from-yellow-100 to-white py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-purple-600">
                JUSTMOVE
              </h2>
              <div className="rounded-md bg-yellow-200 px-2 py-1">
                <span className="text-xs font-medium text-purple-800">BETA</span>
              </div>
            </div>
            <h3 className="text-xl font-medium text-purple-700 mb-3">Justice in Movement</h3>
            <p className="text-gray-700 mb-4">Document, visualize, and collaborate on mobility injustice issues in your city. Help create more equitable and accessible urban spaces for everyone.</p>
            
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <MapPin size={16} className="flex-shrink-0" />
              <span className="font-medium">Currently viewing: {selectedCity.name}</span>
            </div>
            
            <Button 
              className="bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2 mb-6"
              onClick={() => navigate('/report')}
            >
              <Scale size={16} />
              Report Injustice
            </Button>
          </div>
          
          <div className="w-full md:w-auto bg-white rounded-lg shadow-md p-5 border border-yellow-200">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="w-full sm:w-64">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600">Select City</label>
                  <CitySelector
                    cities={cities}
                    selectedCity={selectedCity}
                    onSelectCity={onSelectCity}
                  />
                </div>
              </div>
              
              <div>
                {!user ? (
                  <Button 
                    variant="secondary"
                    className="bg-yellow-300 text-purple-800 hover:bg-yellow-400 font-medium"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </Button>
                ) : (
                  <Button 
                    variant="secondary"
                    className="bg-purple-700 text-white hover:bg-purple-800 font-medium"
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
  );
};

export default Hero;

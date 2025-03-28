
import React from 'react';
import { Button } from "@/components/ui/button";
import CitySelector from "@/components/CitySelector";
import { City } from "@/types";

interface HeroProps {
  cities: City[];
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

const Hero: React.FC<HeroProps> = ({ cities, selectedCity, onSelectCity }) => {
  return (
    <div className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 mb-2">Urban Mobility Justice</h2>
            <p className="text-lg text-indigo-600">Document and address mobility injustice in your city</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-64">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Select City:</span>
                <CitySelector
                  cities={cities}
                  selectedCity={selectedCity}
                  onSelectCity={onSelectCity}
                />
              </div>
            </div>
            
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Report Injustice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

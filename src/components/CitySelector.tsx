
import React from "react";
import { City } from "@/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitySelectorProps {
  cities: City[];
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ 
  cities, 
  selectedCity, 
  onSelectCity 
}) => {
  return (
    <Select
      value={selectedCity.id}
      onValueChange={(cityId) => {
        const city = cities.find(c => c.id === cityId);
        if (city) onSelectCity(city);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a city" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.id}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CitySelector;

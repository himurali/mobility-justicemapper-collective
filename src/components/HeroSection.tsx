
import React from "react";
import { ArrowRight, Bike, Bus, Train, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";

// No Container component in your codebase, so just use a responsive div
const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute w-full h-full bg-grid-pattern"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-lg rotate-12 animate-[float_7s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-500/20 rounded-full animate-[float_9s_ease-in-out_infinite_1.5s]"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-1 bg-blue-100 rounded-full animate-slide-in">
            <span className="text-blue-700 font-medium text-sm flex items-center">
              Stand Up, Speak Out <ArrowRight className="w-4 h-4 ml-2" />
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-slide-in">
            Together, Let&apos;s Forge a Future of{" "}
            <span className="text-blue-600">Mobility Justice</span>
            <br />
            and Human Rights
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-in">
            We&apos;re building a future where everyone has the opportunity to thrive,
            regardless of background.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-in">
            <Button size="lg" className="min-w-[200px]">
              Make a Donation
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              About JUSTMOVE
            </Button>
          </div>

          {/* Animated Transport Icons */}
          <div className="relative">
            <div className="flex justify-center items-center gap-12 mt-12">
              <div className="p-4 bg-white/80 backdrop-blur rounded-full shadow-lg animate-[float_6s_ease-in-out_infinite] hover:scale-110 transition-transform duration-200">
                <Bike className="w-10 h-10 text-blue-600" />
              </div>
              <div className="p-4 bg-white/80 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform duration-200">
                <PersonStanding className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="p-4 bg-white/80 backdrop-blur rounded-full shadow-lg animate-[float_8s_ease-in-out_infinite_0.5s] hover:scale-110 transition-transform duration-200">
                <Bus className="w-10 h-10 text-yellow-600" />
              </div>
              <div className="p-4 bg-white/80 backdrop-blur rounded-full shadow-lg hover:scale-110 transition-transform duration-200">
                <Train className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            
            {/* Road Lines */}
            <div className="relative mt-8 mx-auto max-w-2xl">
              <div className="h-2 bg-gray-300 rounded-full mb-3"></div>
              <div className="h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

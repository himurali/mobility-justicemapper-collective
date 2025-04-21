import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bike, Bus, Train, PersonStanding } from "lucide-react";
import Container from "@/components/UI/Container";

const HeroSection: React.FC = () => (
  <section className="relative pt-24 pb-20 overflow-hidden bg-white">
    {/* Decorative Background */}
    <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
      <div className="absolute w-full h-full bg-gradient-to-br from-blue-200 to-purple-100"></div>
    </div>
    <Container className="relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-block mb-6 px-4 py-1 bg-blue-100 rounded-full animate-fade-in">
          <span className="text-blue-700 font-medium text-sm flex items-center">
            Stand Up, Speak Out
            <ArrowRight className="w-4 h-4 ml-2" />
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in">
          Together, Let's Forge a Future of{" "}
          <span className="text-blue-600">Mobility Justice</span>
          <br />
          and Human Rights
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
          We're building a future where everyone has the opportunity to thrive,
          regardless of background.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
          <Button size="lg" className="min-w-[200px]">
            Make a Donation
          </Button>
          <Button variant="outline" size="lg" className="min-w-[200px]">
            About JUSTMOVE
          </Button>
        </div>
        <div className="relative mt-12">
          <div className="flex justify-center items-center gap-12">
            <div className="p-4 bg-white/80 backdrop-blur rounded-full shadow-lg animate-icon animate-icon-delay-1 hover:scale-110 transition-transform">
              <Bike className="w-10 h-10 text-blue-600" />
            </div>
            <div className="p-4 bg-white/80 backdrop-blur rounded-full shadow-lg animate-icon animate-icon-delay-2 hover:scale-110 transition-transform">
              <PersonStanding className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="p-4 bg-white/80 backdrop-blur rounded-full shadow-lg animate-icon animate-icon-delay-3 hover:scale-110 transition-transform">
              <Bus className="w-10 h-10 text-yellow-600" />
            </div>
            <div className="p-4 bg-white/80 backdrop-blur rounded-full shadow-lg animate-icon animate-icon-delay-4 hover:scale-110 transition-transform">
              <Train className="w-10 h-10 text-purple-600" />
            </div>
          </div>
          <div className="relative mt-8 mx-auto max-w-2xl">
            <div className="h-2 bg-gray-300 rounded-full mb-3 animate-road"></div>
            <div className="h-2 bg-gray-300 rounded-full animate-road-delayed"></div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default HeroSection;

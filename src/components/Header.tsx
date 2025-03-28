
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Map, List, Info, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  
  const NavLinks = () => (
    <>
      <Link to="/about">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-indigo-700">
          About
        </Button>
      </Link>
      <Link to="/resources">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-indigo-700">
          Resources
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-indigo-700">
          Register
        </Button>
      </Link>
      <Link to="/signin">
        <Button variant="secondary" className="bg-white text-indigo-700 hover:bg-gray-100">
          Sign In
        </Button>
      </Link>
    </>
  );

  return (
    <header className="bg-indigo-600 sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-white h-10 w-10 flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                width="24" 
                height="24" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-indigo-600"
              >
                <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white">
              MobilityJustice
            </h1>
          </Link>
        </div>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="text-white">
                <Menu size={24} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="text-left">
                <SheetTitle>Mobility Justice</SheetTitle>
                <SheetDescription>
                  Document and address mobility injustice in your city
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;


import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
        <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800">
          About
        </Button>
      </Link>
      <Link to="/resources">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800">
          Resources
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800">
          Register
        </Button>
      </Link>
      <Link to="/signin">
        <Button variant="secondary" className="bg-yellow-400 text-purple-800 hover:bg-yellow-300 font-medium">
          Sign In
        </Button>
      </Link>
    </>
  );

  return (
    <header className="bg-purple-800 sticky top-0 z-10 shadow-md">
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-yellow-400 h-10 w-10 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <img 
                src="/lovable-uploads/aedeae24-5c3f-4111-80ea-4046aed9bc3d.png" 
                alt="JUMP Logo" 
                className="h-7 w-7"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-yellow-400 tracking-tight">
                JUMP
              </h1>
              <span className="text-xs text-yellow-100 leading-none font-medium">
                Justice+ Urban Mobility Platform
              </span>
            </div>
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
            <SheetContent className="bg-purple-800">
              <SheetHeader className="text-left">
                <SheetTitle className="text-yellow-400">JUMP Platform</SheetTitle>
                <SheetDescription className="text-yellow-100">
                  Justice+ Urban Mobility Platform
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


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
      <Link to="/">
        <Button variant="ghost" className="flex items-center gap-2">
          <Map size={16} />
          <span>Map</span>
        </Button>
      </Link>
      <Link to="/issues">
        <Button variant="ghost" className="flex items-center gap-2">
          <List size={16} />
          <span>Issues</span>
        </Button>
      </Link>
      <Link to="/about">
        <Button variant="ghost" className="flex items-center gap-2">
          <Info size={16} />
          <span>About</span>
        </Button>
      </Link>
    </>
  );

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-mobility-teal h-8 w-8 flex items-center justify-center text-white font-semibold">MJ</div>
            <h1 className="text-lg font-semibold hidden sm:block">
              Mobility Justice
            </h1>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <Link to="/report">
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                <span>Report Issue</span>
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu size={16} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[240px]">
                <SheetHeader className="text-left">
                  <SheetTitle>Mobility Justice</SheetTitle>
                  <SheetDescription>
                    Community-powered mapping for urban mobility issues
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLinks />
            <Link to="/report">
              <Button
                variant="default"
                className="flex items-center gap-2 ml-4"
              >
                <PlusCircle size={16} />
                <span>Report Issue</span>
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

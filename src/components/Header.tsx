
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Map, List, Info, Menu, X, User, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { user, profile, signOut } = useAuth();
  
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
      
      {!user ? (
        <>
          <Link to="/auth">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800">
              Register
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="secondary" className="bg-yellow-300 text-purple-800 hover:bg-yellow-400 font-medium">
              Sign In
            </Button>
          </Link>
        </>
      ) : (
        isMobile ? (
          <>
            <Link to="/profile">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-purple-800">
                My Profile
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-white hover:text-white hover:bg-purple-800"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-yellow-300 text-purple-800">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{profile?.full_name || 'User'}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      )}
    </>
  );

  return (
    <header className="bg-purple-800 sticky top-0 z-10 shadow-md">
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-yellow-300 h-10 w-10 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <img 
                src="/lovable-uploads/0c33469e-5edc-45f1-94c0-2ff47e135e34.png" 
                alt="JUMP Logo" 
                className="h-7 w-7"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-yellow-300 tracking-tight">
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
            <SheetContent className="bg-purple-900">
              <SheetHeader className="text-left">
                <SheetTitle className="text-yellow-300">JUMP Platform</SheetTitle>
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

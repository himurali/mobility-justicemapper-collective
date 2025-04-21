
import React from "react";

interface Props {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onLogoClick?: () => void;
}

const Header: React.FC<Props> = ({ onLogoClick }) => (
  <header className="w-full bg-gradient-to-r from-blue-200 via-white to-purple-100 shadow-md py-4 px-6 mb-1">
    <div className="container mx-auto flex justify-between items-center">
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={onLogoClick}
      >
        <img
          src="/lovable-uploads/7220eff1-e833-4e4a-804e-c092dc48ff4c.png"
          alt="JUSTMOVE Logo"
          className="h-10 w-10 rounded-full border border-blue-400"
        />
        <span className="text-2xl font-bold text-blue-700">JUSTMOVE</span>
      </button>
      {/* Nav could be added here */}
    </div>
  </header>
);

export default Header;

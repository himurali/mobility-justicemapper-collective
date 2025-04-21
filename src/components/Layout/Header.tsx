
import React from "react";

interface Props {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onLogoClick?: () => void;
}

const Header: React.FC<Props> = ({ currentPage, onNavigate, onLogoClick }) => (
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
      
      {onNavigate && (
        <nav className="flex items-center gap-4">
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              currentPage === 'home' 
                ? 'text-blue-700 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              currentPage === 'explore' 
                ? 'text-blue-700 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => onNavigate('explore')}
          >
            Explore
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              currentPage === 'blog' 
                ? 'text-blue-700 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => onNavigate('blog')}
          >
            Blog
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors ${
              currentPage === 'about' 
                ? 'text-blue-700 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => onNavigate('about')}
          >
            About
          </button>
        </nav>
      )}
    </div>
  </header>
);

export default Header;

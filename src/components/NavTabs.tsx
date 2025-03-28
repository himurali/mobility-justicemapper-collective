
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavTab {
  label: string;
  href: string;
  dialogTab?: string; // Optional parameter to specify which tab to open in the dialog
}

interface NavTabsProps {
  onTabClick?: (dialogTab?: string) => void; // Optional callback for when a tab is clicked
}

const NavTabs: React.FC<NavTabsProps> = ({ onTabClick }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const tabs: NavTab[] = [
    { label: 'Map', href: '/' },
    { label: 'Video', href: '/video', dialogTab: 'video' },
    { label: 'Solution', href: '/solution', dialogTab: 'solution' },
    { label: 'Community', href: '/community', dialogTab: 'community' },
    { label: 'Forum', href: '/forum' },
    { label: 'Documents', href: '/documents', dialogTab: 'documents' },
  ];

  const handleClick = (tab: NavTab) => {
    if (onTabClick && tab.dialogTab) {
      onTabClick(tab.dialogTab);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = 
            (tab.href === '/' && currentPath === '/') || 
            (tab.href !== '/' && currentPath.startsWith(tab.href));
            
          return (
            <Link
              key={tab.href}
              to={tab.href}
              onClick={() => handleClick(tab)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavTabs;

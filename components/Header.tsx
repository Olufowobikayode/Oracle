
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (true) {
      case path.includes('/analysis'):
        return 'Market Analysis';
      case path.includes('/keywords'):
        return 'Keyword Research';
      case path.includes('/platforms'):
        return 'Platform Finder';
      case path.includes('/content'):
        return 'Content Strategy';
      case path.includes('/ventures'):
        return 'Venture Ideas';
      case path.includes('/qna'):
        return 'AI Q&A';
      case path.includes('/socials'):
          return 'Social Media Strategy';
      case path.includes('/copy'):
          return 'Copywriting Assistant';
      case path.includes('/dashboard'):
        return "Dashboard";
      default:
        return 'Market Oracle';
    }
  };
  
  const title = getPageTitle();
  
  return (
    <header className="flex-shrink-0 bg-stone-900/80 backdrop-blur-sm border-b border-amber-900/50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-grow">
          <h1 className="text-xl font-bold text-white truncate">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
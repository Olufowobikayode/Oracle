
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';
import useAuth from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const { isAuthenticated } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-amber-400' : 'text-stone-300 hover:text-white'
    }`;
    
  return (
    <header className="bg-stone-800/80 backdrop-blur-sm border-b border-stone-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-lg text-white">Market Oracle</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
            {isAuthenticated && (
                <NavLink to="/blog/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </nav>
          <div className="flex items-center">
             <Link
                to="/app/initiate"
                className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-amber-700 transition duration-300"
             >
                Enter App
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

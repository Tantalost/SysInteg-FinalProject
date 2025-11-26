import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import { UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <div className="
        flex items-center justify-between 
        h-16 px-4 md:px-8 lg:px-12 
        bg-white shadow-lg 
        sticky top-0 z-10 
        transition-all duration-300
      ">
        {/* Logo Link */}
        <Link to='/' className='flex items-center'>
          <img 
            src={logo} 
            alt="Company Logo" 
            className='w-auto transition-all duration-300 h-40 filter invert'
          />
        </Link>

        {/* User Authentication Button */}
        <div className='flex items-center'>
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export default Navbar;

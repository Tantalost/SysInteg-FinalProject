import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import { UserButton } from '@clerk/clerk-react';

const Navbar = () => {
    return (
        <header>
            <div className='flex items-center justify-between 
                h-16 px-4 md:px-8 lg:px-12 
                bg-white shadow-lg 
                sticky top-0 z-10 
                transition-all duration-300'>

                {/* Logo Link (Top Left Icon Fix) */}
                <Link to='/' className='flex items-center'>
                    <img 
                        // ✨ FIX 2: Use the imported 'logo' variable for the src
                        src={logo} 
                        alt="Company Logo" 
                        // ✨ FIX: Increased height to h-10 and ensured a color/sizing fix
                        className='h-35 invert w-auto text-gray-800 transition-opacity duration-200  hover:opacity-80' 
                    />
                </Link>
                
                {/* User Authentication Button */}
                <div className='flex items-center'>
                    {/* Clerk UserButton: Already handles its own size/visibility well. */}
                    <UserButton />
                </div>
            </div>
        </header>
    );
}

export default Navbar;
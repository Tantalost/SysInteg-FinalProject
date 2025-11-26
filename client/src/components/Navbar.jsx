import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { useClerk, UserButton } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext.jsx';
import { IoBookOutline } from 'react-icons/io5'; // Using react-icons for a cleaner look

const BookIcon = () => (
    // Replaced SVG with react-icon for consistency, using an icon relevant to bookings
    <IoBookOutline className="w-5 h-5 text-gray-700" />
)
const ADMIN_USER_ID = "user_35jwIVDrqhFillS7GlLQvnMEyll";

const Navbar = () => {
    const navLinks = [
        { name: 'Services', path: '/services' },
        { name: 'Rates', path: '/rates' },
        { name: 'About', path: '/about' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { openSignIn } = useClerk()
    const location = useLocation()
    const { user } = useAppContext();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        // Set initial scroll state based on path
        setIsScrolled(location.pathname !== '/');

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10 || location.pathname !== '/');
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    // Determine the text color based on scroll/page state
    const textColor = isScrolled ? "text-gray-700" : "text-white";
    const underlineColor = isScrolled ? "bg-red-600" : "bg-white";

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 h-[80px] ${isScrolled ? "bg-white/95 shadow-lg backdrop-blur-sm" : "bg-transparent py-4"}`}>

            <Link to='/' className="flex items-center">
                <img
                    src={assets.logo}
                    alt="logo"
                    className={`w-auto transition-all duration-300 ${isScrolled ? "h-40 filter invert" : "h-40"}`}
                />
            </Link>

            <div className="hidden md:flex items-center gap-4 lg:gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link, i) => (
                    <Link
                        key={i}
                        to={link.path}
                        className={`group flex flex-col items-center gap-0.5 transition-all duration-300 hover:text-red-600 ${isActive(link.path)
                                ? "text-red-600 font-semibold"
                                : textColor
                            }`}
                    >
                        {link.name}
                        <div className={`${isActive(link.path) ? "w-full bg-red-600" : `w-0 ${underlineColor}`
                            } h-0.5 group-hover:w-full transition-all duration-300`} />
                    </Link>
                ))}

                {user && user.id === ADMIN_USER_ID && (
                    <button
                        className={`border px-3 py-1.5 text-xs font-medium rounded-full cursor-pointer transition-all ${isScrolled ? 'text-gray-800 border-gray-400 hover:bg-gray-100' : 'text-white border-white hover:bg-white/20'}`}
                        onClick={() => navigate('/admin')}
                    >
                        Admin Dashboard
                    </button>
                )}
            </div>

            <div className="hidden md:flex items-center gap-6">
                {user ? (
                    <UserButton afterSignOutUrl="/">
                        <UserButton.MenuItems>
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                ) : (
                    <button
                        onClick={openSignIn}
                        className={`px-6 py-2 rounded-full cursor-pointer font-medium text-sm transition-all duration-500 shadow-lg ${isScrolled ? "text-white bg-red-600 hover:bg-red-700" : "bg-white text-gray-800 hover:bg-gray-100"}`}
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                {user && (
                    <UserButton afterSignOutUrl="/">
                        <UserButton.MenuItems>
                            <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                )}
                <img
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    src={assets.menuIcon}
                    alt="menu"
                    className={`${isScrolled ? "invert-0" : "invert"} h-5 cursor-pointer`}
                />
            </div>

            {/* Mobile Menu Overlay (Cleaned up) */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-lg flex flex-col md:hidden items-center justify-center gap-8 font-medium text-gray-800 transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.closeIcon} alt="closeMenu" className="h-6.5" />
                </button>

                {navLinks.map((link, i) => (
                    <Link
                        key={i}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-xl font-semibold ${isActive(link.path) ? "text-red-600" : "text-gray-800 hover:text-red-500"}`}
                    >
                        {link.name}
                    </Link>
                ))}

                {user && user.id === ADMIN_USER_ID && (
                    <button
                        className="mt-4 px-4 py-2 text-base font-medium rounded-full bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-all"
                        onClick={() => {
                            navigate('/admin');
                            setIsMenuOpen(false);
                        }}
                    >
                        Admin Dashboard
                    </button>
                )}

                {!user && (
                    <button onClick={() => { openSignIn(); setIsMenuOpen(false); }} className="mt-6 bg-red-600 text-white px-8 py-3 rounded-full font-medium transition-all hover:bg-red-700">
                        Login / Sign Up
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
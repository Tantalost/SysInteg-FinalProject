import React from 'react'
import { assets } from '../assets/assets.js';

const Footer = () => {
    return (
        <footer className="w-full py-6 bg-gradient-to-b from-transparent to-[#D10000] text-white/70 flex flex-col items-center">
    <img src={assets.logo} alt="logo" className="h-16 w-auto opacity-90" />

    <p className="mt-2 text-center text-sm">
        © 2025 <a href="/" className="underline">Cynergy</a>. All rights reserved.
    </p>
</footer>

    )
}

export default Footer

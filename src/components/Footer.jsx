import React from 'react'
import { assets } from '../assets/assets.js';

const Footer = () => {
    return (
        <footer class="flex flex-col items-center w-full 
                       mt-[-3rem] pt-[10.5rem] pb-10 
                       bg-gradient-to-b from-transparent to-[#D10000] text-white/70">
            <img src={assets.logo} alt="logo" className={`h-[200px]`} />
            <p class="mt-4 text-center">Copyright © 2025 <a href="#">Cynergy</a>. All rights reservered.</p>
        </footer>
    )
}

export default Footer

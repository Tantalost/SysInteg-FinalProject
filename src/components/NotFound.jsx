import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-center 
            gap-10 pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
        <div class="flex flex-col items-center justify-center text-sm max-md:px-4">
            <h1 class="text-8xl md:text-9xl font-bold text-indigo-500">404</h1>
            <div class="h-1 w-16 rounded bg-indigo-500 my-5 md:my-7"></div>
            <p class="text-2xl md:text-3xl font-bold text-gray-800">Page Not Found</p>
            <p class="text-sm md:text-base mt-4 text-gray-500 max-w-md text-center">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <div class="flex items-center gap-4 mt-6">
                <Link to='/' class="bg-gray-800 hover:bg-black px-7 py-2.5 text-white rounded-md active:scale-95 transition-all">
                    Return Home
                </Link>
                <Link to='/support' class="bg-red-800 hover:bg-black px-7 py-2.5 text-white rounded-md active:scale-95 transition-all">
                    Contact Customer Support
                </Link>
            </div>
        </div>
        </div>
    )
}

export default NotFound

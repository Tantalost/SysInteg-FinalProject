import React from 'react'
import Title from '../components/Title.jsx'

const Rates = () => {
    return (
        
        <div className='flex flex-col items-center 
            gap-10 pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>

        <Title title='Featured Rooms' subTitle="We've paired our incredible rooms with featured movies and games that'll transport you to another world. Whether you're a gamer on a quest or a cinephile looking for a scene change, your next adventure starts here." />
            <div class="flex flex-wrap items-center justify-center gap-6">
                <div class="w-72 bg-white text-center text-gray-800/80 border border-gray-200 p-6 pb-16 rounded-lg">
                    <p class="font-semibold">Basic</p>
                    <h1 class="text-3xl font-semibold">₱29<span class="text-gray-500 text-sm font-normal">/month</span></h1>
                    <ul class="list-none text-gray-500 text-sm mt-6 space-y-1">
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Access to all basic courses</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Community support</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>10 practice projects</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Course completion certificate</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Basic code review</p>
                        </li>
                    </ul>
                    <button type="button" class="bg-red-500 text-sm w-full py-2 rounded text-white font-medium mt-7 hover:bg-red-800 transition-all">
                        Get Started
                    </button>
                </div>

                <div class="w-72 bg-red-900 relative text-center text-white border border-gray-500/30 p-6 pb-14 rounded-lg">
                    <p class="absolute px-3 text-sm -top-3.5 left-3.5 py-1 bg-[#D10000] rounded-full">Most Popular</p>
                    <p class="font-semibold pt-2">Pro</p>
                    <h1 class="text-3xl font-semibold">₱79<span class="text-sm font-normal">/month</span></h1>
                    <ul class="list-none text-white text-sm mt-6 space-y-1">
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Access to all Pro courses</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Priority community support</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>30 practice projects</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Course completion certificate</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Advance code review</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>1-on-1 mentoring sessions</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Job assistance</p>
                        </li>
                    </ul>
                    <button type="button" class="bg-white text-sm w-full py-2 rounded text-red-800 font-medium mt-7 hover:bg-gray-200 transition-all">
                        Get Started
                    </button>
                </div>

                <div class="w-72 bg-white text-center text-gray-800/80 border border-gray-200 p-6 rounded-lg">
                    <p class="font-semibold">Enterprise</p>
                    <h1 class="text-3xl font-semibold">₱199<span class="text-gray-500 text-sm font-normal">/month</span></h1>
                    <ul class="list-none text-gray-500 text-sm mt-6 space-y-1">
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Access to all courses</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Dedicated support</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Unlimited projects</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Course completion certificate</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Premium code review</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Weekly 1-on-1 mentoring</p>
                        </li>
                        <li class="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z" fill="#D10000" />
                            </svg>
                            <p>Job guarantee</p>
                        </li>
                    </ul>
                    <button type="button" class="bg-red-500 text-sm w-full py-2 rounded text-white font-medium mt-7 hover:bg-red-600 transition-all">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Rates

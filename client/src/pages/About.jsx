import React from 'react'
import Title from '../components/Title.jsx'

const About = () => {
    const developers = [
        {
            name: "John Lloyd Climaco",
            role: "Full Stack Developer",
            description: "Specialized in React and Node.js development, focusing on creating seamless user experiences."
        },
        {
            name: "Stephanie Villamor",
            role: "UI/UX Designer",
            description: "Expert in API design and database management, ensuring robust and scalable systems."
        },
        {
            name: "Vennashier Malali",
            role: "Quality Assurance Engineer",
            description: "Passionate about UI/UX design and creating responsive, modern web interfaces."
        },
        {
            name: "Justin James Alviar",
            role: "Project Manager",
            description: "Manages deployment pipelines and infrastructure, keeping the platform running smoothly."
        },
        {
            name: "Jayna Sahibul",
            role: "Business Analyst",
            description: "Focused on cross-platform mobile development and SMS notification integration."
        }
    ];

    return (
        <div className='flex flex-col items-center gap-16 pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 pb-16'>
            {/* About Section */}
            <div className='w-full max-w-4xl'>
                <Title 
                    title='About Cynergy' 
                    subTitle="Your trusted partner in seamless online booking experiences"
                />
                
                <div className='mt-10 space-y-6 text-gray-700'>
                    <p className='text-base md:text-lg leading-relaxed'>
                        Cynergy is an innovative <strong>Online Booking Management System</strong> enhanced with 
                        <strong> real-time SMS notifications</strong>. Our platform is designed to revolutionize 
                        the way hotels and accommodations manage their bookings, providing a streamlined, secure, 
                        and efficient solution for both property owners and guests.
                    </p>
                    
                    <p className='text-base md:text-lg leading-relaxed'>
                        Whether you're a traveler looking for the perfect room or a property owner seeking to 
                        maximize your bookings, Cynergy offers an intuitive interface that makes the entire 
                        process effortless. From browsing available rooms to receiving instant booking 
                        confirmations via SMS, we've got you covered every step of the way.
                    </p>
                    
                    <p className='text-base md:text-lg leading-relaxed'>
                        Our mission is to bridge the gap between technology and hospitality, creating a platform 
                        that not only simplifies booking management but also enhances the overall experience 
                        for everyone involved. With features like real-time availability, secure payment processing, 
                        and instant notifications, Cynergy is your one-stop solution for modern booking needs.
                    </p>
                </div>
            </div>

            {/* Developers Section */}
            <div className='w-full max-w-6xl'>
                <Title 
                    title='Meet Our Team' 
                    subTitle="The talented developers behind Cynergy"
                />
                
                <div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
                    {developers.map((developer, index) => (
                        <div 
                            key={index}
                            className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300'
                        >
                            <div className='flex flex-col items-center text-center'>
                                <div className='w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-4'>
                                    <span className='text-white text-2xl font-semibold'>
                                        {developer.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <h3 className='text-xl font-semibold text-gray-800 mb-1'>
                                    {developer.name}
                                </h3>
                                <p className='text-sm text-red-600 font-medium mb-3'>
                                    {developer.role}
                                </p>
                                <p className='text-sm text-gray-600 leading-relaxed'>
                                    {developer.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default About
import React from 'react'
import Title from '../components/Title.jsx'

const About = () => {
    const developers = [
        {
            name: "John Lloyd Climaco",
            role: "Full Stack Developer",
            description: "Skilled in building and maintaining both front-end and back-end applications, capable of delivering complete end-to-end web or mobile solutions."
        },
        {
            name: "Stephanie Villamor",
            role: "UI/UX Designer",
            description: "Designs intuitive and engaging user interfaces while ensuring a seamless user experience across web and mobile applications."
        },
        {
            name: "Vennashier Malali",
            role: "Quality Assurance Engineer",
            description: "Tests, monitors, and ensures software quality by identifying bugs and verifying functionality to deliver reliable, high-performing applications."
        },
        {
            name: "Justin James Alviar",
            role: "Project Manager",
            description: "Plans, executes, and oversees projects, coordinating teams and resources to ensure timely delivery and alignment with business objectives."
        },
        {
            name: "Jayna Sahibul",
            role: "Business Analyst",
            description: "Analyzes business needs, gathers requirements, and translates them into actionable solutions to drive efficiency and support decision-making."
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

                        Cynergy is an innovative your ultimate destination for private entertainment experiences. 
                        We specialize in providing <strong>exclusive movie rooms, gaming hubs, and karaoke rooms</strong>
                        that you can conveniently book online. Our platform is designed to make your leisure time 
                        seamless and enjoyable—whether you are watching the latest blockbuster, gaming with friends, 
                        or singing your favorite hits.
                      
                    </p>
                    
                    <p className='text-base md:text-lg leading-relaxed'>
                        With a focus on comfort, privacy, and personalized perks, we ensure every booking delivers a 
                        memorable experience. From premium equipment and immersive sound systems to customizable room 
                        settings and tasty refreshments, every detail is tailored to elevate your entertainment.
                    </p>
                    
                    <p className='text-base md:text-lg leading-relaxed'>
                        Our mission is to redefine private entertainment by bridging technology and hospitality. 
                        Cynergy provides a seamless platform to book VIP movie rooms, gaming hubs, and karaoke suites, 
                        making the entire experience effortless and enjoyable. With features like real-time availability, 
                        secure payments, and instant booking confirmations, we ensure that every visit is stress-free, 
                        personalized, and unforgettable—whether you are watching a blockbuster, competing in a gaming 
                        session, or singing your heart out with friends.
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
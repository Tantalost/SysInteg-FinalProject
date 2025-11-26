import React from 'react'
import Title from '../components/Title.jsx'

const About = () => {
    const developers = [
        {
            name: "John Lloyd Climaco",
            role: "Full Stack Developer",
            description: "Skilled in building and maintaining both front-end and back-end applications, capable of delivering complete end-to-end web or mobile solutions.",
            image: "https://media.tenor.com/1GznYBOTdtgAAAAM/ugly-fish.gif",
            hoverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHWaSK5Cts1OmO7Uip1T7lYgTFz2OZNOfDgA&s"
        },
        {
            name: "Stephanie Villamor",
            role: "UI/UX Designer",
            description: "Designs intuitive and engaging user interfaces while ensuring a seamless user experience across web and mobile applications.",
            image: "https://i.redd.it/id-please-ik-its-a-meme-im-not-joking-v0-pveese881gna1.jpg?width=720&format=pjpg&auto=webp&s=e42849d3a376792cd8e86347615e9eb47396ec76",
            hoverImage: "https://pbs.twimg.com/media/G2ygFFCWcAAVZcf.jpg"
        },
        {
            name: "Vennashier Malali",
            role: "Quality Assurance Engineer",
            description: "Tests, monitors, and ensures software quality by identifying bugs and verifying functionality to deliver reliable, high-performing applications.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtw_SOHshGu9EsyyKZX4tlvPevh9WW9SiUwQ&s",
            hoverImage: "https://i.pinimg.com/736x/67/4b/15/674b1568ff5ccabda9daa43901eb38d7.jpg"
        },
        {
            name: "Justin James Alviar",
            role: "Project Manager",
            description: "Plans, executes, and oversees projects, coordinating teams and resources to ensure timely delivery and alignment with business objectives.",
            image: "https://upload.wikimedia.org/wikipedia/en/4/46/Mr_Blobby_%28fish%29%2C_2003.jpg",
            hoverImage: "https://pbs.twimg.com/media/FrpNfNJWYAIi3pN.jpg"
        },
        {
            name: "Jayna Sahibul",
            role: "Business Analyst",
            description: "Analyzes business needs, gathers requirements, and translates them into actionable solutions to drive efficiency and support decision-making.",
            image: "https://m.media-amazon.com/images/I/5126vGX4OhL._AC_UF350,350_QL50_.jpg",
            hoverImage: "https://a.pinatafarm.com/1000x1000/be18c4469d/cat-with-tongue-out-e14f30982528aaee7d357480195f236f-meme.jpeg"
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
                            className='group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300'
                        >
                            <div className='flex flex-col items-center text-center'>
                                <div className='relative w-24 h-24 mb-4'>
                                    <img 
                                        src={developer.image} 
                                        alt={developer.name} 
                                        className='w-full h-full object-cover rounded-full border-4 border-white shadow-lg transition-opacity duration-300 group-hover:opacity-0'
                                        loading="lazy"
                                    />
                                    <img 
                                        src={developer.hoverImage} 
                                        alt={`${developer.name} fun`} 
                                        className='absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                                        loading="lazy"
                                    />
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
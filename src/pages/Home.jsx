import React, { useEffect, useRef, useState } from 'react';

const Home = () => {
    const showcaseSectionRef = useRef(null);
    const offersSectionRef = useRef(null);
    const [scrollY, setScrollY] = useState(0);
    const [showcaseParallax, setShowcaseParallax] = useState({ left: 0, right: 0 });
    const [morphProgress, setMorphProgress] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            setScrollY(currentScroll);

            if (showcaseSectionRef.current) {
                const rect = showcaseSectionRef.current.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const scrollProgress = (currentScroll - sectionTop) / window.innerHeight;

                if (scrollProgress >= -0.5 && scrollProgress <= 0.5) {
                    const parallaxAmount = scrollProgress * 100;
                    setShowcaseParallax({
                        left: parallaxAmount * 0.3,
                        right: -parallaxAmount * 0.3
                    });

                    const newProgress = Math.max(0, Math.min(1, 1 - Math.abs(scrollProgress) * 2));
                    setMorphProgress(newProgress);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const getMorphPath = (progress) => {
        const curveIntensity = 100 * (1 - progress);
        return `M0,100 C300,${curveIntensity} 900,${curveIntensity} 1200,100`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 md:py-6 bg-[#8b1a1a]/90 backdrop-blur-md z-50 transition-all duration-500">
                <a href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <span className="text-white text-2xl font-sans font-bold tracking-tight">Cynergy</span>
                </a>

                <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                    {["Offer", "Rates", "Services", "About"].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="group flex flex-col gap-0.5 text-white font-sans text-base"
                        >
                            {item}
                            <div className="bg-white h-0.5 w-0 group-hover:w-full transition-all duration-300"></div>
                        </a>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <button className="bg-black text-white px-6 py-2.5 rounded-full font-sans text-sm font-semibold transition-all duration-300 hover:bg-white hover:text-black">
                        Sign in
                    </button>
                </div>

                <div className="flex items-center gap-3 md:hidden">
                    <button>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </header>

            <section
                className="min-h-screen flex items-center justify-center text-center px-8 pt-32 pb-24 relative overflow-hidden"
                style={{
                    background: `
  radial-gradient(ellipse at center, rgba(139, 26, 26, 0.7) 0%, rgba(26, 10, 10, 0.7) 50%, rgba(10, 10, 10, 0.8) 100%),
  url('https://i.redd.it/rq29razx1v871.jpg') center/cover no-repeat
`
                }}
            >
                <div className="relative z-10 max-w-5xl">
                    <h1 className="text-5xl md:text-7xl font-sans font-bold leading-tight mb-6 text-white">
                        Skip the waiting and guarantee your spot!
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 font-sans mb-12 max-w-3xl mx-auto">
                        The Fastest Way to Fun. Book Your Private Movie, Karaoke, or Gaming Room Instantly.
                    </p>

                    <button className="px-8 py-4 hover:text-white border border-red-700 hover:bg-red-800 text-white font-sans font-bold cursor-pointer rounded-lg shadow-lg hover:shadow-xl transition-shadow inline-flex items-center gap-2">
                        Book Now <span className="text-xl">→</span>
                    </button>
                </div>
                <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
            </section>


            <section ref={showcaseSectionRef} className="relative bg-[#0a0a0a] overflow-hidden">
                <div className="absolute top-0 left-0 w-full overflow-hidden h-16 z-20">
                    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full fill-[#0a0a0a]">
                        <path d="M0,0 C300,100 900,100 1200,0 L1200,100 L0,100 Z"></path>
                    </svg>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 pt-16 relative z-10">
                    <div className="relative h-[600px] overflow-hidden">
                        <img
                            src="https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/fdf9b8173161499.648b44b344490.jpg"
                            alt="KTV Room"
                            className="w-full h-full object-cover transition-transform duration-150 ease-out"
                            style={{
                                transform: `translateX(${showcaseParallax.left}px) scale(1.05)`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    </div>

                    <div className="relative h-[600px] overflow-hidden">
                        <img
                            src="https://image.benq.com/is/image/benqco/Gamingroom_tk700sti-A"
                            alt="Game Room"
                            className="w-full h-full object-cover transition-transform duration-150 ease-out"
                            style={{
                                transform: `translateX(${showcaseParallax.right}px) scale(1.05)`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent"></div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden h-16 z-20 pointer-events-none">
                    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full fill-[#0a0a0a]">
                        <path
                            d={getMorphPath(morphProgress)}
                        />
                        <path d="L1200,0 L0,0 Z" />
                    </svg>
                </div>
            </section>

            <section ref={offersSectionRef} className="py-24 px-8 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-sans font-bold mb-12 text-white transition-all duration-700"
                        style={{
                            opacity: scrollY > 400 ? '1' : '0',
                            transform: scrollY > 400 ? 'translateY(0)' : 'translateY(30px)'
                        }}>
                        Limited - Time Offers
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-[#8b1a1a]/20"
                            style={{
                                opacity: scrollY > 500 ? '1' : '0',
                                transform: `translateY(${scrollY > 500 ? '0' : '40px'})`
                            }}>
                            <div className="relative overflow-hidden">
                                <img
                                    src="https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/fdf9b8173161499.648b44b344490.jpg"
                                    alt="KTV Room"
                                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 bg-[#8b1a1a] text-white px-3 py-1 text-sm font-bold transform rotate-12 animate-pulse">
                                    20% OFF
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-sans font-bold mb-4 text-white">
                                    KTV Room
                                </h3>
                                <div className="space-y-2 text-gray-300">
                                    <div className="flex justify-between text-base">
                                        <span>Small room (4 - 6 people)</span>
                                        <span className="font-medium">240.00</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span>Medium room (8 - 12 people)</span>
                                        <span className="font-medium">400.00</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span>Large room (15 - 25+ people)</span>
                                        <span className="font-medium">800.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden transition-all duration-700 delay-100 hover:scale-105 hover:shadow-2xl hover:shadow-[#8b1a1a]/20"
                            style={{
                                opacity: scrollY > 550 ? '1' : '0',
                                transform: `translateY(${scrollY > 550 ? '0' : '40px'})`
                            }}>
                            <div className="relative overflow-hidden">
                                <img
                                    src="https://cdn.mos.cms.futurecdn.net/ifycXFxFrobEJng59xnQB5.jpg"
                                    alt="Movie Room"
                                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 bg-[#8b1a1a] text-white px-3 py-1 text-sm font-bold transform rotate-12 animate-pulse">
                                    20% OFF
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-sans font-bold mb-4 text-white">
                                    Movie Room
                                </h3>
                                <div className="space-y-2 text-gray-300">
                                    <div className="flex justify-between text-base">
                                        <span>Small room (4 - 6 people)</span>
                                        <span className="font-medium">240.00</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span>Medium room (8 - 12 people)</span>
                                        <span className="font-medium">400.00</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span>Large room (15 - 25+ people)</span>
                                        <span className="font-medium">800.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden transition-all duration-700 delay-200 hover:scale-105 hover:shadow-2xl hover:shadow-[#8b1a1a]/20"
                            style={{
                                opacity: scrollY > 600 ? '1' : '0',
                                transform: `translateY(${scrollY > 600 ? '0' : '40px'})`
                            }}>
                            <div className="relative overflow-hidden">
                                <img
                                    src="https://image.benq.com/is/image/benqco/Gamingroom_tk700sti-A"
                                    alt="Game Room"
                                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                />
                                <div className="absolute top-2 right-2 bg-[#8b1a1a] text-white px-3 py-1 text-sm font-bold transform rotate-12 animate-pulse">
                                    20% OFF
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-sans font-bold mb-4 text-white">
                                    Game Room
                                </h3>
                                <div className="space-y-2 text-gray-300">
                                    <div className="flex justify-between text-base">
                                        <span>Small room (4 - 6 people)</span>
                                        <span className="font-medium">240.00</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span>Medium room (8 - 12 people)</span>
                                        <span className="font-medium">400.00</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span>Large room (15 - 25+ people)</span>
                                        <span className="font-medium">800.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-8 bg-[#8b1a1a]">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-5xl font-sans font-bold mb-6 text-white transition-all duration-700"
                        style={{
                            opacity: scrollY > 900 ? '1' : '0',
                            transform: scrollY > 900 ? 'translateY(0)' : 'translateY(30px)'
                        }}>
                        Featured Movies and Games
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto transition-all duration-700"
                        style={{
                            opacity: scrollY > 950 ? '1' : '0',
                            transform: scrollY > 950 ? 'translateY(0)' : 'translateY(20px)'
                        }}>
                        We've paired our incredible rooms with featured movies and games that'll transport you to another world. Whether you're a gamer on a quest or a cinephile looking for a scene change, your next adventure starts here.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }, (_, i) => {
                            const images = [
                                'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
                                'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop',
                                'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&h=600&fit=crop',
                                'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=400&h=600&fit=crop',
                                'https://cdn.mos.cms.futurecdn.net/ifycXFxFrobEJng59xnQB5.jpg',
                                'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=600&fit=crop'
                            ];
                            return (
                                <div
                                    key={i}
                                    className="relative h-64 rounded-lg overflow-hidden shadow-lg transition-all duration-700 hover:scale-105 hover:shadow-2xl"
                                    style={{
                                        opacity: scrollY > 1000 + (i * 50) ? '1' : '0',
                                        transform: `translateY(${scrollY > 1000 + (i * 50) ? '0' : '30px'})`
                                    }}
                                >
                                    <img
                                        src={images[i]}
                                        alt={`Featured Content ${i + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <footer className="py-8 px-8 bg-[#8b1a1a] text-center text-gray-300">
                <p className="text-sm font-sans">
                    Cynergy Ent. 2025. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;

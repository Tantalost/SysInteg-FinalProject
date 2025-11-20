import React from 'react'
import Hero from '../components/Hero'
import FeaturedRoom from '../components/FeaturedRoom'
import LimitedOffers from '../components/LimitedOffers'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Hero />
      <Testimonials />
      <LimitedOffers />
      <FeaturedRoom />
    </>
  )
}

export default Home

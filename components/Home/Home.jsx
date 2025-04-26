import React from 'react'
import Banner from './Banner';
console.log("🧪 Banner:", Banner);

import HomeCategory from './HomeCategory';
console.log("🧪 HomeCategory:", HomeCategory);

import Register from './Register';
console.log("🧪 Register:", Register);

import LocationSprade from './LocationSprade';
console.log("🧪 LocationSprade:", LocationSprade);

import AboutUs from './AboutUs';
console.log("🧪 AboutUs:", AboutUs);

import AppSection from './AppSection';
console.log("🧪 AppSection:", AppSection);

import Sponsor from './Sponsor';
console.log("🧪 Sponsor:", Sponsor);

import CategoryShowCase from './CategoryShowCase';
console.log("🧪 CategoryShowCase:", CategoryShowCase);


const Home = () => {
  return (
    <div>
        <Banner/>
        <HomeCategory/>
        <CategoryShowCase/>
        <Register/>
        <LocationSprade/>
        <AboutUs/>
        <AppSection/>
        <Sponsor/>
    </div>
  )
}

export default Home

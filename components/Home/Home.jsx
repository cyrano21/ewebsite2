import React from 'react'
import Banner from './Banner';

import HomeCategory from './HomeCategory';

import Register from './Register';

import LocationSprade from './LocationSprade';

import AboutUs from './AboutUs';

import AppSection from './AppSection';

import Sponsor from './Sponsor';

import CategoryShowCase from './CategoryShowCase';

// Import du composant d'affichage des publicités
import { AdvertisementDisplay } from '../Advertisement';

const Home = ({ featuredProducts }) => {
  return (
    <div>
        {/* Bannière principale */}
        <Banner/>
        
        {/* Publicité en haut de page (après la bannière) */}
        <AdvertisementDisplay position="home" type="banner" />
        
        <HomeCategory/>
        <CategoryShowCase featuredProducts={featuredProducts} />
        
        {/* Publicité au milieu de la page */}
        <AdvertisementDisplay position="home" type="featured" />
        
        <Register/>
        <LocationSprade/>
        <AboutUs/>
        
        {/* Publicité avant la section app */}
        <AdvertisementDisplay position="home" type="banner" />
        
        <AppSection/>
        <Sponsor/>
    </div>
  )
}

export default Home

import React, { useState, useEffect } from 'react'
import PageHeader from '../../../components/PageHeader';

const About = () => {
  const [aboutData, setAboutData] = useState({
    subTitle: "À propos de notre marque",
    title: "Services de qualité et expérience incomparable",
    desc: "Nous fournissons un accès distinctif aux utilsateurs tout en proposant des processus transparents qui incitent à des fonctionnalités efficaces plutôt qu'une architecture extensible, pour une communication et des services optimisés sur toutes les plateformes.",
    year: "30+",
    expareance: "Années d'expérience",
    mainImage: "",
    secondaryImage: "",
    features: []
  });

  useEffect(() => {
    // Fetch about data from API
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);
  return (
    <div>
        <PageHeader title={'À propos de notre marque'} curPage={'À propos'} />
        <div className="about-section style-3 padding-tb section-bg">
                <div className="container">
                    <div className="row justify-content-center row-cols-xl-2 row-cols-1 align-items-center">
                        <div className="col">
                            <div className="about-left">
                                <div className="about-thumb">
                                    <img src={aboutData.mainImage || '/assets/images/about/01.jpg'} alt="about" />
                                </div>
                                <div className="abs-thumb">
                                    <img src={aboutData.secondaryImage || '/assets/images/about/02.jpg'} alt="about" />
                                </div>
                                <div className="about-left-content">
                                    <h3>{aboutData.year}</h3>
                                    <p>{aboutData.expareance}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="about-right">
                                <div className="section-header">
                                    <span className="subtitle">{aboutData.subTitle}</span>
                                    <h2 className="title">{aboutData.title}</h2>
                                    <p>{aboutData.desc}</p>
                                </div>
                                <div className="section-wrapper">
                                    <ul className="lab-ul">
                                        {aboutData.features && aboutData.features.map((feature, i) => (
                                            <li key={i}>
                                                <div className="sr-left">
                                                    <img src={feature.imgUrl || `/assets/images/about/icon/0${i+1}.jpg`} alt={feature.imgAlt || 'feature icon'} />
                                                </div>
                                                <div className="sr-right">
                                                    <h5>{feature.title}</h5>
                                                    <p>{feature.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default About

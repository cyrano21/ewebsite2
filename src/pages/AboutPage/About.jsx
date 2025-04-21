import React from 'react'
import PageHeader from '../../components/PageHeader';
import { about01, about02, aboutIcon01, aboutIcon02, aboutIcon03 } from '../../utilis/imageImports';

const subTitle = "À propos de notre marque";
const title = "Services de qualité et expérience incomparable";
const desc = "Nous fournissons un accès distinctif aux utilisateurs tout en proposant des processus transparents qui incitent à des fonctionnalités efficaces plutôt qu'une architecture extensible, pour une communication et des services optimisés sur toutes les plateformes.";

const year = "30+";
const expareance = "Années d'expérience";

const aboutList = [
    {
        imgUrl: aboutIcon01,
        imgAlt: 'about icon rajibraj91 rajibraj',
        title: 'Instructeurs qualifiés',
        desc: 'Nous fournissons un accès distinctif aux utilisateurs tout en communiquant des services optimisés',
    },
    {
        imgUrl: aboutIcon02,
        imgAlt: 'about icon rajibraj91 rajibraj',
        title: 'Obtenez un certificat',
        desc: 'Nous fournissons un accès distinctif aux utilisateurs tout en communiquant des services optimisés',
    },
    {
        imgUrl: aboutIcon03,
        imgAlt: 'about icon rajibraj91 rajibraj',
        title: 'Cours en ligne',
        desc: 'Nous fournissons un accès distinctif aux utilisateurs tout en communiquant des services optimisés',
    },
]

const About = () => {
  return (
    <div>
        <PageHeader title={'À propos de notre marque'} curPage={'À propos'} />
        <div className="about-section style-3 padding-tb section-bg">
                <div className="container">
                    <div className="row justify-content-center row-cols-xl-2 row-cols-1 align-items-center">
                        <div className="col">
                            <div className="about-left">
                                <div className="about-thumb">
                                    <img src={about01} alt="about" />
                                </div>
                                <div className="abs-thumb">
                                    <img src={about02} alt="about" />
                                </div>
                                <div className="about-left-content">
                                    <h3>{year}</h3>
                                    <p>{expareance}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="about-right">
                                <div className="section-header">
                                    <span className="subtitle">{subTitle}</span>
                                    <h2 className="title">{title}</h2>
                                    <p>{desc}</p>
                                </div>
                                <div className="section-wrapper">
                                    <ul className="lab-ul">
                                        {aboutList.map((val, i) => (
                                            <li key={i}>
                                                <div className="sr-left">
                                                    <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                                                </div>
                                                <div className="sr-right">
                                                    <h5>{val.title}</h5>
                                                    <p>{val.desc}</p>
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
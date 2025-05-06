/* eslint-disable react/jsx-no-target-blank */

import React, { useEffect, useState } from "react";
import Link from "next/link";

const title = "À propos de ShopCart";
const desc = "Eduaid est le thème de l'université de classe mondiale numéro un. Des étudiants y étudient en permanence.";
const ItemTitle = "Catégories";
const quickTitle = "Liens rapides";
const tweetTitle = "Tweets récents";

const addressList = [
    {
        iconName: 'icofont-google-map',
        text: 'Évry, France.',
    },
    {
        iconName: 'icofont-phone',
        text: '07 60 78 54 93',
    },
    {
        iconName: 'icofont-envelope',
        text: 'minduse04@gmail.com',
    },
];

const socialList = [
    {
        iconName: 'icofont-facebook',
        siteLink: '#',
        className: 'facebook',
    },
    {
        iconName: 'icofont-twitter',
        siteLink: '#',
        className: 'twitter',
    },
    {
        iconName: 'icofont-linkedin',
        siteLink: '#',
        className: 'linkedin',
    },
    {
        iconName: 'icofont-instagram',
        siteLink: '#',
        className: 'instagram',
    },
    {
        iconName: 'icofont-pinterest',
        siteLink: '#',
        className: 'pinterest',
    },
];

const ItemList = [
    {
        text: 'Tous les produits',
        link: '/shop',
    },
    {
        text: 'Boutique',
        link: '/shop',
    },
    {
        text: 'À propos',
        link: '/about',
    },
    {
        text: 'Politique',
        link: '#',
    },
    {
        text: 'FAQs',
        link: '/about',
    },
];

const quickList = [
    {
        text: 'Newsletter',
        link: '/newsletter',
    },
    {
        text: "Sessions d'été",
        link: '#',
    },
    {
        text: 'Événements',
        link: '#',
    },
    {
        text: 'Galerie',
        link: '#',
    },
    {
        text: 'Forums',
        link: '#',
    },
    {
        text: 'Politique de confidentialité',
        link: '#',
    },
    {
        text: "Conditions d'utilisation",
        link: '#',
    },
];

const tweetList = [
    {
        iconName: 'icofont-twitter',
        desc: <p>Aminur islam <a href="#">@ShopCart Salut !  #Modèle_HTML</a> Profitez de notre offre spéciale, -50% !!</p>,
    },
    {
        iconName: 'icofont-twitter',
        desc: <p>Somrat islam <a href="#">@ShopCart Bonjour ! #Modèle_HTML</a> Profitez de notre offre spéciale, -50% !!</p>,
    },
];

const footerbottomList = [
    {
        text: 'Enseignants',
        link: '#',
    },
    {
        text: 'Personnel',
        link: '#',
    },
    {
        text: 'Étudiants',
        link: '#',
    },
    {
        text: 'Anciens élèves',
        link: '#',
    },
];

const Footer = () => {
    // État pour suivre si ce footer est l'instance principale
    const [isMainInstance, setIsMainInstance] = useState(false);
    const footerInstanceId = React.useId(); // Identifiant unique pour cette instance

    // Vérification pour éviter les duplications de Footer
    useEffect(() => {
        const checkInstanceStatus = () => {
            if (typeof window === 'undefined') return;
            
            // Trouver tous les footers
            const allFooters = document.querySelectorAll('footer.style-2');
            if (allFooters.length <= 1) {
                setIsMainInstance(true);
                return;
            }
            
            // Vérifier si un footer principal est déjà défini
            const mainFooterExists = document.querySelector('footer[data-main-footer="true"]');
            
            // Si aucun footer principal n'est défini, marquer cette instance comme principale
            if (!mainFooterExists) {
                const currentFooter = document.querySelector(`[data-footer-id="${footerInstanceId}"]`);
                if (currentFooter && currentFooter === allFooters[0]) {
                    currentFooter.setAttribute('data-main-footer', 'true');
                    setIsMainInstance(true);
                }
            } else {
                // Sinon, cette instance n'est pas principale si elle n'est pas déjà marquée
                const currentFooter = document.querySelector(`[data-footer-id="${footerInstanceId}"]`);
                setIsMainInstance(currentFooter && currentFooter.getAttribute('data-main-footer') === 'true');
            }
        };
        
        // Exécuter après le rendu complet
        setTimeout(checkInstanceStatus, 100);
    }, [footerInstanceId]);

    // Ne pas rendre le footer s'il n'est pas l'instance principale
    if (!isMainInstance) {
        return null;
    }

    return (
        <footer className="style-2" data-footer-id={footerInstanceId}>
            <div className="footer-top dark-view padding-tb">
                <div className="container">
                    <div className="row g-4 row-cols-xl-4 row-cols-sm-2 row-cols-1 justify-content-center">
                        <div className="col">
                            <div className="footer-item our-address">
                                <div className="footer-inner">
                                    <div className="footer-content">
                                        <div className="title">
                                            <h4>{title}</h4>
                                        </div>
                                        <div className="content">
                                            <p>{desc}</p>
                                            <ul className="lab-ul office-address">
                                                {addressList.map((val, i) => (
                                                    <li key={i}><i className={val.iconName}></i>{val.text}</li>
                                                ))}
                                            </ul>
                                            <ul className="lab-ul social-icons">
                                                {socialList.map((val, i) => (
                                                    <li key={i}>
                                                        <a href={val.siteLink} className={val.className}><i className={val.iconName}></i></a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="footer-item">
                                <div className="footer-inner">
                                    <div className="footer-content">
                                        <div className="title">
                                            <h4>{ItemTitle}</h4>
                                        </div>
                                        <div className="content">
                                            <ul className="lab-ul">
                                                {ItemList.map((val, i) => (
                                                    <li key={i}>
                                                        {val.link.startsWith('/') ? (
                                                            <Link href={val.link}>{val.text}</Link>
                                                        ) : (
                                                            <a href={val.link}>{val.text}</a>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="footer-item">
                                <div className="footer-inner">
                                    <div className="footer-content">
                                        <div className="title">
                                            <h4>{quickTitle}</h4>
                                        </div>
                                        <div className="content">
                                            <ul className="lab-ul">
                                                {quickList.map((val, i) => (
                                                    <li key={i}>
                                                        {val.link.startsWith('/') ? (
                                                            <Link href={val.link}>{val.text}</Link>
                                                        ) : (
                                                            <a href={val.link}>{val.text}</a>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="footer-item twitter-post">
                                <div className="footer-inner">
                                    <div className="footer-content">
                                        <div className="title">
                                            <h4>{tweetTitle}</h4>
                                        </div>
                                        <div className="content">
                                            <ul className="lab-ul">
                                                {tweetList.map((val, i) => (
                                                    <li key={i}>
                                                        <i className={val.iconName}></i>
                                                        {val.desc}
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
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="section-wrapper">
                        <p>&copy; 2023 <Link href="/">Shop Cart</Link> Designé par <a href="https://themeforest.net/user/CodexCoder" target="_blank">XYZ</a></p>
                        <div className="footer-bottom-list">
                            {footerbottomList.map((val, i) => (
                                <a href={val.link} key={i}>{val.text}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
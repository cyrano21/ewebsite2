
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const SEOHead = ({ 
  title, 
  description = "Votre boutique en ligne pour tous vos besoins d'achat. Découvrez notre large gamme de produits à des prix compétitifs.", 
  keywords = "e-commerce, boutique en ligne, achats, produits", 
  ogImage = "/assets/images/logo/logo.png",
  ogType = "website",
  canonicalUrl,
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://votre-site.com";
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : null;
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Meta tags pour les réseaux sociaux */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* URL canonique pour éviter le contenu dupliqué */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Balises pour les robots */}
      <meta name="robots" content="index, follow" />
      
      {/* Autres méta informations utiles */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      
      {/* Préconnexion pour améliorer les performances */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
};

SEOHead.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  ogType: PropTypes.string,
  canonicalUrl: PropTypes.string,
};

export default SEOHead;

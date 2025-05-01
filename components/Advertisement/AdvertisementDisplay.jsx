import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { trackImpression, trackClick, trackViewDuration } from '../../services/advertisementAnalytics';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { useRelevantAds, getCurrentDevice, getViewportSize } from '../../utils/targetingUtil';

const styles = {
  container: {
    margin: '15px 0',
    position: 'relative'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    gap: '10px'
  },
  controlButton: {
    padding: '5px 10px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background-color 0.2s'
  },
  controlLabel: {
    fontSize: '12px',
    color: '#666'
  },
  bannerContainer: {
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    transition: 'transform 0.3s ease'
  },
  popupContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'auto'
  },
  sidebarContainer: {
    width: '100%',
    marginBottom: '20px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  featuredContainer: {
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #eaeaea',
    backgroundColor: '#f9f9f9'
  },
  videoContainer: {
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#555',
    zIndex: 10
  },
  image: {
    width: '100%',
    display: 'block',
    transition: 'transform 0.3s ease'
  },
  adLink: {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit'
  },
  content: {
    padding: '15px',
    textAlign: 'center'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#333'
  },
  subtitle: {
    fontSize: '14px',
    margin: '0 0 10px 0',
    color: '#666'
  },
  description: {
    fontSize: '13px',
    color: '#777',
    margin: '0 0 15px 0'
  },
  button: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#4a90e2',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  smallLabel: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '10px',
    zIndex: 5
  }
};

const AdvertisementDisplay = ({ 
  position, 
  type, 
  limit = 1, 
  className = '', 
  style = {}, 
  rotationGroup = 'default', 
  enableRotation = true, 
  showControls = false
}) => {
  const [activePopup, setActivePopup] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [startViewTime, setStartViewTime] = useState(null);
  const [adContainerRef, isVisible] = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '0px'
  });
  
  // Utiliser notre hook personnalisé pour obtenir des publicités pertinentes
  const { 
    ads, 
    allAds,
    loading, 
    rotateAds,
    rotationIndex 
  } = useRelevantAds(position, type, limit, rotationGroup, enableRotation);
  
  // Détecter l'appareil et les dimensions de la fenêtre
  const [deviceType, setDeviceType] = useState('desktop');
  const [viewportSize, setViewportSize] = useState({ width: 1920, height: 1080 });
  
  // Initialisation des états et détection du device
  // Initialisation une seule fois au montage
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      // Détecter l'appareil une seule fois au montage
      setDeviceType(getCurrentDevice());
      
      // Détecter les dimensions initiales
      setViewportSize(getViewportSize());
      
      // Mettre à jour les dimensions lors du redimensionnement
      const handleResize = () => {
        setViewportSize(getViewportSize());
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        setIsMounted(false);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []); // Dépendances vides pour n'exécuter qu'au montage
  
  // Effet séparé pour le tracking de durée de visionnage
  useEffect(() => {
    // Pas besoin de s'exécuter si les conditions ne sont pas remplies
    if (!isMounted || !startViewTime || !ads || !ads[0]) return;
    
    // Uniquement pour le nettoyage
    return () => {
      // Si la publicité était visible, enregistrer la durée de visionnage avant de démonter
      trackViewDuration({
        id: ads[0]._id,
        position,
        type,
        page: router.pathname,
        deviceType,
        viewportSize
      }, startViewTime);
    };
  }, [ads, position, type, router.pathname, deviceType, viewportSize, startViewTime, isMounted]);
  
  // Effet pour le suivi de visibilité et enregistrement des impressions
  useEffect(() => {
    if (!isMounted || loading || !ads || ads.length === 0) return;
    
    const currentAd = ads[0]; // Le premier ad ou celui à l'index si on en affiche plusieurs
    
    if (isVisible && !startViewTime) {
      // La publicité vient d'entrer dans le viewport
      setStartViewTime(Date.now());
      
      // Enregistrer l'impression avec données de ciblage avancé
      trackImpression({
        id: currentAd._id,
        position,
        type,
        page: router.pathname,
        deviceType,
        viewportSize
      });
    } else if (!isVisible && startViewTime) {
      // La publicité vient de sortir du viewport, enregistrer la durée de visionnage
      trackViewDuration({
        id: currentAd._id,
        position,
        type,
        page: router.pathname,
        deviceType,
        viewportSize
      }, startViewTime);
      
      setStartViewTime(null);
    }
  }, [isVisible, isMounted, loading, ads, position, type, router.pathname, deviceType, viewportSize, startViewTime]);

  const handleAdClick = async (ad) => {
    if (!isMounted) return;
    
    try {
      // Enregistrer le clic via notre service d'analytics avec données avancées
      trackClick({
        id: ad._id,
        position,
        type,
        page: router.pathname,
        deviceType,
        viewportSize
      });
      
      // Si c'est un popup, afficher le popup
      if (ad.type === 'popup') {
        setActivePopup(ad);
        return;
      }
      
      // Sinon rediriger vers l'URL cible
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du clic:', error);
      // Rediriger même en cas d'erreur
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  if (loading || !ads || ads.length === 0) {
    return null; // Ne rien afficher pendant le chargement ou s'il n'y a pas de publicités
  }
  
  // Boutons de contrôle de rotation (uniquement si demandé)
  const renderControls = () => {
    if (!showControls || !enableRotation || allAds.length <= limit) return null;
    
    return (
      <div style={styles.controls}>
        <span style={styles.controlLabel}>
          {rotationIndex + 1}/{Math.max(1, allAds.length - limit + 1)}
        </span>
        <button 
          onClick={rotateAds} 
          style={styles.controlButton}
          aria-label="Afficher la publicité suivante"
        >
          Suivant
        </button>
      </div>
    );
  };

  const renderAd = (ad) => {
    const { type, content, imageUrl, videoUrl } = ad;
    const containerStyle = getContainerStyle(type);
    
    return (
      <div 
        ref={adContainerRef}
        style={{ ...containerStyle, ...style }} 
        className={`ad-container ${className}`} 
        key={ad._id}
        data-ad-id={ad._id}
        data-ad-position={position}
        data-ad-type={type}
      >
        <span style={styles.smallLabel}>Annonce</span>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.adLink}
          onClick={(e) => {
            e.preventDefault();
            handleAdClick(ad);
          }}
        >
          {type === 'video' ? (
            <div style={styles.videoContainer}>
              <video
                src={videoUrl}
                controls
                style={{ width: '100%' }}
                poster={imageUrl}
              />
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              {imageUrl && (
                <div className="ad-image-container" style={{ position: 'relative', width: '100%', height: type === 'banner' ? '250px' : type === 'sidebar' ? '300px' : '200px' }}>
                  <Image 
                    src={imageUrl} 
                    alt={content?.title || 'Publicité'} 
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              {content?.title && (
                <div style={styles.overlay}>
                  <h3 style={styles.title}>{content.title}</h3>
                  {content.description && (
                    <p style={styles.description}>{content.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </a>
      </div>
    );
  };

  const getContainerStyle = (type) => {
    switch (type) {
      case 'banner':
        return styles.bannerContainer;
      case 'sidebar':
        return styles.sidebarContainer;
      case 'featured':
        return styles.featuredContainer;
      case 'video':
        return styles.videoContainer;
      default:
        return styles.bannerContainer;
    }
  };

  // Rendu principal
  return (
    <>
      <div style={styles.container}>
        {/* Affichage des publicités */}
        {ads.map(ad => renderAd(ad))}
        
        {/* Contrôles de rotation si activés */}
        {renderControls()}
      </div>
      
      {/* Popup display if active */}
      {activePopup && (
        <>
          <div style={styles.overlay} onClick={closePopup}></div>
          <div style={styles.popupContainer}>
            <button style={styles.closeButton} onClick={closePopup}>
              &times;
            </button>
            {renderAd(activePopup)}
          </div>
        </>
      )}
      
      {/* Styles CSS pour la responsive */}
      <style jsx>{`
        .ad-container {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .ad-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }
        .ad-image-container img {
          transition: transform 0.5s ease;
        }
        .ad-container:hover .ad-image-container img {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .ad-container[data-ad-type="banner"] {
            margin: 10px 0;
          }
          .ad-container[data-ad-type="sidebar"] {
            margin: 10px 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default AdvertisementDisplay;

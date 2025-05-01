import React, { useState, useEffect } from 'react';
import { Alert, Card } from 'react-bootstrap';
import styles from './AdvertisementPreview.module.css';
import Image from 'next/image';

const AdvertisementPreview = ({ advertisement }) => {
  const [previewData, setPreviewData] = useState(null);
  
  useEffect(() => {
    if (!advertisement) {
      setPreviewData(null);
      return;
    }
    
    // Préparer les données pour la prévisualisation
    setPreviewData({
      type: advertisement.type,
      position: advertisement.position,
      imageUrl: advertisement.imageUrl,
      videoUrl: advertisement.videoUrl,
      targetUrl: advertisement.targetUrl,
      content: advertisement.content,
      dimensions: advertisement.dimensions
    });
  }, [advertisement]);
  
  // Si aucune publicité n'est sélectionnée
  if (!previewData) {
    return (
      <Alert variant="info">
        <i className="icofont-info-circle me-2"></i>
        Aucune publicité à prévisualiser. Veuillez créer ou modifier une publicité pour voir l&apos;aperçu.
      </Alert>
    );
  } 
  
  // Préparer les styles en fonction des dimensions (si spécifiées)
  const dimensionStyle = {};
  if (previewData.dimensions && previewData.dimensions.width > 0) {
    dimensionStyle.width = `${previewData.dimensions.width}px`;
  }
  if (previewData.dimensions && previewData.dimensions.height > 0) {
    dimensionStyle.height = `${previewData.dimensions.height}px`;
  }
  
  // Rendu en fonction du type de publicité
  const renderPreview = () => {
    switch (previewData.type) {
      case 'banner':
        return (
          <div className={styles.bannerPreview} style={dimensionStyle}>
            <a href={previewData.targetUrl} target="_blank" rel="noopener noreferrer" className={styles.previewLink}>
              <Image 
                src={previewData.imageUrl || 'https://via.placeholder.com/600x150?text=Banner+Preview'} 
                alt={previewData.content?.title || "Bannière publicitaire"} 
                className={styles.bannerImage}
                width={previewData.dimensions?.width || 600}
                height={previewData.dimensions?.height || 150}
              />
              {(previewData.content?.title || previewData.content?.subtitle) && (
                <div className={styles.bannerContent}>
                  {previewData.content?.title && <h3>{previewData.content.title}</h3>}
                  {previewData.content?.subtitle && <p>{previewData.content.subtitle}</p>}
                  {previewData.content?.buttonText && (
                    <button className={styles.bannerButton}>
                      {previewData.content.buttonText}
                    </button>
                  )}
                </div>
              )}
            </a>
          </div>
        );
        
      case 'popup':
        return (
          <div className={styles.popupContainer}>
            <div className={styles.popupPreview} style={dimensionStyle}>
              <div className={styles.popupHeader}>
                <span className={styles.popupClose}>×</span>
              </div>
              <div className={styles.popupContent}>
                {previewData.imageUrl && (
                  <Image 
                    src={previewData.imageUrl} 
                    alt={previewData.content?.title || "Popup publicitaire"} 
                    className={styles.popupImage}
                    width={previewData.dimensions?.width || 400}
                    height={previewData.dimensions?.height || 300}
                  />
                )}
                <div className={styles.popupTextContent}>
                  {previewData.content?.title && <h3>{previewData.content.title}</h3>}
                  {previewData.content?.subtitle && <h5>{previewData.content.subtitle}</h5>}
                  {previewData.content?.description && <p>{previewData.content.description}</p>}
                  {previewData.content?.buttonText && (
                    <button className={styles.popupButton}>
                      {previewData.content.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'sidebar':
        return (
          <div className={styles.sidebarPreview} style={dimensionStyle}>
            <a href={previewData.targetUrl} target="_blank" rel="noopener noreferrer" className={styles.previewLink}>
              <Image 
                src={previewData.imageUrl || 'https://via.placeholder.com/300x600?text=Sidebar+Preview'} 
                alt={previewData.content?.title || "Publicité barre latérale"} 
                className={styles.sidebarImage}
                width={previewData.dimensions?.width || 300}
                height={previewData.dimensions?.height || 600}
              />
              {previewData.content?.title && (
                <div className={styles.sidebarContent}>
                  <h4>{previewData.content.title}</h4>
                  {previewData.content?.buttonText && (
                    <button className={styles.sidebarButton}>
                      {previewData.content.buttonText}
                    </button>
                  )}
                </div>
              )}
            </a>
          </div>
        );
        
      case 'featured':
        return (
          <div className={styles.featuredPreview} style={dimensionStyle}>
            <a href={previewData.targetUrl} target="_blank" rel="noopener noreferrer" className={styles.previewLink}>
              <div className={styles.featuredContainer}>
                <Image 
                  src={previewData.imageUrl || 'https://via.placeholder.com/400x300?text=Featured+Preview'} 
                  alt={previewData.content?.title || "Publicité mise en avant"} 
                  className={styles.featuredImage}
                  width={previewData.dimensions?.width || 400}
                  height={previewData.dimensions?.height || 300}
                />
                <div className={styles.featuredContent}>
                  {previewData.content?.title && <h3>{previewData.content.title}</h3>}
                  {previewData.content?.subtitle && <h5>{previewData.content.subtitle}</h5>}
                  {previewData.content?.description && <p>{previewData.content.description}</p>}
                  {previewData.content?.buttonText && (
                    <button className={styles.featuredButton}>
                      {previewData.content.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </a>
          </div>
        );
        
      case 'video':
        return (
          <div className={styles.videoPreview} style={dimensionStyle}>
            {previewData.videoUrl ? (
              <div className={styles.videoContainer}>
                <iframe
                  src={previewData.videoUrl}
                  title={previewData.content?.title || "Publicité vidéo"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.videoIframe}
                ></iframe>
              </div>
            ) : (
              <div className={styles.videoPlaceholder}>
                <i className="icofont-ui-video-play"></i>
                <p>Aucune URL vidéo spécifiée</p>
              </div>
            )}
            {previewData.content?.title && (
              <div className={styles.videoCaption}>
                <h4>{previewData.content.title}</h4>
                {previewData.content?.description && <p>{previewData.content.description}</p>}
              </div>
            )}
          </div>
        );
        
      case 'carousel':
        return (
          <div className={styles.carouselPreview} style={dimensionStyle}>
            <div className={styles.carouselSlide}>
              <Image 
                src={previewData.imageUrl || 'https://via.placeholder.com/800x400?text=Carousel+Slide'} 
                alt={previewData.content?.title || "Slide de carousel"} 
                className={styles.carouselImage}
                width={previewData.dimensions?.width || 800}
                height={previewData.dimensions?.height || 400}
              />
              <div className={styles.carouselCaption}>
                {previewData.content?.title && <h3>{previewData.content.title}</h3>}
                {previewData.content?.subtitle && <p>{previewData.content.subtitle}</p>}
                {previewData.content?.buttonText && (
                  <button className={styles.carouselButton}>
                    {previewData.content.buttonText}
                  </button>
                )}
              </div>
              <div className={styles.carouselControls}>
                <span className={styles.carouselPrev}>‹</span>
                <span className={styles.carouselNext}>›</span>
              </div>
              <div className={styles.carouselIndicators}>
                <span className={`${styles.indicator} ${styles.active}`}></span>
                <span className={styles.indicator}></span>
                <span className={styles.indicator}></span>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <Alert variant="warning">
            <i className="icofont-warning-alt me-2"></i>
            Type de publicité non reconnu ou non supporté pour la prévisualisation.
          </Alert>
        );
    }
  };
  
  return (
    <div className={styles.previewContainer}>
      <div className={styles.positionLabel}>
        <span className="badge bg-secondary">
          Position: {getPositionLabel(previewData.position)}
        </span>
      </div>
      
      <div className={styles.previewWrapper}>
        {renderPreview()}
      </div>
      
      <Card className="mt-3">
        <Card.Body className="p-2">
          <small className="text-muted">
            <i className="icofont-info-circle me-1"></i>
            Ceci est une prévisualisation simplifiée. L&apos;apparence réelle peut varier selon la mise en page du site.
          </small>
        </Card.Body>
      </Card>
    </div>
  );
};

// Helper pour obtenir le libellé de la position
const getPositionLabel = (position) => {
  switch (position) {
    case 'home': return 'Page d\'accueil';
    case 'shop': return 'Boutique';
    case 'product': return 'Page produit';
    case 'checkout': return 'Paiement';
    case 'category': return 'Catégories';
    case 'blog': return 'Blog';
    case 'global': return 'Global (toutes pages)';
    default: return position;
  }
};

export default AdvertisementPreview;

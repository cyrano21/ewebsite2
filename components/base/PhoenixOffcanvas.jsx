import React, { useEffect } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import styles from './PhoenixOffcanvas.module.css';

const PhoenixOffcanvas = ({ 
  children, 
  show, 
  onHide, 
  title, 
  placement = 'end', 
  backdrop = true,
  scrollable = false,
  size = 'regular',
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  closeButton = true,
}) => {
  // Empêcher le défilement du body lorsque le offcanvas est ouvert
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  // Déterminer la classe de taille
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
      case 'small':
        return styles.offcanvasSm;
      case 'lg':
      case 'large':
        return styles.offcanvasLg;
      case 'xl':
      case 'extra-large':
        return styles.offcanvasXl;
      default:
        return '';
    }
  };

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement={placement}
      backdrop={backdrop}
      scroll={scrollable}
      className={`${styles.phoenixOffcanvas} ${getSizeClass()} ${className}`}
    >
      {title && (
        <Offcanvas.Header 
          closeButton={closeButton} 
          className={`${styles.offcanvasHeader} ${headerClassName}`}
        >
          <Offcanvas.Title className={styles.offcanvasTitle}>
            {title}
          </Offcanvas.Title>
        </Offcanvas.Header>
      )}
      
      <Offcanvas.Body className={`${scrollable ? styles.offcanvasScrollable : ''} ${bodyClassName}`}>
        {children}
      </Offcanvas.Body>
      
      {footer && (
        <div className={`${styles.offcanvasFooter} ${footerClassName}`}>
          {footer}
        </div>
      )}
    </Offcanvas>
  );
};

export default PhoenixOffcanvas;
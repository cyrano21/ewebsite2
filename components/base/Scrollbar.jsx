import React, { useRef, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import styles from './Scrollbar.module.css';

const Scrollbar = ({ 
  children, 
  className = '', 
  style = {}, 
  height,
  maxHeight,
  autoHide = true,
  ...props 
}) => {
  const scrollbarRef = useRef(null);

  // Appliquer la hauteur ou la hauteur maximale si spécifiée
  const scrollbarStyle = {
    ...style,
    ...(height && { height }),
    ...(maxHeight && { maxHeight }),
  };

  return (
    <SimpleBar
      ref={scrollbarRef}
      className={`${styles.phoenixScrollbar} ${className}`}
      style={scrollbarStyle}
      autoHide={autoHide}
      {...props}
    >
      {children}
    </SimpleBar>
  );
};

export default Scrollbar;
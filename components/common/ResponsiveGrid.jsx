
import React from 'react';
import { useDeviceType, isMobile, isTablet, getResponsiveClasses } from '../../utils/deviceDetect';

/**
 * Composant de grille responsive qui ajuste automatiquement le nombre de colonnes
 * selon la taille de l'écran
 */
const ResponsiveGrid = ({
  children,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  gap = '1rem',
  className = '',
  style = {},
  ...props
}) => {
  const deviceType = useDeviceType();
  
  // Déterminer le nombre de colonnes en fonction du type d'appareil
  let columns = desktopColumns;
  if (isMobile(deviceType)) columns = mobileColumns;
  else if (isTablet(deviceType)) columns = tabletColumns;
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    ...style
  };
  
  return (
    <div 
      className={className} 
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;

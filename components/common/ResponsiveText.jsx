
import React from 'react';
import { useDeviceType, isMobile, isTablet } from '../../utils/deviceDetect';

/**
 * Composant pour rendre du texte avec des tailles différentes selon le type d'appareil
 */
const ResponsiveText = ({ 
  children, 
  component = 'p',
  mobileStyle = {},
  tabletStyle = {},
  desktopStyle = {},
  style = {},
  className = '',
  ...props 
}) => {
  const deviceType = useDeviceType();
  
  // Fusionner les styles en fonction du type d'appareil
  const responsiveStyle = {
    ...style,
    ...(isMobile(deviceType) ? mobileStyle : {}),
    ...(isTablet(deviceType) ? tabletStyle : {}),
    ...(!isMobile(deviceType) && !isTablet(deviceType) ? desktopStyle : {})
  };
  
  // Rendre le composant dynamiquement
  const Component = component;
  
  return (
    <Component 
      style={responsiveStyle} 
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

export default ResponsiveText;

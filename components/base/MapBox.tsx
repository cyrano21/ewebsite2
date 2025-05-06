import React from 'react';

// Composant temporaire pour résoudre l'erreur de build
interface MapBoxProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  zoom?: number;
  center?: [number, number];
  // Autres propriétés que vous pourriez avoir besoin
}

const MapBox = ({
  className = '',
  height = '400px',
  width = '100%',
  zoom = 12,
  center = [48.8566, 2.3522], // Paris par défaut
}: MapBoxProps) => {
  return (
    <div 
      className={`map-container ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#6c757d',
        fontWeight: 'bold',
        padding: '20px'
      }}
    >
      Carte de livraison
      <br />
      <small>(Composant de carte à implémenter)</small>
    </div>
  );
};

export default MapBox;
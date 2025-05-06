import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AppSection = () => {
  return (
    <div className="app-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="app-content">
              <h2>Téléchargez notre application mobile</h2>
              <p>
                Accédez à notre boutique en ligne où que vous soyez. Notre application mobile 
                vous offre une expérience d'achat fluide et des fonctionnalités exclusives.
              </p>
              <div className="app-buttons">
                <Link href="#" className="app-btn">
                  <i className="fab fa-google-play"></i> Google Play
                </Link>
                <Link href="#" className="app-btn">
                  <i className="fab fa-apple"></i> App Store
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="app-image">
              {/* Utilisation d'une div de placeholder au lieu d'Image pour éviter les erreurs */}
              <div 
                style={{
                  width: '100%',
                  height: '500px',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Image de l'application mobile
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSection;
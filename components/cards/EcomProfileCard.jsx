import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

const EcomProfileCard = ({ user, onLogout }) => {
  if (!user) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des données utilisateur...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      {/* Cover Image */}
      <div 
        className="profile-cover"
        style={{ 
          height: '120px', 
          backgroundImage: user.coverImage ? `url(${user.coverImage})` : 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <Card.Body className="pt-0">
        <div 
          className="profile-picture-container d-flex justify-content-center"
          style={{ marginTop: '-50px' }}
        >
          <div className="position-relative">
            <Image
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=random&color=fff&size=128`}
              alt={user.displayName || 'Utilisateur'}
              width={100}
              height={100}
              roundedCircle
              className="border border-4 border-white shadow-sm"
            />
            <Button 
              variant="primary" 
              size="sm" 
              className="position-absolute bottom-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              as={Link}
              href="/customer/EditProfile"
            >
              <i className="icofont-edit"></i>
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-3">
          <h4 className="mb-1">{user.displayName || 'Utilisateur'}</h4>
          <p className="text-muted mb-3">{user.email}</p>
          
          <div className="user-meta d-flex justify-content-center gap-4 mb-4">
            <div className="text-center">
              <h5 className="mb-0">{user.ordersCount || 0}</h5>
              <small className="text-muted">Commandes</small>
            </div>
            <div className="text-center">
              <h5 className="mb-0">{user.reviewsCount || 0}</h5>
              <small className="text-muted">Avis</small>
            </div>
            <div className="text-center">
              <h5 className="mb-0">{user.wishlistCount || 0}</h5>
              <small className="text-muted">Favoris</small>
            </div>
          </div>
          
          <div className="profile-actions">
            <Button 
              variant="outline-primary" 
              className="me-2"
              as={Link}
              href="/customer/EditProfile"
            >
              <i className="icofont-ui-edit me-1"></i>
              Modifier profil
            </Button>
            <Button 
              variant="outline-danger"
              onClick={onLogout}
            >
              <i className="icofont-logout me-1"></i>
              Déconnexion
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EcomProfileCard;
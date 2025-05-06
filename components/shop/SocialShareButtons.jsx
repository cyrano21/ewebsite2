
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const SocialShareButtons = ({ url, title, description, image }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || '');
  const encodedImage = image ? encodeURIComponent(image) : '';

  const socialLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: 'icofont-facebook',
      color: '#3b5998'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: 'icofont-twitter',
      color: '#1da1f2'
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      icon: 'icofont-pinterest',
      color: '#bd081c'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: 'icofont-linkedin',
      color: '#0077b5'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: 'icofont-whatsapp',
      color: '#25d366'
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
      icon: 'icofont-email',
      color: '#333333'
    }
  ];

  const handleShare = (link, e) => {
    e.preventDefault();
    window.open(link, '_blank', 'width=600,height=400');
  };

  return (
    <div className="social-share-container my-3">
      <h6 className="mb-2">Partager ce produit :</h6>
      <ButtonGroup size="sm" className="social-share-buttons">
        {socialLinks.map((social, index) => (
          <Button
            key={index}
            variant="light"
            className="me-1 mb-1 social-btn"
            onClick={(e) => handleShare(social.url, e)}
            title={`Partager sur ${social.name}`}
            aria-label={`Partager sur ${social.name}`}
            style={{
              borderColor: social.color,
              color: social.color
            }}
          >
            <i className={social.icon}></i>
          </Button>
        ))}
      </ButtonGroup>
      
      <style jsx>{`
        .social-btn {
          transition: all 0.3s ease;
          width: 36px;
          height: 36px;
          padding: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .social-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }
        .social-btn i {
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default SocialShareButtons;

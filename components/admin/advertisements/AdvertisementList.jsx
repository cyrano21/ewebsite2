import React from 'react';
import { Table, Button, Badge, Pagination } from 'react-bootstrap';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdvertisementList = ({ 
  advertisements, 
  onEdit, 
  onDelete, 
  page, 
  totalPages, 
  onPageChange 
}) => {
  // Fonction pour obtenir le statut avec sa couleur
  const getStatusBadge = (status) => {
    let variant;
    let label;
    
    switch (status) {
      case 'draft':
        variant = 'secondary';
        label = 'Brouillon';
        break;
      case 'scheduled':
        variant = 'info';
        label = 'Planifié';
        break;
      case 'active':
        variant = 'success';
        label = 'Actif';
        break;
      case 'paused':
        variant = 'warning';
        label = 'En pause';
        break;
      case 'completed':
        variant = 'primary';
        label = 'Terminé';
        break;
      case 'archived':
        variant = 'dark';
        label = 'Archivé';
        break;
      default:
        variant = 'light';
        label = status;
    }
    
    return <Badge bg={variant}>{label}</Badge>;
  };
  
  // Fonction pour obtenir le type avec sa couleur
  const getTypeBadge = (type) => {
    let variant;
    let label;
    
    switch (type) {
      case 'banner':
        variant = 'primary';
        label = 'Bannière';
        break;
      case 'popup':
        variant = 'warning';
        label = 'Popup';
        break;
      case 'sidebar':
        variant = 'info';
        label = 'Barre latérale';
        break;
      case 'featured':
        variant = 'success';
        label = 'Mis en avant';
        break;
      case 'video':
        variant = 'danger';
        label = 'Vidéo';
        break;
      case 'carousel':
        variant = 'dark';
        label = 'Carousel';
        break;
      default:
        variant = 'light';
        label = type;
    }
    
    return <Badge bg={variant}>{label}</Badge>;
  };
  
  // Fonction pour obtenir la position avec sa couleur
  const getPositionBadge = (position) => {
    let variant;
    let label;
    
    switch (position) {
      case 'home':
        variant = 'success';
        label = 'Accueil';
        break;
      case 'shop':
        variant = 'primary';
        label = 'Boutique';
        break;
      case 'product':
        variant = 'info';
        label = 'Produit';
        break;
      case 'checkout':
        variant = 'warning';
        label = 'Paiement';
        break;
      case 'category':
        variant = 'secondary';
        label = 'Catégorie';
        break;
      case 'blog':
        variant = 'danger';
        label = 'Blog';
        break;
      case 'global':
        variant = 'dark';
        label = 'Global';
        break;
      default:
        variant = 'light';
        label = position;
    }
    
    return <Badge bg={variant}>{label}</Badge>;
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      return 'Date invalide';
    }
  };
  
  // Générer les éléments de pagination
  const getPaginationItems = () => {
    const items = [];
    
    // Bouton précédent
    items.push(
      <Pagination.Prev 
        key="prev" 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 1}
      />
    );
    
    // Première page
    if (page > 2) {
      items.push(
        <Pagination.Item 
          key={1} 
          onClick={() => onPageChange(1)}
        >
          1
        </Pagination.Item>
      );
      
      if (page > 3) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }
    
    // Page précédente
    if (page > 1) {
      items.push(
        <Pagination.Item 
          key={page - 1} 
          onClick={() => onPageChange(page - 1)}
        >
          {page - 1}
        </Pagination.Item>
      );
    }
    
    // Page actuelle
    items.push(
      <Pagination.Item 
        key={page} 
        active
      >
        {page}
      </Pagination.Item>
    );
    
    // Page suivante
    if (page < totalPages) {
      items.push(
        <Pagination.Item 
          key={page + 1} 
          onClick={() => onPageChange(page + 1)}
        >
          {page + 1}
        </Pagination.Item>
      );
    }
    
    // Dernière page
    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      
      items.push(
        <Pagination.Item 
          key={totalPages} 
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    // Bouton suivant
    items.push(
      <Pagination.Next 
        key="next" 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === totalPages}
      />
    );
    
    return items;
  };
  
  return (
    <div>
      {advertisements.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <i className="icofont-warning-alt fs-1 text-warning"></i>
          <p className="mt-3">Aucune publicité trouvée avec les filtres actuels.</p>
        </div>
      ) : (
        <>
          <Table hover responsive className="align-middle">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Position</th>
                <th>Période</th>
                <th>Statut</th>
                <th>Analytique</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {advertisements.map((ad) => (
                <tr key={ad._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {ad.imageUrl && (
                        <div 
                          className="rounded me-2 overflow-hidden" 
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            backgroundImage: `url(${ad.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        ></div>
                      )}
                      <div>
                        <div className="fw-bold">{ad.name}</div>
                        <small className="text-muted">{ad.targetUrl}</small>
                      </div>
                    </div>
                  </td>
                  <td>{getTypeBadge(ad.type)}</td>
                  <td>{getPositionBadge(ad.position)}</td>
                  <td>
                    <div>Du: {formatDate(ad.startDate)}</div>
                    <div>Au: {formatDate(ad.endDate)}</div>
                  </td>
                  <td>
                    {getStatusBadge(ad.status)}
                    {ad.isActive ? (
                      <Badge bg="success" className="ms-1">Actif</Badge>
                    ) : (
                      <Badge bg="secondary" className="ms-1">Inactif</Badge>
                    )}
                  </td>
                  <td>
                    <div className="small">
                      <div><i className="icofont-eye me-1"></i> {ad.analytics?.impressions ?? 0} impressions</div>
                      <div><i className="icofont-click me-1"></i> {ad.analytics?.clicks ?? 0} clics</div>
                      <div><i className="icofont-chart-bar-graph me-1"></i> {(ad.analytics?.ctr ?? 0).toFixed(2)}% CTR</div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex">
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        className="me-1" 
                        onClick={() => onEdit(ad)}
                        title="Modifier"
                      >
                        <i className="icofont-edit"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => onDelete(ad._id)}
                        title="Supprimer"
                      >
                        <i className="icofont-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>{getPaginationItems()}</Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvertisementList;

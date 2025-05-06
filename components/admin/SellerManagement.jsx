import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, Tab, Tabs, Alert } from 'react-bootstrap';
import Image from 'next/image';
import PageHeader from '../PageHeader';
import LoadingSpinner from '../LoadingSpinner.jsx';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [showModal, setShowModal] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);

  // Fetch sellers data
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sellers?status=${activeTab}`);
        const data = await response.json();
        
        if (data.success) {
          setSellers(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des vendeurs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [activeTab, actionSuccess]);

  const handleViewDetails = (seller) => {
    setCurrentSeller(seller);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSeller(null);
    setRejectionReason('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleStatusChange = async (sellerId, newStatus, reason = null) => {
    try {
      setLoading(true);
      
      const payload = { status: newStatus };
      if (reason) {
        payload.rejectionReason = reason;
      }
      
      const response = await fetch(`/api/sellers/${sellerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionSuccess(`Statut du vendeur mis à jour avec succès à: ${newStatus}`);
        // Fermer le modal après action
        handleCloseModal();
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setActionSuccess(null);
        }, 5000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (sellerId) => {
    handleStatusChange(sellerId, 'approved');
  };

  const handleReject = (sellerId) => {
    if (!rejectionReason.trim()) {
      setError("Veuillez fournir une raison de rejet");
      return;
    }
    handleStatusChange(sellerId, 'rejected', rejectionReason);
  };

  const handleSuspend = (sellerId) => {
    handleStatusChange(sellerId, 'suspended');
  };

  const handleReactivate = (sellerId) => {
    handleStatusChange(sellerId, 'approved');
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'pending':
        variant = 'warning';
        break;
      case 'approved':
        variant = 'success';
        break;
      case 'rejected':
        variant = 'danger';
        break;
      case 'suspended':
        variant = 'secondary';
        break;
      default:
        variant = 'info';
    }
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  return (
    <div>
      <PageHeader title="Gestion des Vendeurs" curPage="Admin" />
      
      <Container fluid className="py-4">
        {actionSuccess && (
          <Alert variant="success" dismissible onClose={() => setActionSuccess(null)}>
            {actionSuccess}
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white py-3">
            <h5 className="mb-0">Demandes et Comptes Vendeurs</h5>
          </Card.Header>
          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={handleTabChange}
              className="mb-4"
            >
              <Tab eventKey="pending" title={<span>En attente <Badge bg="warning">{sellers.filter(s => s.status === 'pending').length || 0}</Badge></span>}>
              </Tab>
              <Tab eventKey="approved" title="Approuvés">
              </Tab>
              <Tab eventKey="rejected" title="Rejetés">
              </Tab>
              <Tab eventKey="suspended" title="Suspendus">
              </Tab>
            </Tabs>
            
            {loading ? (
              <LoadingSpinner />
            ) : sellers.length === 0 ? (
              <div className="text-center py-5">
                <p className="mb-0">Aucun vendeur trouvé avec le statut: {activeTab}</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover bordered>
                  <thead className="bg-light">
                    <tr>
                      <th>Vendeur</th>
                      <th>Entreprise</th>
                      <th>Contact</th>
                      <th>Date de demande</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((seller) => (
                      <tr key={seller._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              {seller.user?.profileImage ? (
                                <Image 
                                  src={seller.user.profileImage} 
                                  alt={seller.user?.name || 'Avatar'}
                                  width={40}
                                  height={40}
                                  className="rounded-circle"
                                />
                              ) : (
                                <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                  {seller.user?.name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="fw-bold mb-0">{seller.user?.name || 'Utilisateur inconnu'}</p>
                              <p className="text-muted mb-0">{seller.user?.email || 'Email inconnu'}</p>
                            </div>
                          </div>
                        </td>
                        <td>{seller.businessName}</td>
                        <td>
                          <p className="mb-0">{seller.contactPhone}</p>
                          <p className="mb-0">{seller.contactEmail}</p>
                        </td>
                        <td>{new Date(seller.createdAt).toLocaleDateString()}</td>
                        <td>{renderStatusBadge(seller.status)}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleViewDetails(seller)}
                          >
                            Détails
                          </Button>
                          
                          {seller.status === 'pending' && (
                            <>
                              <Button 
                                variant="success" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleApprove(seller.user._id)}
                              >
                                Approuver
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleViewDetails(seller)}
                              >
                                Rejeter
                              </Button>
                            </>
                          )}
                          
                          {seller.status === 'approved' && (
                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => handleSuspend(seller.user._id)}
                            >
                              Suspendre
                            </Button>
                          )}
                          
                          {seller.status === 'suspended' && (
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => handleReactivate(seller.user._id)}
                            >
                              Réactiver
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      {/* Modal pour les détails du vendeur */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du Vendeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentSeller && (
            <div>
              <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                  {currentSeller.logo ? (
                    <Image 
                      src={currentSeller.logo} 
                      alt={currentSeller.businessName}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                  ) : (
                    <div className="bg-light border rounded d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                      <span className="text-muted">Logo</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="mb-0">{currentSeller.businessName}</h4>
                  <p className="text-muted mb-0">{renderStatusBadge(currentSeller.status)} depuis le {new Date(currentSeller.status === 'approved' ? currentSeller.approvedAt : currentSeller.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Informations Générales</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Description</dt>
                    <dd className="col-sm-8">{currentSeller.businessDescription}</dd>
                    
                    <dt className="col-sm-4">Adresse</dt>
                    <dd className="col-sm-8">
                      {currentSeller.address?.street}, {currentSeller.address?.city}, {currentSeller.address?.postalCode}, {currentSeller.address?.country}
                    </dd>
                    
                    <dt className="col-sm-4">Téléphone</dt>
                    <dd className="col-sm-8">{currentSeller.contactPhone}</dd>
                    
                    <dt className="col-sm-4">Email</dt>
                    <dd className="col-sm-8">{currentSeller.contactEmail}</dd>
                    
                    <dt className="col-sm-4">Site Web</dt>
                    <dd className="col-sm-8">{currentSeller.website || 'Non spécifié'}</dd>
                    
                    <dt className="col-sm-4">ID Fiscal</dt>
                    <dd className="col-sm-8">{currentSeller.taxId || 'Non spécifié'}</dd>
                  </dl>
                </Col>
                <Col md={6}>
                  <h5>Informations Bancaires</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Titulaire</dt>
                    <dd className="col-sm-8">{currentSeller.bankInfo?.accountHolder || 'Non spécifié'}</dd>
                    
                    <dt className="col-sm-4">Banque</dt>
                    <dd className="col-sm-8">{currentSeller.bankInfo?.bankName || 'Non spécifié'}</dd>
                    
                    <dt className="col-sm-4">IBAN</dt>
                    <dd className="col-sm-8">{currentSeller.bankInfo?.iban || 'Non spécifié'}</dd>
                    
                    <dt className="col-sm-4">SWIFT</dt>
                    <dd className="col-sm-8">{currentSeller.bankInfo?.swift || 'Non spécifié'}</dd>
                  </dl>
                  
                  <h5 className="mt-3">Statistiques</h5>
                  <dl className="row">
                    <dt className="col-sm-4">Évaluation</dt>
                    <dd className="col-sm-8">{currentSeller.rating} / 5 ({currentSeller.reviewsCount} avis)</dd>
                    
                    <dt className="col-sm-4">Ventes totales</dt>
                    <dd className="col-sm-8">{currentSeller.totalSales}</dd>
                    
                    <dt className="col-sm-4">Commission</dt>
                    <dd className="col-sm-8">{currentSeller.commissionRate}%</dd>
                  </dl>
                </Col>
              </Row>
              
              {/* Documents de vérification */}
              <h5>Documents de vérification</h5>
              <div className="d-flex flex-wrap">
                {currentSeller.verificationDocuments && currentSeller.verificationDocuments.length > 0 ? (
                  currentSeller.verificationDocuments.map((doc, index) => (
                    <div key={index} className="me-3 mb-3">
                      <Image 
                        src={doc} 
                        alt={`Document ${index + 1}`}
                        width={120}
                        height={120}
                        className="rounded border"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Aucun document fourni</p>
                )}
              </div>
              
              {/* Raison de rejet (si rejeté) */}
              {currentSeller.status === 'rejected' && currentSeller.rejectionReason && (
                <div className="mt-4">
                  <Alert variant="danger">
                    <h5>Raison du rejet:</h5>
                    <p className="mb-0">{currentSeller.rejectionReason}</p>
                  </Alert>
                </div>
              )}
              
              {/* Formulaire de rejet */}
              {currentSeller.status === 'pending' && (
                <div className="mt-4">
                  <h5>Action sur la demande</h5>
                  <div className="d-flex">
                    <Button 
                      variant="success" 
                      className="me-2"
                      onClick={() => handleApprove(currentSeller.user._id)}
                    >
                      Approuver la demande
                    </Button>
                    
                    <Form className="flex-grow-1">
                      <Form.Group>
                        <Form.Control
                          as="textarea"
                          placeholder="Raison du rejet (obligatoire)"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={2}
                        />
                      </Form.Group>
                      <Button 
                        variant="danger" 
                        className="mt-2"
                        onClick={() => handleReject(currentSeller.user._id)}
                        disabled={!rejectionReason.trim()}
                      >
                        Rejeter la demande
                      </Button>
                    </Form>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SellerManagement;

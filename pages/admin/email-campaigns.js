// pages/admin/email-campaigns.js
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tabs, Tab, Form, Modal, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import AdminLayout from '../../components/admin/AdminLayout';
import Head from 'next/head';
import { AuthContext } from '../../contexts/AuthProvider';
import { FaEnvelope, FaCalendarAlt, FaUsers, FaUserCheck, FaChartLine, FaEdit, FaTrash, FaPlay, FaPause, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

const EmailCampaigns = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignAction, setCampaignAction] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);
  const { user } = useContext(AuthContext);

  // État pour un nouveau modèle d'email
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  
  // État pour la planification
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth-token');
        
        if (!token) {
          setError('Authentification requise');
          setLoading(false);
          return;
        }
        
        const res = await fetch('/api/admin/email-campaigns', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        
        if (data.success) {
          setCampaigns(data.campaigns);
        } else {
          setError(data.message || 'Erreur lors de la récupération des campagnes');
        }
      } catch (error) {
        setError('Erreur lors de la récupération des campagnes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.role === 'admin') {
      fetchCampaigns();
    } else {
      setError('Accès réservé aux administrateurs');
      setLoading(false);
    }
  }, [user]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non planifiée';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (e) {
      console.error("Erreur lors du formatage de la date:", e);
      return dateString;
    }
  };

  // Fonction pour exécuter une action sur une campagne
  const handleCampaignAction = async (action, campaign) => {
    try {
      setCampaignAction(action);
      setActionSuccess(null);
      setActionError(null);
      
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        setActionError('Authentification requise');
        setCampaignAction(null);
        return;
      }
      
      let endpoint = '';
      let method = 'POST';
      let body = { campaignId: campaign._id };
      
      switch(action) {
        case 'schedule':
          endpoint = '/api/admin/schedule-campaign';
          // Combiner la date et l'heure
          const scheduledDateTime = scheduledDate && scheduledTime 
            ? new Date(`${scheduledDate}T${scheduledTime}:00`) 
            : new Date();
          body.scheduledFor = scheduledDateTime;
          break;
        case 'start':
          endpoint = '/api/admin/start-campaign';
          break;
        case 'pause':
          endpoint = '/api/admin/pause-campaign';
          break;
        case 'delete':
          endpoint = '/api/admin/delete-campaign';
          method = 'DELETE';
          break;
        default:
          setActionError('Action non reconnue');
          setCampaignAction(null);
          return;
      }
      
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setActionSuccess(data.message || `L'action ${action} a été effectuée avec succès`);
        
        // Mettre à jour les campagnes après une action réussie
        const updatedCampaigns = [...campaigns];
        const campaignIndex = updatedCampaigns.findIndex(c => c._id === campaign._id);
        
        if (action === 'delete') {
          // Supprimer la campagne de la liste
          if (campaignIndex !== -1) {
            updatedCampaigns.splice(campaignIndex, 1);
          }
        } else if (campaignIndex !== -1) {
          // Mettre à jour le statut de la campagne
          updatedCampaigns[campaignIndex] = { 
            ...updatedCampaigns[campaignIndex], 
            ...data.updatedCampaign 
          };
        }
        
        setCampaigns(updatedCampaigns);
        
        // Fermer les modals après action réussie
        setShowCampaignModal(false);
        setShowDeleteModal(false);
        setSelectedCampaign(null);
        
        // Réinitialiser les champs de formulaire
        setScheduledDate('');
        setScheduledTime('');
      } else {
        setActionError(data.message || 'Erreur lors de l\'exécution de l\'action');
      }
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error);
      setActionError(`Une erreur est survenue lors de l'action ${action}`);
    } finally {
      setCampaignAction(null);
    }
  };
  
  // Fonction pour créer un nouveau modèle d'email
  const createEmailTemplate = async () => {
    try {
      setCampaignAction('createTemplate');
      setActionSuccess(null);
      setActionError(null);
      
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        setActionError('Authentification requise');
        setCampaignAction(null);
        return;
      }
      
      if (!templateName || !templateSubject || !templateContent) {
        setActionError('Veuillez remplir tous les champs du modèle');
        setCampaignAction(null);
        return;
      }
      
      const res = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: templateName,
          subject: templateSubject,
          content: templateContent
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setActionSuccess('Modèle d\'email créé avec succès');
        
        // Réinitialiser le formulaire
        setTemplateContent('');
        setTemplateSubject('');
        setTemplateName('');
        
        // Fermer le modal
        setShowTemplateModal(false);
      } else {
        setActionError(data.message || 'Erreur lors de la création du modèle');
      }
    } catch (error) {
      console.error('Erreur lors de la création du modèle:', error);
      setActionError('Une erreur est survenue lors de la création du modèle');
    } finally {
      setCampaignAction(null);
    }
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'created': return 'primary';
      case 'scheduled': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  // Fonction pour obtenir le libellé du statut en français
  const getStatusLabel = (status) => {
    switch(status) {
      case 'created': return 'Créée';
      case 'scheduled': return 'Planifiée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'failed': return 'Échouée';
      default: return status;
    }
  };

  // Fonction pour filtrer les campagnes par statut
  const filteredCampaigns = activeTab === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.status === activeTab);

  // Afficher un message de chargement
  if (loading) {
    return (
      <AdminLayout>
        <Head>
          <title>Gestion des campagnes d'emails | Administration</title>
        </Head>
        <Container fluid>
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="mt-3">Chargement des campagnes d'emails...</p>
          </div>
        </Container>
      </AdminLayout>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <AdminLayout>
        <Head>
          <title>Gestion des campagnes d'emails | Administration</title>
        </Head>
        <Container fluid>
          <Alert variant="danger">
            <Alert.Heading>Erreur</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Gestion des campagnes d'emails | Administration</title>
      </Head>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h1>Gestion des campagnes d'emails</h1>
            <p className="text-muted">
              Créez, planifiez et suivez vos campagnes d'emails de recommandations personnalisées.
            </p>
          </Col>
        </Row>

        {actionSuccess && (
          <Alert variant="success" dismissible onClose={() => setActionSuccess(null)}>
            {actionSuccess}
          </Alert>
        )}
        
        {actionError && (
          <Alert variant="danger" dismissible onClose={() => setActionError(null)}>
            {actionError}
          </Alert>
        )}

        {/* Résumé global - Toujours visible */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <FaEnvelope className="fs-1 text-primary mb-2" />
                <h2>{campaigns.length}</h2>
                <p className="text-muted">Total des campagnes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <FaCalendarAlt className="fs-1 text-info mb-2" />
                <h2>{campaigns.filter(c => c.status === 'scheduled').length}</h2>
                <p className="text-muted">Campagnes planifiées</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <FaUsers className="fs-1 text-success mb-2" />
                <h2>{campaigns.reduce((total, campaign) => total + (campaign.targetUserCount || 0), 0)}</h2>
                <p className="text-muted">Utilisateurs ciblés</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 text-center">
              <Card.Body>
                <FaUserCheck className="fs-1 text-warning mb-2" />
                <h2>{campaigns.reduce((total, campaign) => total + (campaign.statistics?.emailsSent || 0), 0)}</h2>
                <p className="text-muted">Emails envoyés</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Actions principales */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-primary"
                onClick={() => setShowTemplateModal(true)}
                className="me-2"
              >
                <FaEdit className="me-1" /> Créer un modèle d'email
              </Button>
              <Button 
                variant="primary"
                onClick={() => window.location.href = '/admin/review-analytics'}
              >
                <FaEnvelope className="me-1" /> Créer une nouvelle campagne
              </Button>
            </div>
          </Col>
        </Row>

        {/* Onglets des campagnes par statut */}
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="mb-4"
          id="campaign-tabs"
        >
          <Tab eventKey="all" title="Toutes">
            {renderCampaignsTable(filteredCampaigns)}
          </Tab>
          <Tab eventKey="created" title="Créées">
            {renderCampaignsTable(filteredCampaigns)}
          </Tab>
          <Tab eventKey="scheduled" title="Planifiées">
            {renderCampaignsTable(filteredCampaigns)}
          </Tab>
          <Tab eventKey="in_progress" title="En cours">
            {renderCampaignsTable(filteredCampaigns)}
          </Tab>
          <Tab eventKey="completed" title="Terminées">
            {renderCampaignsTable(filteredCampaigns)}
          </Tab>
        </Tabs>

        {/* Modal pour planifier une campagne */}
        <Modal 
          show={showCampaignModal} 
          onHide={() => setShowCampaignModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Planifier la campagne</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCampaign && (
              <>
                <p><strong>Campagne :</strong> {selectedCampaign.name}</p>
                <p><strong>Type :</strong> {selectedCampaign.type}</p>
                <p><strong>Utilisateurs ciblés :</strong> {selectedCampaign.targetUserCount}</p>
                
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Date d'envoi</Form.Label>
                    <Form.Control
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} // Date minimale = aujourd'hui
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Heure d'envoi</Form.Label>
                    <Form.Control
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCampaignModal(false)}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleCampaignAction('schedule', selectedCampaign)}
              disabled={!scheduledDate || !scheduledTime || campaignAction === 'schedule'}
            >
              {campaignAction === 'schedule' ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Planification...
                </>
              ) : (
                <>
                  <FaCalendarAlt className="me-1" /> Planifier
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal pour supprimer une campagne */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => setShowDeleteModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmer la suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCampaign && (
              <p>
                Êtes-vous sûr de vouloir supprimer la campagne "{selectedCampaign.name}" ?
                <br />
                Cette action est irréversible.
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button 
              variant="danger" 
              onClick={() => handleCampaignAction('delete', selectedCampaign)}
              disabled={campaignAction === 'delete'}
            >
              {campaignAction === 'delete' ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Suppression...
                </>
              ) : (
                <>
                  <FaTrash className="me-1" /> Supprimer
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal pour créer un modèle d'email */}
        <Modal 
          show={showTemplateModal} 
          onHide={() => setShowTemplateModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Créer un modèle d'email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nom du modèle</Form.Label>
                <Form.Control
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Ex: Modèle de recommandations produits"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Objet de l'email</Form.Label>
                <Form.Control
                  type="text"
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                  placeholder="Ex: Découvrez nos recommandations personnalisées pour vous"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Contenu de l'email (HTML)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  placeholder="<h1>Bonjour {{nom}},</h1><p>Voici nos recommandations...</p>"
                />
                <Form.Text className="text-muted">
                  Utilisez {{nom}} pour insérer le nom de l'utilisateur, {{produits}} pour insérer la liste des produits recommandés.
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>
              Annuler
            </Button>
            <Button 
              variant="success" 
              onClick={createEmailTemplate}
              disabled={campaignAction === 'createTemplate' || !templateName || !templateSubject || !templateContent}
            >
              {campaignAction === 'createTemplate' ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Création en cours...
                </>
              ) : (
                <>
                  <FaEdit className="me-1" /> Créer le modèle
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </AdminLayout>
  );

  // Fonction pour afficher le tableau des campagnes
  function renderCampaignsTable(campaignList) {
    if (campaignList.length === 0) {
      return (
        <Alert variant="info">
          Aucune campagne trouvée avec ce statut.
        </Alert>
      );
    }

    return (
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Utilisateurs ciblés</th>
              <th>Statut</th>
              <th>Planifiée pour</th>
              <th>Emails envoyés</th>
              <th>Taux d'ouverture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaignList.map((campaign) => {
              const openRate = campaign.statistics?.emailsOpened && campaign.statistics?.emailsSent 
                ? (campaign.statistics.emailsOpened / campaign.statistics.emailsSent) * 100 
                : 0;
              
              return (
                <tr key={campaign._id}>
                  <td>
                    <strong>{campaign.name}</strong>
                    {campaign.description && (
                      <div><small className="text-muted">{campaign.description}</small></div>
                    )}
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {campaign.type === 'positive' && 'Avis positifs'}
                      {campaign.type === 'frequent' && 'Utilisateurs fréquents'}
                      {campaign.type === 'inactive' && 'Utilisateurs inactifs'}
                      {campaign.type === 'specific' && 'Utilisateurs spécifiques'}
                    </Badge>
                  </td>
                  <td>{campaign.targetUserCount}</td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(campaign.status)}>
                      {getStatusLabel(campaign.status)}
                    </Badge>
                  </td>
                  <td>{formatDate(campaign.scheduledFor)}</td>
                  <td>
                    {campaign.statistics?.emailsSent || 0} / {campaign.targetUserCount}
                  </td>
                  <td>
                    {campaign.statistics?.emailsSent > 0 ? (
                      <div>
                        <ProgressBar 
                          now={openRate} 
                          variant={openRate > 20 ? 'success' : 'info'} 
                          label={`${Math.round(openRate)}%`}
                        />
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <div className="d-flex">
                      {/* Bouton pour voir les détails (à implémenter) */}
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        className="me-1"
                        onClick={() => window.location.href = `/admin/campaign-details/${campaign._id}`}
                      >
                        <FaEye />
                      </Button>
                      
                      {/* Bouton pour planifier */}
                      {campaign.status === 'created' && (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowCampaignModal(true);
                          }}
                        >
                          <FaCalendarAlt />
                        </Button>
                      )}
                      
                      {/* Bouton pour démarrer */}
                      {(campaign.status === 'created' || campaign.status === 'scheduled') && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          className="me-1"
                          onClick={() => handleCampaignAction('start', campaign)}
                          disabled={campaignAction === 'start'}
                        >
                          <FaPlay />
                        </Button>
                      )}
                      
                      {/* Bouton pour suspendre */}
                      {campaign.status === 'in_progress' && (
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          className="me-1"
                          onClick={() => handleCampaignAction('pause', campaign)}
                          disabled={campaignAction === 'pause'}
                        >
                          <FaPause />
                        </Button>
                      )}
                      
                      {/* Bouton pour supprimer */}
                      {(campaign.status === 'created' || campaign.status === 'scheduled' || campaign.status === 'completed' || campaign.status === 'failed') && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
};

export default EmailCampaigns;
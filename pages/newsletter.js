
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [action, setAction] = useState('subscribe'); // 'subscribe' ou 'unsubscribe'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const endpoint = action === 'subscribe' ? '/api/newsletter/subscribe' : '/api/newsletter/unsubscribe';
      const body = action === 'subscribe' ? { email, name } : { email };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        if (action === 'subscribe') {
          setEmail('');
          setName('');
        }
      } else {
        setMessage({ text: data.message, type: 'danger' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ 
        text: 'Une erreur est survenue lors du traitement de votre demande.', 
        type: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader title="Newsletter" curPage="Newsletter" />
      <div className="newsletter-page py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                  <h2 className="text-center mb-4">
                    {action === 'subscribe' ? 'S\'abonner à notre newsletter' : 'Se désabonner de notre newsletter'}
                  </h2>
                  
                  {message.text && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
                      {message.text}
                    </Alert>
                  )}
                  
                  <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group" role="group">
                      <Button 
                        variant={action === 'subscribe' ? 'primary' : 'outline-primary'} 
                        onClick={() => setAction('subscribe')}
                      >
                        S'abonner
                      </Button>
                      <Button 
                        variant={action === 'unsubscribe' ? 'primary' : 'outline-primary'} 
                        onClick={() => setAction('unsubscribe')}
                      >
                        Se désabonner
                      </Button>
                    </div>
                  </div>
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Adresse email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Votre adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    
                    {action === 'subscribe' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Nom (optionnel)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Votre nom"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>
                    )}
                    
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100" 
                      disabled={loading}
                    >
                      {loading ? 'Traitement en cours...' : action === 'subscribe' ? 'S\'abonner' : 'Se désabonner'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row className="mt-5">
            <Col>
              <div className="text-center">
                <h3>Pourquoi s'abonner à notre newsletter ?</h3>
                <p className="lead">
                  Recevez en exclusivité nos dernières actualités, offres spéciales et conseils directement dans votre boîte mail.
                </p>
                <div className="d-flex justify-content-center mt-4 gap-3">
                  <div className="text-center p-3 shadow-sm rounded" style={{ maxWidth: '250px' }}>
                    <i className="icofont-sale-discount fs-2 text-primary"></i>
                    <h5 className="mt-3">Offres exclusives</h5>
                    <p>Accédez en priorité à nos meilleures promotions</p>
                  </div>
                  <div className="text-center p-3 shadow-sm rounded" style={{ maxWidth: '250px' }}>
                    <i className="icofont-newspaper fs-2 text-primary"></i>
                    <h5 className="mt-3">Actualités</h5>
                    <p>Soyez informé des derniers articles et nouveautés</p>
                  </div>
                  <div className="text-center p-3 shadow-sm rounded" style={{ maxWidth: '250px' }}>
                    <i className="icofont-gift fs-2 text-primary"></i>
                    <h5 className="mt-3">Surprises</h5>
                    <p>Recevez des cadeaux exclusifs réservés aux abonnés</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <style jsx>{`
        .newsletter-page {
          background-color: #f8f9fa;
        }
      `}</style>
    </Layout>
  );
}

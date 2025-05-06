
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

export default function UnsubscribePage() {
  const router = useRouter();
  const { email } = router.query;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [confirmed, setConfirmed] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email || confirmed) return;
    
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message || 'Vous avez été désabonné avec succès.', type: 'success' });
        setConfirmed(true);
      } else {
        setMessage({ text: data.message || 'Une erreur est survenue lors du désabonnement.', type: 'danger' });
      }
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
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
      <PageHeader title="Désabonnement" curPage="Désabonnement Newsletter" />
      <div className="unsubscribe-page py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                  <h2 className="text-center mb-4">Désabonnement Newsletter</h2>
                  
                  {message.text && (
                    <Alert variant={message.type} dismissible={!confirmed} onClose={() => !confirmed && setMessage({ text: '', type: '' })}>
                      {message.text}
                    </Alert>
                  )}
                  
                  {!confirmed ? (
                    <>
                      <p className="text-center mb-4">
                        Êtes-vous sûr de vouloir vous désabonner de notre newsletter ?
                        {email && <><br/><strong>{email}</strong></>}
                      </p>
                      
                      <div className="d-flex justify-content-center gap-3">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => router.push('/')}
                        >
                          Annuler
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={handleUnsubscribe}
                          disabled={loading || !email}
                        >
                          {loading ? 'Traitement en cours...' : 'Confirmer le désabonnement'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <p>Nous espérons vous revoir bientôt !</p>
                      <Button 
                        variant="primary" 
                        onClick={() => router.push('/')}
                        className="mt-3"
                      >
                        Retour à l'accueil
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <style jsx>{`
        .unsubscribe-page {
          background-color: #f8f9fa;
        }
      `}</style>
    </Layout>
  );
}

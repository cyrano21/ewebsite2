import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Head from 'next/head';
import NextErrorComponent from 'next/error';

// Composant standard de page d'erreur personnalisée
const CustomErrorPage = ({ statusCode, hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps est appelé en tant que méthode statique, donc
    // il ne peut pas utiliser l'état du composant
    // Nous devrons donc transmettre notre état à travers les props
    return <NextErrorComponent statusCode={statusCode} />
  }

  return (
    <>
      <Head>
        <title>{statusCode ? `Erreur ${statusCode}` : 'Page temporairement indisponible'}</title>
      </Head>
      <Container className="py-5 my-5 text-center">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="error-page p-4 rounded shadow-sm">
              <h1 className="display-4 mb-4">Oups !</h1>
              {statusCode && <h2 className="mb-3">Erreur {statusCode}</h2>}
              <h2 className="mb-4">Cette page n'est pas disponible pour le moment</h2>
              <p className="lead mb-4">
                Nous travaillons à résoudre ce problème. Merci de votre patience.
              </p>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button as={Link} href="/" variant="primary">
                  Retour à l'accueil
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline-secondary">
                  Rafraîchir la page
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

// Implémentation correcte de getInitialProps pour une page d'erreur Next.js
CustomErrorPage.getInitialProps = async ({ res, err, asPath }) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps({
    res,
    err
  });

  // Empêcher l'erreur "React hydration mismatch"
  errorInitialProps.hasGetInitialPropsRun = true;

  // Renvoyer les props pour notre composant d'erreur personnalisé
  return errorInitialProps;
};

export default CustomErrorPage;

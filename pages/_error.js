import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Head from 'next/head';

export default function CustomErrorPage() {
  return (
    <>
      <Head>
        <title>Page temporairement indisponible</title>
      </Head>
      <Container className="py-5 my-5 text-center">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="error-page p-4 rounded shadow-sm">
              <h1 className="display-4 mb-4">Oups !</h1>
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
}

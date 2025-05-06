import React from "react";
import PageHeader from "../components/PageHeader";
import { Container, Row, Col } from "react-bootstrap";

const AboutPage = () => {
  return (
    <div className="about-page">
      <PageHeader title={"À propos de nous"} curPage={"À propos"} />

      <section className="about-section style-3 padding-tb section-bg">
        <Container>
          <Row className="justify-content-center row-cols-xl-2 row-cols-1 align-items-center">
            <Col>
              <div className="about-left">
                <div className="about-thumb">
                  <img
                    src="/assets/images/about/01.jpg"
                    alt="À propos de notre entreprise"
                    className="img-fluid"
                  />
                </div>
                <div className="abs-thumb">
                  <img
                    src="/assets/images/about/02.jpg"
                    alt="Notre équipe"
                    className="img-fluid"
                  />
                </div>
                <div className="about-left-content">
                  <h3>30+</h3>
                  <p>Années d'expérience</p>
                </div>
              </div>
            </Col>
            <Col>
              <div className="about-right">
                <div className="section-header">
                  <span className="subtitle">À propos de notre marque</span>
                  <h2 className="title">
                    Services de qualité et expérience incomparable
                  </h2>
                  <p>
                    Nous fournissons un accès distinctif aux utilisateurs tout
                    en proposant des processus transparents qui incitent à des
                    fonctionnalités efficaces plutôt qu'une architecture
                    extensible, pour une communication et des services optimisés
                    sur toutes les plateformes.
                  </p>
                </div>
                <div className="section-wrapper">
                  <ul className="lab-ul">
                    <li className="d-flex mb-4">
                      <div className="sr-left me-3">
                        <img
                          src="/assets/images/about/icon/01.jpg"
                          alt="fonctionnalité"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="sr-right">
                        <h5>Expérience client exceptionnelle</h5>
                        <p>
                          Nous plaçons nos clients au centre de notre démarche
                          et créons des expériences mémorables.
                        </p>
                      </div>
                    </li>
                    <li className="d-flex mb-4">
                      <div className="sr-left me-3">
                        <img
                          src="/assets/images/about/icon/02.jpg"
                          alt="fonctionnalité"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="sr-right">
                        <h5>Produits de haute qualité</h5>
                        <p>
                          Nous sélectionnons rigoureusement nos produits pour
                          garantir une qualité irréprochable.
                        </p>
                      </div>
                    </li>
                    <li className="d-flex">
                      <div className="sr-left me-3">
                        <img
                          src="/assets/images/about/icon/03.jpg"
                          alt="fonctionnalité"
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className="sr-right">
                        <h5>Innovation constante</h5>
                        <p>
                          Nous restons à la pointe des dernières tendances et
                          technologies pour vous offrir le meilleur.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;

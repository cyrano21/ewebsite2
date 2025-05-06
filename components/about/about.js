import React, { useState, useEffect } from "react";
import PageHeader from "../PageHeader";
import Head from "next/head";
import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";

const AboutPage = () => {
  const [aboutData, setAboutData] = useState({
    subTitle: "À propos de notre marque",
    title: "Services de qualité et expérience incomparable",
    desc: "Nous fournissons un accès distinctif aux utilsateurs tout en proposant des processus transparents qui incitent à des fonctionnalités efficaces plutôt qu'une architecture extensible, pour une communication et des services optimisés sur toutes les plateformes.",
    year: "30+",
    expareance: "Années d'expérience",
    mainImage: "/assets/images/about/01.jpg",
    secondaryImage: "/assets/images/about/02.jpg",
    features: [],
  });

  useEffect(() => {
    // Fetch about data from API
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/about");
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div>
      <Head>
        <title>À propos | Notre Marque</title>
        <meta
          name="description"
          content="Découvrez l'histoire de notre marque, notre expertise et nos services de qualité."
        />
      </Head>

      <PageHeader title={"À propos de notre marque"} curPage={"À propos"} />

      <section className="about-section style-3 padding-tb section-bg">
        <Container>
          <Row className="justify-content-center row-cols-xl-2 row-cols-1 align-items-center">
            <Col>
              <div className="about-left">
                <div className="about-thumb">
                  <img
                    src={aboutData.mainImage || "/assets/images/about/01.jpg"}
                    alt="À propos de notre entreprise"
                    className="img-fluid"
                  />
                </div>
                <div className="abs-thumb">
                  <img
                    src={
                      aboutData.secondaryImage || "/assets/images/about/02.jpg"
                    }
                    alt="Notre équipe"
                    className="img-fluid"
                  />
                </div>
                <div className="about-left-content">
                  <h3>{aboutData.year}</h3>
                  <p>{aboutData.expareance}</p>
                </div>
              </div>
            </Col>
            <Col>
              <div className="about-right">
                <div className="section-header">
                  <span className="subtitle">{aboutData.subTitle}</span>
                  <h2 className="title">{aboutData.title}</h2>
                  <p>{aboutData.desc}</p>
                </div>
                <div className="section-wrapper">
                  <ul className="lab-ul">
                    {aboutData.features &&
                      aboutData.features.map((feature, i) => (
                        <li key={i} className="d-flex mb-4">
                          <div className="sr-left me-3">
                            <img
                              src={
                                feature.imgUrl ||
                                `/assets/images/about/icon/0${i + 1}.jpg`
                              }
                              alt={feature.imgAlt || "fonctionnalité"}
                              width={50}
                              height={50}
                            />
                          </div>
                          <div className="sr-right">
                            <h5>{feature.title}</h5>
                            <p>{feature.desc}</p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .about-section {
          padding: 80px 0;
        }
        .about-left {
          position: relative;
          margin-bottom: 30px;
        }
        .about-thumb {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .abs-thumb {
          position: absolute;
          bottom: 20px;
          right: -20px;
          width: 40%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .about-left-content {
          position: absolute;
          top: 20px;
          left: -20px;
          background: linear-gradient(to right, #6a11cb, #2575fc);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .about-left-content h3 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0;
        }
        .about-left-content p {
          margin-bottom: 0;
        }
        .subtitle {
          color: #6a11cb;
          font-weight: 600;
          margin-bottom: 10px;
          display: block;
        }
        .title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .section-bg {
          background-color: #f8f9fa;
        }
        .lab-ul {
          list-style: none;
          padding-left: 0;
        }
        .sr-left {
          background-color: #fff;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        .sr-right h5 {
          font-weight: 600;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;

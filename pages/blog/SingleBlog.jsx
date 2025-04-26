/* stylelint-disable */
/* eslint-disable react/jsx-no-target-blank, react/no-unescaped-entities, react/no-unknown-property */
"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import Tags from "../Shop/Tags";
import PageHeader from "../../components/PageHeader";
import { useRouter } from "next/router";
import Link from "next/link";
import blogList from "../../utils/blogdata";
import MostPopularPost from "../../components/Sidebar/MostPopularPost";
import { blogSingle01, blogSingle02 } from "../../utils/imageImports";

const socialList = [
  {
    link: "#",
    iconName: "icofont-facebook",
    className: "facebook",
  },
  {
    link: "#",
    iconName: "icofont-twitter",
    className: "twitter",
  },
  {
    link: "#",
    iconName: "icofont-linkedin",
    className: "linkedin",
  },
  {
    link: "#",
    iconName: "icofont-instagram",
    className: "instagram",
  },
  {
    link: "#",
    iconName: "icofont-pinterest",
    className: "pinterest",
  },
];

const SingleBlog = ({ blogId }) => {
  const [blog, setBlog] = useState(blogList);
  const router = useRouter();
  const { id } = router.query || { id: blogId };
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    const currentPost = blog.find(p => p.id === Number(id));
    if (currentPost) {
      setResult([currentPost]);
      const related = blog
        .filter(post => post.id !== Number(id))
        .filter(post => post.category === currentPost.category || Math.random() > 0.7)
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [id, blog]);

  const getCategoryColor = (category) => {
    const colors = {
      'Marketing': 'primary',
      'Technologie': 'info',
      'Design': 'success',
      'Business': 'warning',
      'Éducation': 'danger',
      'Lifestyle': 'secondary'
    };
    return colors[category] || 'dark';
  };

  const currentIndex = blog.findIndex(p => p.id === Number(id));
  const prevPost = currentIndex > 0 ? blog[currentIndex - 1] : null;
  const nextPost = currentIndex < blog.length - 1 ? blog[currentIndex + 1] : null;

  return (
    <div className="blog-single-page">
      <PageHeader
        title={"Article de blog"}
        curPage={"Blog / Détails de l'article"}
      />
      <section className="blog-section blog-single padding-tb section-bg">
        <Container>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement de l'article...</p>
            </div>
          ) : (
            <Row className="justify-content-center">
              <Col lg={8} className="mb-4 mb-lg-0">
                <Card className="border-0 shadow-sm overflow-hidden">
                  {result.map((item) => (
                    <article key={item.id} className="single-blog-article">
                      <div className="post-thumb">
                        <img
                          src={item.imgUrl}
                          alt={item.title}
                          className="w-100 img-fluid"
                          style={{ maxHeight: '500px', objectFit: 'cover' }}
                        />
                        {item.category && (
                          <Badge 
                            bg={getCategoryColor(item.category)} 
                            className="position-absolute top-0 end-0 m-3 py-2 px-3"
                          >
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="post-content p-4 p-lg-5">
                        <div className="meta-post d-flex flex-wrap gap-3 mb-3 text-muted small">
                          <div className="meta-item">
                            <i className="icofont-calendar me-1"></i>
                            23 avril 2021
                          </div>
                          <div className="meta-item">
                            <i className="icofont-ui-user me-1"></i>
                            Rajib Raj
                          </div>
                          <div className="meta-item">
                            <i className="icofont-speech-comments me-1"></i>
                            09 Commentaires
                          </div>
                        </div>

                        <h1 className="blog-title mb-4">{item.title}</h1>
                        
                        <div className="blog-content">
                          <p className="lead mb-4">
                            La sérénité s'est emparée de mon âme entière en ces douces matinées de printemps que je savoure de tout mon cœur. Je me retrouve seul et ressens le charme de l'existence en ce lieu qui fait le bonheur des âmes comme la mienne.
                          </p>

                          <p>
                            Je suis si heureux, mon cher ami, absorbé par ce sentiment exquis, profitant de tout mon cœur seul et ressentant le charme de l'existence en ce lieu qui était le bonheur des âmes comme la mienne. Mon cher ami, absorbé par ce sentiment exquis, cette existence tranquille néglige mes talents, je serais incapable de dessiner une telle sérénité merveilleuse qui s'est emparée de mon âme entière en ces doux moments présents, et pourtant je sens que jamais je ne fus un plus grand artiste.
                          </p>

                          <blockquote className="fancy-blockquote my-5 p-4 p-lg-5 shadow-sm border-start border-5 border-primary">
                            <p className="mb-2 fst-italic">
                              "Transformez dynamiquement les technologies distribuées là où les canaux clés en main et offrez de manière monotone un accès à l'expertise de nivellement des ressources via des livrables mondiaux qui étendent de manière holistique les portails diversifiés."
                            </p>
                            <cite className="d-block text-end">
                              — Melissa Hunter, <span className="text-muted">Experte en marketing</span>
                            </cite>
                          </blockquote>

                          <p>
                            De tout mon cœur, je me crée seul et ressens le charme de l'existence en ce lieu qui fait le bonheur des âmes comme la mienne. Je suis si heureux, mon cher ami, absorbé par ce sentiment exquis, profitant de tout mon cœur seul et ressentant le charme de l'existence en ce lieu qui était le bonheur des âmes comme la mienne.
                          </p>

                          <div className="blog-image my-4 text-center">
                            <img
                              src={blogSingle01}
                              alt="Image de l'article"
                              className="img-fluid rounded shadow-sm"
                            />
                            <small className="d-block text-muted mt-2">Photographie de montagne au lever du soleil</small>
                          </div>

                          <p>
                            La sérénité s'est emparée de mon âme entière en ces douces matinées de printemps que je savoure de tout mon cœur. Je me retrouve seul et ressens le charme de l'existence en ce lieu qui fait le bonheur des âmes comme la mienne. Je suis si heureux, mon cher ami, absorbé par ce sentiment exquis, profitant de tout mon cœur seul et ressentant le charme de l'existence en ce lieu qui était le bonheur des âmes comme la mienne.
                          </p>

                          <div className="video-container my-5 position-relative rounded overflow-hidden shadow-sm">
                            <img
                              src={blogSingle02}
                              alt="Vidéo de l'article"
                              className="w-100"
                            />
                            <a
                              href="https://youtu.be/2qWo6W5Wn8Q"
                              className="video-button"
                              target="_blank"
                            >
                              <span className="video-icon-wrapper">
                                <i className="icofont-ui-play"></i>
                              </span>
                            </a>
                          </div>

                          <p>
                            De tout mon cœur, je me crée seul et ressens le charme de l'existence en ce lieu qui fait le bonheur des âmes comme la mienne. Je suis si heureux, mon cher ami, absorbé par ce sentiment exquis, profitant de tout mon cœur seul et ressentant le charme de l'existence en ce lieu qui était le bonheur des âmes comme la mienne.
                          </p>
                        </div>

                        <div className="tags-section mt-5 pt-4 border-top d-flex flex-column flex-md-row justify-content-between">
                          <div className="tags mb-3 mb-md-0">
                            <h6 className="d-inline me-2">Tags:</h6>
                            <ul className="tags-list d-inline-flex flex-wrap gap-2">
                              <li>
                                <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">Agence</Badge>
                              </li>
                              <li>
                                <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">Entreprise</Badge>
                              </li>
                              <li>
                                <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">Personnel</Badge>
                              </li>
                            </ul>
                          </div>
                          <div className="social-share">
                            <h6 className="d-inline me-2">Partager:</h6>
                            <ul className="social-icons d-inline-flex flex-wrap gap-2">
                              {socialList.map((val, i) => (
                                <li key={i}>
                                  <a
                                    href={val.link}
                                    className={`social-icon ${val.className}`}
                                    title={val.className}
                                  >
                                    <i className={val.iconName}></i>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </Card>

                <div className="post-navigation mt-4 d-flex flex-column flex-md-row gap-3">
                  {prevPost && (
                    <Link
                      href={`/blog/${prevPost.id}`}
                      className="prev-post flex-grow-1"
                      legacyBehavior>
                      <Card className="border-0 shadow-sm h-100 post-nav-card prev-card">
                        <Card.Body className="d-flex align-items-center p-3">
                          <div className="nav-icon me-3">
                            <i className="icofont-double-left fs-3"></i>
                          </div>
                          <div className="nav-content">
                            <small className="text-muted d-block">Article précédent</small>
                            <h6 className="nav-title mb-0 text-truncate">{prevPost.title}</h6>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  )}

                  {nextPost && (
                    <Link
                      href={`/blog/${nextPost.id}`}
                      className="next-post flex-grow-1"
                      legacyBehavior>
                      <Card className="border-0 shadow-sm h-100 post-nav-card next-card text-end">
                        <Card.Body className="d-flex align-items-center justify-content-end p-3">
                          <div className="nav-content">
                            <small className="text-muted d-block">Article suivant</small>
                            <h6 className="nav-title mb-0 text-truncate">{nextPost.title}</h6>
                          </div>
                          <div className="nav-icon ms-3">
                            <i className="icofont-double-right fs-3"></i>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  )}
                </div>
                
                {relatedPosts.length > 0 && (
                  <div className="related-posts mt-5">
                    <h4 className="mb-4">Articles connexes</h4>
                    <Row className="g-4">
                      {relatedPosts.map((post, index) => (
                        <Col md={4} key={index}>
                          <Card className="border-0 shadow-sm h-100 related-post-card">
                            <Link href={`/blog/${post.id}`} className="img-link" legacyBehavior>
                              <div className="related-post-img">
                                <img 
                                  src={post.imgUrl} 
                                  alt={post.title} 
                                  className="card-img-top" 
                                />
                              </div>
                            </Link>
                            <Card.Body className="p-3">
                              <Link href={`/blog/${post.id}`} className="text-decoration-none" legacyBehavior>
                                <h6 className="related-title mb-0">{post.title}</h6>
                              </Link>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
                
                <div className="comments-section mt-5">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h4 className="mb-4">Commentaires (9)</h4>
                      
                      <div className="comment-form mb-5">
                        <h5 className="mb-3">Laisser un commentaire</h5>
                        <Form>
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Control 
                                  type="text" 
                                  placeholder="Votre nom *" 
                                  required 
                                  className="rounded-pill"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Control 
                                  type="email" 
                                  placeholder="Votre email *" 
                                  required
                                  className="rounded-pill"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <Form.Group>
                                <Form.Control 
                                  as="textarea" 
                                  rows={4} 
                                  placeholder="Votre commentaire *" 
                                  required
                                  className="rounded"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12}>
                              <Button 
                                variant="primary" 
                                type="submit"
                                className="rounded-pill px-4"
                              >
                                <i className="icofont-paper-plane me-2"></i>
                                Publier le commentaire
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                      
                      <div className="comments-list">
                        <div className="comment-item d-flex mb-4 pb-4 border-bottom">
                          <div className="commenter-avatar me-3">
                            <img 
                              src="https://randomuser.me/api/portraits/women/64.jpg" 
                              alt="Commenter" 
                              className="rounded-circle"
                              width="60"
                              height="60"
                            />
                          </div>
                          <div className="comment-content flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="commenter-name mb-0">Marie Laurent</h6>
                              <small className="comment-date text-muted">15 Avr, 2021</small>
                            </div>
                            <p className="mb-2">Absolument fascinant ! J'ai beaucoup apprécié cet article qui apporte une perspective rafraîchissante sur le sujet. Merci pour ce contenu de qualité.</p>
                            <Button variant="link" className="p-0 text-primary reply-btn">
                              <i className="icofont-reply me-1"></i>Répondre
                            </Button>
                          </div>
                        </div>
                        
                        <div className="comment-item d-flex mb-4 pb-4 border-bottom">
                          <div className="commenter-avatar me-3">
                            <img 
                              src="https://randomuser.me/api/portraits/men/41.jpg" 
                              alt="Commenter" 
                              className="rounded-circle"
                              width="60"
                              height="60"
                            />
                          </div>
                          <div className="comment-content flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="commenter-name mb-0">Thomas Dupont</h6>
                              <small className="comment-date text-muted">14 Avr, 2021</small>
                            </div>
                            <p className="mb-2">Très bon article, j'aurais cependant aimé en savoir plus sur les applications pratiques. Est-ce que vous prévoyez une suite à cet article ?</p>
                            <Button variant="link" className="p-0 text-primary reply-btn">
                              <i className="icofont-reply me-1"></i>Répondre
                            </Button>
                            
                            <div className="comment-reply d-flex mt-3 pt-3 border-top">
                              <div className="commenter-avatar me-3">
                                <img 
                                  src="https://randomuser.me/api/portraits/women/68.jpg" 
                                  alt="Commenter" 
                                  className="rounded-circle"
                                  width="50"
                                  height="50"
                                />
                              </div>
                              <div className="comment-content flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <h6 className="commenter-name mb-0">Sophie Martin <span className="badge bg-primary ms-2">Auteur</span></h6>
                                  <small className="comment-date text-muted">14 Avr, 2021</small>
                                </div>
                                <p className="mb-2">Merci pour votre commentaire Thomas ! Effectivement, nous prévoyons une série d'articles sur ce sujet avec des exemples pratiques qui seront publiés prochainement.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <Button variant="outline-primary" className="rounded-pill px-4">
                            <i className="icofont-comment me-2"></i>Voir plus de commentaires
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
              
              <Col lg={4}>
                <aside className="blog-sidebar sticky-top" style={{ top: '2rem' }}>
                  <Card className="author-card mb-4 border-0 shadow-sm text-center">
                    <Card.Body className="p-4">
                      <div className="author-avatar mx-auto mb-3">
                        <img 
                          src="https://randomuser.me/api/portraits/women/68.jpg" 
                          alt="Author" 
                          className="rounded-circle"
                          width="100"
                          height="100"
                        />
                      </div>
                      <h5 className="author-name">Sophie Martin</h5>
                      <p className="author-bio text-muted mb-3">
                        Rédactrice spécialisée en marketing digital et nouvelles technologies avec plus de 5 ans d'expérience dans le domaine.
                      </p>
                      <div className="author-social d-flex justify-content-center gap-2">
                        {socialList.slice(0, 4).map((social, idx) => (
                          <a 
                            key={idx} 
                            href={social.link} 
                            className={`social-link ${social.className}`}
                            title={social.className}
                          >
                            <i className={social.iconName}></i>
                          </a>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                  
                  <Card className="search-widget mb-4 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="widget-title mb-3">Rechercher</h5>
                      <Form className="search-form">
                        <InputGroup>
                          <Form.Control
                            placeholder="Rechercher dans le blog..."
                            className="border-end-0"
                          />
                          <Button variant="primary">
                            <i className="icofont-search-1"></i>
                          </Button>
                        </InputGroup>
                      </Form>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="widget-title mb-3">Articles populaires</h5>
                      <MostPopularPost />
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="widget-title mb-3">Tags populaires</h5>
                      <Tags />
                    </Card.Body>
                  </Card>
                  
                  <Card className="newsletter-widget border-0 shadow-sm bg-primary text-white">
                    <Card.Body className="p-4">
                      <h5 className="widget-title text-white mb-3">Newsletter</h5>
                      <p className="mb-3">Abonnez-vous à notre newsletter pour recevoir nos derniers articles.</p>
                      <Form className="newsletter-form">
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="email"
                            placeholder="Votre adresse email"
                            className="rounded-pill"
                          />
                        </Form.Group>
                        <Button variant="light" className="rounded-pill w-100 text-primary fw-bold">
                          S'abonner
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </aside>
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <style jsx>{`
        .blog-single-page {
          --bs-primary-rgb: 13, 110, 253;
        }
        
        .fancy-blockquote {
          background-color: rgba(var(--bs-primary-rgb), 0.03);
          border-radius: 0.5rem;
        }
        
        .video-container {
          max-height: 500px;
        }
        .video-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
        }
        .video-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background-color: rgba(var(--bs-primary-rgb), 0.9);
          color: white;
          border-radius: 50%;
          font-size: 1.8rem;
          transition: all 0.3s ease;
        }
        .video-icon-wrapper:hover {
          transform: scale(1.1);
          background-color: var(--bs-primary);
        }
        
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: white;
          transition: all 0.3s ease;
        }
        .social-icon:hover {
          transform: translateY(-3px);
        }
        .social-icon.facebook { background-color: #3b5998; }
        .social-icon.twitter { background-color: #1da1f2; }
        .social-icon.linkedin { background-color: #0077b5; }
        .social-icon.instagram { background-color: #e1306c; }
        .social-icon.pinterest { background-color: #bd081c; }
        
        .post-nav-card {
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .post-nav-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .prev-card:hover .nav-icon {
          transform: translateX(-5px);
        }
        .next-card:hover .nav-icon {
          transform: translateX(5px);
        }
        .nav-icon {
          transition: transform 0.3s ease;
          color: var(--bs-primary);
        }
        .nav-title {
          color: #333;
          transition: color 0.3s ease;
        }
        .post-nav-card:hover .nav-title {
          color: var(--bs-primary);
        }
        
        .related-post-card {
          transition: all 0.3s ease;
        }
        .related-post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .related-post-img {
          overflow: hidden;
          max-height: 150px;
        }
        .related-post-img img {
          transition: all 0.5s ease;
          height: 150px;
          object-fit: cover;
        }
        .related-post-card:hover img {
          transform: scale(1.05);
        }
        .related-title {
          color: #333;
          transition: color 0.3s ease;
        }
        .related-post-card:hover .related-title {
          color: var(--bs-primary);
        }
        
        .blog-sidebar {
          max-height: calc(100vh - 2rem);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,.1) transparent;
        }
        .blog-sidebar::-webkit-scrollbar {
          width: 5px;
        }
        .blog-sidebar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,.1);
          border-radius: 10px;
        }
        .widget-title {
          position: relative;
          padding-bottom: 10px;
        }
        .widget-title:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 2px;
          background-color: var(--bs-primary);
        }
        .author-avatar {
          position: relative;
          padding: 3px;
          border: 2px solid var(--bs-primary);
          border-radius: 50%;
          width: 106px;
          height: 106px;
        }
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #f8f9fa;
          color: #6c757d;
          transition: all 0.3s ease;
        }
        .social-link:hover {
          background-color: var(--bs-primary);
          color: white;
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

export default SingleBlog;


import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import MostPopularPost from "../components/Sidebar/MostPopularPost";
import Tags from "../components/shop/Tags";
import Link from "next/link";
import axios from "axios";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/blogs');
        // Vérification du format de la réponse et extraction des blogs
        const blogsData = response.data.data || response.data;
        
        if (Array.isArray(blogsData)) {
          setBlogs(blogsData);
        } else {
          console.error("Format de données inattendu:", response.data);
          setError("Format de données incorrect. Contactez l'administrateur.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des blogs:", err);
        setError("Impossible de charger les articles. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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

  return (
    <Layout>
      <PageHeader title="Blog" curPage="Nos articles" />
      <div className="blog-section padding-tb section-bg">
        <Container>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des articles...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5">
              <Card className="border-0 shadow-sm p-4">
                <Card.Body>
                  <i className="icofont-file-text icofont-4x text-muted mb-3"></i>
                  <h3>Aucun article disponible</h3>
                  <p className="text-muted">Nous travaillons à l'ajout de nouveaux articles. Revenez bientôt !</p>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <Row>
              <Col lg={8}>
                <Row className="g-4">
                  {blogs.map((blog) => (
                    <Col md={6} key={blog._id || blog.id}>
                      <Card className="blog-card h-100 border-0 shadow-sm">
                        <div className="image-position position-relative">
                          <img 
                            src={blog.imageUrl || '/default-blog.jpg'} 
                            className="card-img-top" 
                            alt={blog.title}
                            style={{ height: '220px', objectFit: 'cover' }}
                          />
                          {blog.category && (
                            <Badge 
                              bg={getCategoryColor(blog.category)} 
                              className="position-absolute top-0 end-0 m-3"
                            >
                              {blog.category}
                            </Badge>
                          )}
                        </div>
                        <Card.Body>
                          <div className="meta-post d-flex align-items-center gap-2 mb-3 text-muted small">
                            <span><i className="icofont-calendar me-1"></i>{new Date(blog.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span><i className="icofont-ui-user me-1"></i>{blog.author || 'Admin'}</span>
                          </div>
                          <Link href={`/blog/${blog._id || blog.id}`} legacyBehavior>
                            <a className="text-decoration-none">
                              <Card.Title className="h5 mb-3 blog-title">{blog.title}</Card.Title>
                            </a>
                          </Link>
                          <Card.Text className="blog-excerpt">
                            {blog.content?.substring(0, 120).replace(/<[^>]*>/g, '')}...
                          </Card.Text>
                          <Link href={`/blog/${blog._id || blog.id}`} legacyBehavior>
                            <a className="blog-link d-inline-flex align-items-center text-primary">
                              Lire la suite <i className="icofont-rounded-right ms-2"></i>
                            </a>
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col lg={4} className="mt-5 mt-lg-0">
                <div className="sidebar-widget">
                  <Card className="search-widget mb-4 border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="widget-title mb-3">Rechercher</h5>
                      <div className="search-form">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher un article..."
                          />
                          <Button variant="primary">
                            <i className="icofont-search-1"></i>
                          </Button>
                        </div>
                      </div>
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
                      <div className="newsletter-form">
                        <div className="mb-3">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Votre adresse email"
                          />
                        </div>
                        <Button variant="light" className="w-100 text-primary fw-bold">
                          S'abonner
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
      <style jsx>{`
        .blog-title {
          transition: color 0.3s ease;
        }
        .blog-card:hover .blog-title {
          color: var(--bs-primary);
        }
        .blog-excerpt {
          color: #6c757d;
          font-size: 0.9rem;
        }
        .blog-link {
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .blog-link:hover {
          text-decoration: underline !important;
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
      `}</style>
    </Layout>
  );
};

export default BlogPage;

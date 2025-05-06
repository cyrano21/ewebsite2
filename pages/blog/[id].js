import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import axios from "axios";
import { Container, Row, Col, Card, Badge, Button, Form, Spinner } from 'react-bootstrap';
import Link from "next/link";
import Tags from "../../components/shop/Tags";
import PageHeader from "../../components/PageHeader";
import MostPopularPost from "../../components/Sidebar/MostPopularPost";
import { blogSingle01, blogSingle02 } from "../../utils/imageImports";
import Image from "next/image"; // Import Image component

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

export default function BlogPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [commentStatus, setCommentStatus] = useState({ message: '', success: false });

  // Fonction pour soumettre un commentaire
  const submitComment = async (commentData, form) => {
    try {
      setCommentStatus({ message: 'Envoi du commentaire...', success: true });

      const response = await axios.post('/api/blogs/comments', commentData);

      if (response.data.success) {
        // Récupérer les détails du blog à jour après l'ajout du commentaire
        const updatedBlogResponse = await axios.get(`/api/blogs/${id}`);
        
        if (updatedBlogResponse.status === 200) {
          // Mettre à jour l'état complet du blog avec les données fraîches
          setBlog(updatedBlogResponse.data);
        } else {
          // Fallback: ajouter le nouveau commentaire à l'état local
          setBlog(prevBlog => ({
            ...prevBlog,
            comments: [...(prevBlog.comments || []), response.data.comment]
          }));
        }

        // Réinitialiser le formulaire
        form.reset();

        setCommentStatus({ 
          message: 'Commentaire publié avec succès !', 
          success: true 
        });

        // Effacer le message après 3 secondes
        setTimeout(() => {
          setCommentStatus({ message: '', success: false });
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du commentaire:', error);
      setCommentStatus({ 
        message: 'Erreur lors de la publication du commentaire. Veuillez réessayer.', 
        success: false 
      });
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        // Récupérer l'article de blog via l'API
        const response = await axios.get(`/api/blogs/${id}`);

        if (response.status !== 200) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // S'assurer que le tableau de commentaires existe
        const blogData = {
          ...response.data,
          comments: response.data.comments || []
        };

        setBlog(blogData);

        // Récupérer les articles connexes via l'API
        const relatedResponse = await axios.get(`/api/blogs?category=${response.data.category}&exclude=${id}&limit=3`);

        if (relatedResponse.status === 200) {
          const relatedData = relatedResponse.data.data || relatedResponse.data;
          if (Array.isArray(relatedData)) {
            setRelatedPosts(relatedData);
          }
        }

      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const getCategoryColor = (category) => {
    const colors = {
      'Marketing': 'primary',
      'Technologie': 'info',
      'Design': 'success',
      'Business': 'warning',
      'Éducation': 'danger',
      'Lifestyle': 'secondary',
      'Actualités': 'info',
      'Conseils': 'success',
      'Tutoriels': 'primary',
      'Événements': 'danger',
      'Produits': 'warning',
      'Général': 'dark'
    };
    return colors[category] || 'dark';
  };

  if (loading) {
    return (
      <Layout>
        <PageHeader
          title={"Article de blog"}
          curPage={"Blog / Chargement..."}
        />
        <section className="blog-section blog-single padding-tb section-bg">
          <Container>
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
              <p className="mt-2">Chargement de l'article...</p>
            </div>
          </Container>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageHeader
          title={"Erreur"}
          curPage={"Blog / Erreur"}
        />
        <section className="blog-section blog-single padding-tb section-bg">
          <Container>
            <div className="text-center py-5">
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Une erreur est survenue !</h4>
                <p>{error}</p>
                <hr />
                <p className="mb-0">
                  <Button variant="outline-primary" onClick={() => router.push('/blog')}>
                    Retour à la liste des articles
                  </Button>
                </p>
              </div>
            </div>
          </Container>
        </section>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <PageHeader
          title={"Article non trouvé"}
          curPage={"Blog / 404"}
        />
        <section className="blog-section blog-single padding-tb section-bg">
          <Container>
            <div className="text-center py-5">
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Article non trouvé</h4>
                <p>L'article que vous recherchez n'existe pas ou a été supprimé.</p>
                <hr />
                <p className="mb-0">
                  <Button variant="primary" onClick={() => router.push('/blog')}>
                    Voir tous les articles
                  </Button>
                </p>
              </div>
            </div>
          </Container>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="blog-single-page" style={{ paddingTop: '15px' }}>
        <PageHeader
          title={"Article de blog"}
          curPage={`Blog / ${blog.title}`}
        />
        <section className="blog-section blog-single padding-tb section-bg">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} className="mb-4 mb-lg-0">
                <Card className="border-0 shadow-sm overflow-hidden">
                  <article className="single-blog-article">
                    <div className="post-thumb">
                      <img
                        src={blog.image || "/default-blog.jpg"}
                        alt={blog.title}
                        className="w-100 img-fluid"
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                      />
                      {blog.category && (
                        <Badge 
                          bg={getCategoryColor(blog.category)} 
                          className="position-absolute top-0 end-0 m-3 py-2 px-3"
                        >
                          {blog.category}
                        </Badge>
                      )}
                    </div>

                    <div className="post-content p-4 p-lg-5">
                      <div className="meta-post d-flex flex-wrap gap-3 mb-3 text-muted small">
                        <div className="meta-item">
                          <i className="icofont-calendar me-1"></i>
                          {new Date(blog.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="meta-item">
                          <i className="icofont-ui-user me-1"></i>
                          {blog.author || "Auteur inconnu"}
                        </div>
                        {blog.comments && (
                          <div className="meta-item">
                            <i className="icofont-speech-comments me-1"></i>
                            {blog.comments.length} Commentaires
                          </div>
                        )}
                      </div>

                      <h1 className="blog-title mb-4">{blog.title}</h1>

                      <div className="blog-content">
                        {blog.content.split('\n').map((paragraph, idx) => (
                          paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
                        ))}
                      </div>

                      <div className="tags-section mt-5 pt-4 border-top d-flex flex-column flex-md-row justify-content-between">
                        <div className="tags mb-3 mb-md-0">
                          <h6 className="d-inline me-2">Tags:</h6>
                          <ul className="tags-list d-inline-flex flex-wrap gap-2">
                            {blog.tags && blog.tags.length > 0 ? 
                              blog.tags.map((tag, index) => (
                                <li key={index}>
                                  <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">{tag}</Badge>
                                </li>
                              )) : 
                              ['Blog', 'Article', blog.category].map((tag, index) => (
                                <li key={index}>
                                  <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">{tag}</Badge>
                                </li>
                              ))
                            }
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
                </Card>

                <div className="post-navigation mt-4 d-flex flex-column flex-md-row gap-3">
                  <Link
                    href="/blog"
                    className="prev-post flex-grow-1">
                    <Card className="border-0 shadow-sm h-100 post-nav-card prev-card">
                      <Card.Body className="d-flex align-items-center p-3">
                        <div className="nav-icon me-3">
                          <i className="icofont-double-left fs-3"></i>
                        </div>
                        <div className="nav-content">
                          <small className="text-muted d-block">Retour</small>
                          <h6 className="nav-title mb-0 text-truncate">Liste des articles</h6>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="related-posts mt-5">
                    <h4 className="mb-4">Articles connexes</h4>
                    <Row className="g-4">
                      {relatedPosts.map((post, index) => (
                        <Col md={4} key={index}>
                          <Card className="border-0 shadow-sm h-100 related-post-card">
                            <Link href={`/blog/${post._id || post.id}`} className="img-link">
                              <div className="related-post-img">
                                <img 
                                  src={post.image || "/default-blog.jpg"} 
                                  alt={post.title} 
                                  className="card-img-top" 
                                />
                              </div>
                            </Link>
                            <Card.Body className="p-3">
                              <Link href={`/blog/${post._id || post.id}`} className="text-decoration-none">
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
                      <h4 className="mb-4">Commentaires ({blog.comments?.length || 0})</h4>

                      <div className="comments-list">
                        {blog && blog.comments && blog.comments.length > 0 ? (
                          <>
                            {blog.comments.map((comment, index) => (
                              <div key={index} className="comment-item d-flex mb-4 pb-4 border-bottom">
                                <div className="commenter-avatar me-3">
                                  <Image
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=random&format=png`}
                                    alt={comment.author}
                                    className="rounded-circle"
                                    width={60}
                                    height={60}
                                  />
                                </div>
                                <div className="comment-content flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="commenter-name mb-0">{comment.author}</h6>
                                    <small className="comment-date text-muted">
                                      {new Date(comment.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </small>
                                  </div>
                                  <p className="mb-2">{comment.content}</p>
                                  <Button variant="link" className="p-0 text-primary reply-btn">
                                    <i className="icofont-reply me-1"></i>Répondre
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {/*<div className="text-center">
                              <Button variant="outline-primary" className="rounded-pill px-4">
                                <i className="icofont-comment me-2"></i>Voir plus de commentaires
                              </Button>
                            </div>*/}
                          </>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
                          </div>
                        )}
                      </div>

                      <div className="comment-form mb-3">
                        <h5 className="mb-3">Laisser un commentaire</h5>
                        <Form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target);
                          submitComment({
                            blogId: blog._id,
                            author: formData.get('name'),
                            email: formData.get('email'),
                            content: formData.get('comment')
                          }, e.target);
                        }}>
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Control 
                                  type="text" 
                                  name="name"
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
                                  name="email"
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
                                  name="comment"
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
                          {commentStatus.message && (
                            <div className={`mt-3 alert alert-${commentStatus.success ? 'success' : 'danger'}`}>
                              {commentStatus.message}
                            </div>
                          )}
                        </Form>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>

              <Col lg={4}>
                <aside className="blog-sidebar sticky-top" style={{ top: '5rem', zIndex: 900 }}>
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
                      <h5 className="author-name">{blog.author || "Auteur"}</h5>
                      <p className="author-bio text-muted mb-3">
                        Rédacteur spécialisé en marketing digital et nouvelles technologies avec plus de 5 ans d'expérience dans le domaine.
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
                        <div className="input-group">
                          <Form.Control
                            placeholder="Rechercher dans le blog..."
                            className="border-end-0"
                          />
                          <Button variant="primary">
                            <i className="icofont-search-1"></i>
                          </Button>
                        </div>
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
                      <Tags 
                        tags={['Blog', 'Article', blog.category, 'Technologie']} 
                        onTagClick={(tag) => console.log('Tag clicked:', tag)}
                      />
                    </Card.Body>
                  </Card>

                  <Card className="newsletter-widget border-0 shadow-sm bg-primary text-white">
                    <Card.Body className="p-4">
                      <h5 className="widget-title text-white mb-3">Newsletter</h5>
                      <p className="mb-3">Abonnez-vous à notre newsletter pour recevoir nos derniers articles.</p>
                      <Form className="newsletter-form" onSubmit={async (e) => {
                        e.preventDefault();
                        const email = e.target.elements.email.value;
                        if (!email) return;
                        
                        try {
                          const response = await fetch('/api/newsletter/subscribe', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email }),
                          });
                          
                          const data = await response.json();
                          
                          if (response.ok) {
                            // Réinitialiser le formulaire
                            e.target.reset();
                            // Afficher une notification de succès
                            alert(data.message || 'Inscription à la newsletter réussie !');
                          } else {
                            // Afficher une notification d'erreur
                            alert(data.message || 'Erreur lors de l\'inscription');
                          }
                        } catch (error) {
                          console.error('Erreur lors de l\'inscription:', error);
                          alert('Une erreur est survenue lors de l\'inscription');
                        }
                      }}>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Votre adresse email"
                            className="rounded-pill"
                            required
                          />
                        </Form.Group>
                        <Button 
                          type="submit" 
                          variant="light" 
                          className="rounded-pill w-100 text-primary fw-bold"
                        >
                          S'abonner
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </aside>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
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
    </Layout>
  );
}
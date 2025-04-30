import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import blogList from "../../utils/blogdata";

const Blog = () => {
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [categories, setCategories] = useState(["Tous"]);
  const [viewType, setViewType] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  useEffect(() => {
    const unique = [
      ...new Set(blogList.flatMap((b) => (b.category ? [b.category] : []))),
    ];
    setCategories(["Tous", ...unique.sort()]);
  }, []);

  useEffect(() => {
    let res = [...blogList];
    if (searchTerm) {
      res = res.filter(
        (b) =>
          b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "Tous") {
      res = res.filter((b) => b.category === selectedCategory);
    }
    setFilteredBlogs(res);
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (cat) => setSelectedCategory(cat);

  const getCategoryColor = (cat) => {
    const colors = {
      Marketing: "primary",
      Technologie: "info",
      Design: "success",
      Business: "warning",
      Éducation: "danger",
      Lifestyle: "secondary",
    };
    return colors[cat] || "dark";
  };

  const formatDate = (ds) =>
    new Date(ds || Date.now()).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="blog-page">
      <PageHeader title="Notre Blog" curPage="Articles & Actualités" />
      <section className="blog-section padding-tb section-bg">
        <Container>
          {/* --- En-tête recherche et vues --- */}
          <div className="blog-header mb-4">
            <Row className="align-items-center g-4">
              <Col lg={4}>
                <h2 className="mb-0 fw-bold">
                  <span className="text-primary">Articles</span> & Actualités
                </h2>
              </Col>
              <Col lg={8}>
                <div className="d-flex flex-wrap gap-3 justify-content-lg-end">
                  <div
                    className="search-box flex-grow-1"
                    style={{ maxWidth: "400px" }}
                  >
                    <InputGroup>
                      <Form.Control
                        placeholder="Rechercher un article..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border-end-0"
                      />
                      <InputGroup.Text className="bg-white">
                        <i className="icofont-search-1 text-muted"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                  <div className="view-options d-flex">
                    <Button
                      variant={viewType === "grid" ? "primary" : "outline-secondary"}
                      className="me-2"
                      onClick={() => setViewType("grid")}
                    >
                      <i className="icofont-listine-dots"></i>
                    </Button>
                    <Button
                      variant={viewType === "list" ? "primary" : "outline-secondary"}
                      onClick={() => setViewType("list")}
                    >
                      <i className="icofont-listing-box"></i>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* --- Filtre catégorie --- */}
          <div className="category-filter mb-4">
            <div className="filter-buttons d-flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <Button
                  key={idx}
                  variant={selectedCategory === cat ? "primary" : "outline-secondary"}
                  className="rounded-pill px-3 py-2"
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat === "Tous" && <i className="icofont-justify-all me-1"></i>}
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* --- Liste des articles --- */}
          <div className="section-wrapper">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des articles...</p>
              </div>
            ) : filteredBlogs.length > 0 ? (
              viewType === "grid" ? (
                <Row className="row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                  {filteredBlogs.map((blog, i) => (
                    <Col key={i} className="blog-item-col">
                      <Card className="h-100 blog-card shadow-sm border-0 hover-effect">
                        <div className="position-relative">
                          {/* Image cliquable */}
                          <Link href={`/blog/${blog.id}`} legacyBehavior passHref>
                            <a className="img-link d-block overflow-hidden">
                              <Card.Img
                                variant="top"
                                src={blog.imgUrl || "/default-blog.jpg"}
                                alt={blog.imgAlt}
                                onError={(e) =>
                                  (e.currentTarget.src = "/default-blog.jpg")
                                }
                                className="blog-img"
                              />
                            </a>
                          </Link>

                          {blog.category && (
                            <Badge
                              bg={getCategoryColor(blog.category)}
                              className="position-absolute top-0 end-0 m-3 py-2 px-3"
                            >
                              {blog.category}
                            </Badge>
                          )}
                        </div>

                        <Card.Body className="p-4">
                          {/* Titre cliquable */}
                          <Link href={`/blog/${blog.id}`} legacyBehavior passHref>
                            <a className="text-decoration-none">
                              <Card.Title as="h4" className="blog-title mb-3">
                                {blog.title}
                              </Card.Title>
                            </a>
                          </Link>

                          <div className="meta-post mb-3">
                            <ul className="lab-ul d-flex flex-wrap gap-3 text-muted small">
                              {blog.metaList.map((val, j) => (
                                <li key={j} className="d-flex align-items-center">
                                  <i className={`${val.iconName} me-1`}></i>
                                  {val.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Card.Text className="blog-excerpt text-muted">
                            {blog.desc.length > 120
                              ? `${blog.desc.substring(0, 120)}…`
                              : blog.desc}
                          </Card.Text>
                        </Card.Body>

                        <Card.Footer className="bg-white border-top d-flex justify-content-between align-items-center p-4 pt-0">
                          {/* Bouton “Lire la suite” */}
                          <Link href={`/blog/${blog.id}`} legacyBehavior passHref>
                            <a className="read-more text-primary text-decoration-none">
                              {blog.btnText}&nbsp;
                              <i className="icofont-arrow-right ms-1"></i>
                            </a>
                          </Link>
                          <div className="comments text-muted">
                            <i className="icofont-comment me-1"></i>
                            <span className="comment-count">{blog.commentCount}</span>
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="list-view-blogs">
                  {filteredBlogs.map((blog, i) => (
                    <Card
                      key={i}
                      className="mb-4 blog-list-card shadow-sm border-0 hover-effect"
                    >
                      <Row className="g-0">
                        <Col md={4} className="position-relative">
                          {/* Image list view */}
                          <Link href={`/blog/${blog.id}`} legacyBehavior passHref>
                            <a className="h-100 d-block overflow-hidden">
                              <img
                                src={blog.imgUrl || "/default-blog.jpg"}
                                alt={blog.imgAlt}
                                className="img-fluid rounded-start h-100 w-100 blog-img"
                                style={{ objectFit: "cover" }}
                                onError={(e) =>
                                  (e.currentTarget.src = "/default-blog.jpg")
                                }
                              />
                            </a>
                          </Link>
                          {blog.category && (
                            <Badge
                              bg={getCategoryColor(blog.category)}
                              className="position-absolute top-0 end-0 m-3 py-2 px-3"
                            >
                              {blog.category}
                            </Badge>
                          )}
                        </Col>
                        <Col md={8}>
                          <Card.Body className="d-flex flex-column h-100 p-4">
                            {/* Titre list view */}
                            <Link href={`/blog/${blog.id}`} legacyBehavior passHref>
                              <a className="text-decoration-none">
                                <Card.Title as="h4" className="blog-title mb-2">
                                  {blog.title}
                                </Card.Title>
                              </a>
                            </Link>
                            <div className="meta-post mb-3">
                              <ul className="lab-ul d-flex flex-wrap gap-3 text-muted small">
                                {blog.metaList.map((val, j) => (
                                  <li key={j} className="d-flex align-items-center">
                                    <i className={`${val.iconName} me-1`}></i>
                                    {val.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Card.Text className="blog-excerpt text-muted flex-grow-1">
                              {blog.desc}
                            </Card.Text>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              {/* Bouton list view */}
                              <Link href={`/blog/${blog.id}`} legacyBehavior passHref>
                                <a className="read-more btn btn-sm btn-outline-primary rounded-pill px-3">
                                  {blog.btnText}&nbsp;
                                  <i className="icofont-arrow-right ms-1"></i>
                                </a>
                              </Link>
                              <div className="comments text-muted">
                                <i className="icofont-comment me-1"></i>
                                <span className="comment-count">
                                  {blog.commentCount}
                                </span>
                              </div>
                            </div>
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="no-results text-center py-5">
                <i className="icofont-warning-alt text-warning display-1"></i>
                <h3 className="mt-3">Aucun article trouvé</h3>
                <p className="text-muted">
                  Aucun article ne correspond à vos critères de recherche.
                </p>
                <Button
                  variant="primary"
                  className="mt-3 rounded-pill"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Tous");
                  }}
                >
                  <i className="icofont-refresh me-1"></i> Réinitialiser
                  les filtres
                </Button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* CSS perso */}
      <style jsx>{`
        .blog-page .hover-effect {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .blog-page .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .blog-page .blog-img {
          height: 220px;
          object-fit: cover;
          transition: all 0.5s ease;
        }
        .blog-page .img-link {
          overflow: hidden;
          display: block;
        }
        .blog-page .hover-effect:hover .blog-img {
          transform: scale(1.05);
        }
        .blog-page .blog-title {
          color: #333;
          transition: color 0.3s ease;
        }
        .blog-page .blog-title:hover {
          color: var(--bs-primary);
        }
        .blog-page .read-more {
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .blog-page .read-more:hover {
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default Blog;

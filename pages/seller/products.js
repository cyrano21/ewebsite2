
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, InputGroup, Spinner, Alert, Pagination, Modal } from 'react-bootstrap';
import SellerLayout from '../../components/seller/SellerLayout';
import Image from 'next/image';
import Link from 'next/link';

const SellerProducts = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const productsPerPage = 10;

  useEffect(() => {
    // Vérifier l'authentification et le statut de vendeur
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/seller/products');
      return;
    }

    if (session && session.user && session.user.sellerStatus !== 'approved') {
      router.push('/seller/dashboard');
      return;
    }

    // Charger les produits
    fetchProducts();
  }, [session, status, currentPage, filter, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: productsPerPage,
        filter,
        sort: sortBy,
        order: sortOrder,
        search: searchTerm
      });

      const response = await fetch(`/api/seller/products?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.totalPages);
      } else {
        setError(data.message || 'Erreur lors du chargement des produits');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/seller/products/${productToDelete._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setProducts(products.filter(p => p._id !== productToDelete._id));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        setError(data.message || 'Erreur lors de la suppression du produit');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du produit:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const renderPagination = () => {
    const pages = [];
    
    // Première page
    pages.push(
      <Pagination.Item 
        key="first" 
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );
    
    // Ellipsis si nécessaire
    if (currentPage > 3) {
      pages.push(<Pagination.Ellipsis key="ellipsis1" />);
    }
    
    // Pages autour de la page courante
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <Pagination.Item 
            key={i} 
            active={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }
    
    // Ellipsis si nécessaire
    if (currentPage < totalPages - 2) {
      pages.push(<Pagination.Ellipsis key="ellipsis2" />);
    }
    
    // Dernière page si plus d'une page
    if (totalPages > 1) {
      pages.push(
        <Pagination.Item 
          key="last" 
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination>
        <Pagination.Prev 
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next 
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  // État de chargement pendant la vérification de la session
  if (status === 'loading') {
    return (
      <SellerLayout title="Produits">
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </Container>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout title="Gestion des Produits">
      <Container fluid className="py-4">
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="mb-0">Gestion des Produits</h2>
            <p className="text-muted">Gérez l'inventaire de votre boutique</p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={() => router.push('/seller/products/new')}>
              <i className="icofont-plus me-1"></i> Ajouter un produit
            </Button>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-white py-3">
            <Row className="align-items-center">
              <Col md={4}>
                <Form onSubmit={handleSearch}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-secondary" type="submit">
                      <i className="icofont-search"></i>
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col md={8}>
                <div className="d-flex justify-content-md-end mt-3 mt-md-0">
                  <Form.Select 
                    className="me-2" 
                    style={{ width: 'auto' }}
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    <option value="all">Tous les produits</option>
                    <option value="active">Produits actifs</option>
                    <option value="inactive">Produits inactifs</option>
                    <option value="low_stock">Stock faible</option>
                    <option value="out_of_stock">Rupture de stock</option>
                  </Form.Select>
                  <div className="d-flex align-items-center">
                    <Form.Select 
                      style={{ width: 'auto' }}
                      value={sortBy}
                      onChange={handleSortChange}
                    >
                      <option value="createdAt">Date de création</option>
                      <option value="name">Nom</option>
                      <option value="price">Prix</option>
                      <option value="stock">Stock</option>
                      <option value="soldCount">Ventes</option>
                    </Form.Select>
                    <Button 
                      variant="link" 
                      className="p-0 ms-2"
                      onClick={handleSortOrderToggle}
                    >
                      <i className={`icofont-arrow-${sortOrder === 'asc' ? 'up' : 'down'} fs-5`}></i>
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </Spinner>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <i className="icofont-box fs-1 text-muted"></i>
                <p className="mt-3 text-muted">Aucun produit trouvé</p>
                <Button variant="outline-primary" onClick={() => router.push('/seller/products/new')}>
                  Ajouter votre premier produit
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Catégorie</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Statut</th>
                      <th>Ventes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3" style={{ width: '50px', height: '50px', position: 'relative' }}>
                              {product.img ? (
                                <Image 
                                  src={product.img} 
                                  alt={product.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded"
                                />
                              ) : (
                                <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                  <i className="icofont-image text-muted"></i>
                                </div>
                              )}
                            </div>
                            <div style={{ maxWidth: '200px' }}>
                              <p className="mb-0 fw-medium text-truncate">{product.name}</p>
                              <small className="text-muted">ID: {product._id.substring(0, 8)}</small>
                            </div>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td>
                          {product.salePrice > 0 ? (
                            <div>
                              <span className="fw-medium">{product.salePrice} €</span>
                              <span className="text-muted text-decoration-line-through ms-2">{product.price} €</span>
                            </div>
                          ) : (
                            <span className="fw-medium">{product.price} €</span>
                          )}
                        </td>
                        <td>
                          <span className={`fw-medium ${product.stock <= 5 ? 'text-danger' : product.stock <= 10 ? 'text-warning' : ''}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <Badge bg={product.isActive ? 'success' : 'secondary'}>
                            {product.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </td>
                        <td>{product.soldCount || 0}</td>
                        <td>
                          <div className="d-flex">
                            <Link href={`/seller/products/${product._id}`} passHref>
                              <Button variant="outline-primary" size="sm" className="me-2">
                                <i className="icofont-edit"></i>
                              </Button>
                            </Link>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => confirmDelete(product)}
                            >
                              <i className="icofont-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
          {!loading && products.length > 0 && (
            <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
              <div>
                Affichage de {products.length} sur {Math.min(productsPerPage, products.length)} produits
              </div>
              <div className="d-flex align-items-center">
                {renderPagination()}
              </div>
            </Card.Footer>
          )}
        </Card>
      </Container>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productToDelete && (
            <p>
              Êtes-vous sûr de vouloir supprimer le produit <strong>{productToDelete.name}</strong> ?
              <br />
              Cette action est irréversible.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteProduct}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </SellerLayout>
  );
};

export default SellerProducts;

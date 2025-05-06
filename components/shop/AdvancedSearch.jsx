
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Accordion, RangeSlider } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';

const AdvancedSearch = ({ onSearch }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [ratings, setRatings] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [inStock, setInStock] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [discount, setDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Charger les catégories et les marques
    const fetchFilterOptions = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products?limit=100') // Récupérer des produits pour extraire les marques
        ]);
        
        setCategories(categoriesRes.data || []);
        
        // Extraire les marques uniques
        const uniqueBrands = Array.from(
          new Set(productsRes.data.products.map(product => product.brand).filter(Boolean))
        );
        setBrands(uniqueBrands);
        
      } catch (error) {
        console.error('Erreur lors du chargement des options de filtre:', error);
      }
    };
    
    fetchFilterOptions();
    
    // Récupérer les paramètres de l'URL
    if (router.query) {
      setSearchQuery(router.query.q || '');
      setSortBy(router.query.sortBy || 'relevance');
      setRatings(router.query.ratings || '');
      setInStock(router.query.inStock === 'true');
      setNewArrival(router.query.newArrival === 'true');
      setDiscount(router.query.discount === 'true');
      
      if (router.query.categories) {
        setSelectedCategories(router.query.categories.split(','));
      }
      
      if (router.query.brands) {
        setSelectedBrands(router.query.brands.split(','));
      }
      
      if (router.query.minPrice && router.query.maxPrice) {
        setPriceRange([parseInt(router.query.minPrice), parseInt(router.query.maxPrice)]);
      }
    }
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const searchParams = {
      q: searchQuery,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categories: selectedCategories.join(','),
      brands: selectedBrands.join(','),
      ratings,
      sortBy,
      inStock: inStock ? 'true' : 'false',
      newArrival: newArrival ? 'true' : 'false',
      discount: discount ? 'true' : 'false'
    };
    
    // Filtrer les paramètres vides
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== '' && v !== 'false' && v !== '0,1000')
    );
    
    // Construire l'URL avec les paramètres de recherche
    const queryString = new URLSearchParams(filteredParams).toString();
    
    // Rechercher et mettre à jour l'URL
    if (onSearch) {
      onSearch(searchParams);
    }
    
    router.push(`/shop?${queryString}`, undefined, { shallow: true });
    setLoading(false);
  };
  
  const handleReset = () => {
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setRatings('');
    setSortBy('relevance');
    setInStock(false);
    setNewArrival(false);
    setDiscount(false);
    
    if (onSearch) {
      onSearch({});
    }
    
    router.push('/shop', undefined, { shallow: true });
  };
  
  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };
  
  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0">Recherche avancée</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {/* Champ de recherche */}
          <Form.Group className="mb-3">
            <Form.Control 
              type="text" 
              placeholder="Rechercher des produits..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          
          <Accordion defaultActiveKey="0" className="mb-3">
            {/* Plage de prix */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>Prix</Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>{priceRange[0]} €</span>
                    <span>{priceRange[1]} €</span>
                  </div>
                  <RangeSlider
                    value={priceRange}
                    onChange={(e) => setPriceRange([parseInt(e.target.value[0]), parseInt(e.target.value[1])])}
                    min={0}
                    max={1000}
                    step={10}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            
            {/* Catégories */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>Catégories</Accordion.Header>
              <Accordion.Body>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {categories.map((category) => (
                    <Form.Check 
                      key={category._id}
                      type="checkbox"
                      id={`category-${category._id}`}
                      label={category.name}
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                      className="mb-2"
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
            
            {/* Marques */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>Marques</Accordion.Header>
              <Accordion.Body>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {brands.map((brand) => (
                    <Form.Check 
                      key={brand}
                      type="checkbox"
                      id={`brand-${brand}`}
                      label={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="mb-2"
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
            
            {/* Évaluations */}
            <Accordion.Item eventKey="3">
              <Accordion.Header>Évaluations</Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  {[4, 3, 2, 1].map((rating) => (
                    <Form.Check 
                      key={rating}
                      type="radio"
                      id={`rating-${rating}`}
                      name="rating"
                      label={
                        <div className="d-flex align-items-center">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i}
                              className={`icofont-star ${i < rating ? 'text-warning' : 'text-muted'}`}
                              style={{ fontSize: '14px' }}
                            ></i>
                          ))}
                          <span className="ms-2">{rating}+ étoiles</span>
                        </div>
                      }
                      value={rating}
                      checked={ratings === rating.toString()}
                      onChange={(e) => setRatings(e.target.value)}
                      className="mb-2"
                    />
                  ))}
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            
            {/* Options supplémentaires */}
            <Accordion.Item eventKey="4">
              <Accordion.Header>Autres options</Accordion.Header>
              <Accordion.Body>
                <Form.Check 
                  type="checkbox"
                  id="inStock"
                  label="En stock uniquement"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox"
                  id="newArrival"
                  label="Nouveautés"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox"
                  id="discount"
                  label="En promotion"
                  checked={discount}
                  onChange={(e) => setDiscount(e.target.checked)}
                  className="mb-2"
                />
              </Accordion.Body>
            </Accordion.Item>
            
            {/* Tri */}
            <Accordion.Item eventKey="5">
              <Accordion.Header>Trier par</Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  <Form.Select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="relevance">Pertinence</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="rating_desc">Meilleures évaluations</option>
                    <option value="newest">Plus récents</option>
                    <option value="popularity">Popularité</option>
                  </Form.Select>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <Row>
            <Col>
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Recherche en cours...' : 'Rechercher'}
              </Button>
            </Col>
            <Col>
              <Button 
                variant="outline-secondary" 
                type="button" 
                className="w-100"
                onClick={handleReset}
              >
                Réinitialiser
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdvancedSearch;

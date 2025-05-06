import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SearchBar.module.css';

const SearchBar = ({ 
  placeholder = "Rechercher un produit...",
  maxSuggestions = 5,
  minSearchLength = 2,
  onSearch,
  className = "",
  variant = "light", // light or dark
  searchEndpoint = '/api/search',
  categories = []
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Charger les recherches récentes depuis le localStorage
  useEffect(() => {
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      try {
        setRecentSearches(JSON.parse(recent));
      } catch (error) {
        console.error('Erreur lors du chargement des recherches récentes:', error);
        localStorage.removeItem('recentSearches');
      }
    }

    // Données factices pour les recherches populaires
    setPopularSearches([
      'smartphone', 'ordinateur portable', 'écouteurs sans fil', 'montre connectée', 'tablette'
    ]);

    // Gestionnaire de clic en dehors pour fermer les suggestions
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour effectuer la recherche
  const fetchSuggestions = async (query) => {
    if (!query || query.length < minSearchLength) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Simuler un appel API avec un délai
      setTimeout(async () => {
        // Dans une application réelle, vous feriez un appel API ici
        // const response = await fetch(`${searchEndpoint}?q=${query}&category=${selectedCategory}`);
        // const data = await response.json();
        
        // Données factices pour les suggestions
        const mockedResults = [
          { id: 1, name: 'Smartphone Samsung Galaxy S21', category: 'Électronique', price: 899.99, thumbnail: '/assets/img/products/smartphone1.jpg' },
          { id: 2, name: 'Smartphone iPhone 13 Pro', category: 'Électronique', price: 1099.99, thumbnail: '/assets/img/products/smartphone2.jpg' },
          { id: 3, name: 'Smartphone Xiaomi Mi 11', category: 'Électronique', price: 699.99, thumbnail: '/assets/img/products/smartphone3.jpg' },
          { id: 4, name: 'Smartphone Google Pixel 6', category: 'Électronique', price: 799.99, thumbnail: '/assets/img/products/smartphone4.jpg' },
          { id: 5, name: 'Smartphone OnePlus 9 Pro', category: 'Électronique', price: 899.99, thumbnail: '/assets/img/products/smartphone5.jpg' },
          { id: 6, name: 'Smart TV Samsung 55 pouces', category: 'Électronique', price: 999.99, thumbnail: '/assets/img/products/tv1.jpg' },
        ].filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) && 
          (!selectedCategory || item.category === selectedCategory)
        ).slice(0, maxSuggestions);

        setSuggestions(mockedResults);
        setIsLoading(false);
      }, 300); // Délai simulé de 300ms pour montrer le chargement
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  // Gérer le changement dans l'input de recherche
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  // Gérer la soumission du formulaire de recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Ajouter la recherche à l'historique
    const updatedRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5); // Garder uniquement les 5 dernières recherches
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
    
    // Fermer les suggestions
    setShowSuggestions(false);
    
    // Naviguer vers la page de résultats de recherche
    router.push(`/customer/ProductsFilter?search=${encodeURIComponent(searchQuery)}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`);
    
    // Appeler la fonction onSearch si elle est fournie
    if (onSearch) {
      onSearch(searchQuery, selectedCategory);
    }
  };

  // Gérer le clic sur une suggestion
  const handleSuggestionClick = (suggestion) => {
    router.push(`/customer/ProductDetails?id=${suggestion.id}`);
    setShowSuggestions(false);
  };

  // Gérer le clic sur une recherche récente ou populaire
  const handleSearchItemClick = (query) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    router.push(`/customer/ProductsFilter?search=${encodeURIComponent(query)}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ''}`);
  };

  // Focus sur l'input
  const handleFocus = () => {
    setShowSuggestions(true);
  };

  return (
    <div className={`${styles.searchContainer} ${className}`} ref={searchContainerRef}>
      <Form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <InputGroup>
          {categories.length > 0 && (
            <Form.Select 
              className={styles.categorySelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Sélectionner une catégorie"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          )}
          
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            className={`${styles.searchInput} ${styles[variant]}`}
            aria-label="Barre de recherche"
          />
          
          <Button 
            type="submit" 
            variant={variant === 'dark' ? 'light' : 'primary'} 
            className={styles.searchButton}
          >
            <i className="icofont-search-1"></i>
          </Button>
        </InputGroup>
      </Form>
      
      {/* Suggestions de recherche */}
      {showSuggestions && (
        <div className={styles.suggestionsContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spinner animation="border" size="sm" />
              <span>Recherche en cours...</span>
            </div>
          ) : (
            <>
              {/* Résultats de recherche */}
              {searchQuery.length >= minSearchLength && (
                <div className={styles.suggestionsSection}>
                  <h6 className={styles.sectionTitle}>Résultats de recherche</h6>
                  {suggestions.length > 0 ? (
                    <ListGroup variant="flush">
                      {suggestions.map((suggestion) => (
                        <ListGroup.Item 
                          key={suggestion.id} 
                          action 
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={styles.suggestionItem}
                        >
                          <div className={styles.suggestionContent}>
                            {suggestion.thumbnail && (
                              <div className={styles.thumbnailContainer}>
                                <Image 
                                  src={suggestion.thumbnail} 
                                  alt={suggestion.name}
                                  width={40}
                                  height={40}
                                  className={styles.thumbnail}
                                />
                              </div>
                            )}
                            <div className={styles.suggestionDetails}>
                              <div className={styles.suggestionName}>
                                {suggestion.name}
                              </div>
                              <div className={styles.suggestionMeta}>
                                <span className={styles.suggestionCategory}>
                                  {suggestion.category}
                                </span>
                                <span className={styles.suggestionPrice}>
                                  {suggestion.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className={styles.noResults}>
                      Aucun résultat trouvé pour "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
              
              {/* Recherches récentes */}
              {searchQuery.length < minSearchLength && recentSearches.length > 0 && (
                <div className={styles.suggestionsSection}>
                  <h6 className={styles.sectionTitle}>Recherches récentes</h6>
                  <ListGroup variant="flush">
                    {recentSearches.map((search, index) => (
                      <ListGroup.Item 
                        key={`recent-${index}`} 
                        action 
                        onClick={() => handleSearchItemClick(search)}
                        className={styles.searchHistoryItem}
                      >
                        <i className="icofont-history me-2 text-muted"></i>
                        {search}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className={styles.clearHistoryContainer}>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className={styles.clearHistory}
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('recentSearches');
                      }}
                    >
                      Effacer l'historique
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Recherches populaires */}
              {searchQuery.length < minSearchLength && popularSearches.length > 0 && (
                <div className={styles.suggestionsSection}>
                  <h6 className={styles.sectionTitle}>Recherches populaires</h6>
                  <div className={styles.popularSearches}>
                    {popularSearches.map((search, index) => (
                      <Button 
                        key={`popular-${index}`} 
                        variant="outline-secondary" 
                        size="sm" 
                        className={styles.popularSearch}
                        onClick={() => handleSearchItemClick(search)}
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
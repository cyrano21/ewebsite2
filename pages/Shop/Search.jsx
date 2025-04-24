// components/shop/Search.jsx
/* eslint-disable react/prop-types */
import React from 'react'; // Plus besoin de useState ici
import Link from 'next/link';

// Accepter les nouvelles props définies dans Shop.js
const Search = ({ searchTerm, onSearchChange, onSearchSubmit }) => {

  // Pas besoin de filtrer ici, c'est géré par le composant Shop
  // const filteredProducts = products.filter(...) // SUPPRIMER

  // Le handler de soumission appelle la fonction du parent
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit(event); // Notifie Shop de lancer la recherche (mise à jour URL)
  };

  // Le handler de changement appelle la fonction du parent
  const handleChange = (event) => {
    onSearchChange(event); // Notifie Shop du changement dans l'input
  };

  return (
    <div className="widget widget-search">
      {/* Garder le titre si vous en aviez un ou l'ajouter */}
       <h4 className="widget-title">Recherche</h4>
      <form className="search-wrapper mb-3" onSubmit={handleSubmit}> {/* Utiliser onSubmit */}
        <input
          type="text"
          name="search" // 'name' peut être utile, ou 's' comme avant
          id="search"   // Ajouter un id pour le label potentiel
          placeholder="Rechercher..."
          value={searchTerm} // Utiliser la prop searchTerm venant de Shop
          onChange={handleChange} // Utiliser le handler qui notifie Shop
        />
        <button type="submit">
          <i className="icofont-search-2"></i>
        </button>
      </form>

      {/*
        Supprimer l'affichage des résultats ici.
        L'affichage se fait dans la zone principale des produits dans Shop.js
      */}
      {/* <div> ... affichage des filteredProducts ... </div> */}

    </div>
  );
};

export default Search;
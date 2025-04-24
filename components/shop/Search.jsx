/* eslint-disable react/prop-types */
import React from 'react';

const Search = ({ searchTerm, onSearchChange, onSearchSubmit }) => (
  <div className="widget widget-search">
    <h4 className="widget-title">Recherche</h4>
    <form className="search-wrapper mb-3" onSubmit={onSearchSubmit}>
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={onSearchChange}
      />
      <button type="submit">
        <i className="icofont-search-2"></i>
      </button>
    </form>
  </div>
);

export default Search;

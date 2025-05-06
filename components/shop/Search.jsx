import React, { useState } from "react";

const Search = ({ onSearch, disabled }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="widget widget-search">
      <form className="search-wrapper mb-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="form-control"
        />
        <button type="submit" disabled={disabled} className="btn btn-link p-0 ms-2">
          <i className="icofont-search-2"></i>
        </button>
      </form>
    </div>
  );
};

export default Search;
import React, { useState } from 'react';

const SearchBar = ({ onSearch, isLoading, initialValue }) => {
  const [query, setQuery] = useState(initialValue || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="search-container animate-fade-in">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for papers, e.g., 'Transformers in NLP'..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="search-btn" disabled={isLoading}>
          {isLoading ? (
            <div className="loader" style={{ width: '16px', height: '16px', margin: 0, borderWidth: '2px' }}></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

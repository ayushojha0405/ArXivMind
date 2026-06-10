import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import ResultsList from '../../components/ResultsList';
import { useSearch } from '../../hooks/useSearch';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { data, isLoading, error, executeSearch } = useSearch();

  useEffect(() => {
    if (initialQuery) {
      sessionStorage.setItem('lastSearch', initialQuery);
      executeSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSearch = (query) => {
    sessionStorage.setItem('lastSearch', query);
    setSearchParams({ q: query }, { replace: true });
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>

      <main style={{ flex: 1, padding: '24px 0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        <div className="animate-fade-in">
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Search Results</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            {initialQuery ? `Showing results for "${initialQuery}"` : 'Enter a query to search papers.'}
          </p>

          <ResultsList 
            results={data?.results} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      </main>
    </div>
  );
}

export default Search;

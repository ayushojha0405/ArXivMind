import React from 'react';
import PaperCard from './PaperCard';

const ResultsList = ({ results, isLoading, error }) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loader"></div>
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Searching across millions of papers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No results found</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search query or using different keywords.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '32px' }}>
      <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
        Found {results.length} relevant papers
      </p>
      <div>
        {results.map((paper) => (
          <PaperCard 
            key={paper.paper_id} 
            paper={paper} 
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;

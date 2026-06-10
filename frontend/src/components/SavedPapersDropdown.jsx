import React, { useState, useEffect } from 'react';
import { getSavedPapers } from '../services/api';
import { Bookmark } from 'lucide-react';

function SavedPapersDropdown({ onSelect, disabled, placeholder = "Select a saved paper..." }) {
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await getSavedPapers();
          setPapers(data);
        }
      } catch (err) {
        console.error("Failed to load saved papers", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPapers();
  }, []);

  if (isLoading) {
    return (
      <select className="search-input" disabled style={{ padding: '10px 14px', borderRadius: '8px', opacity: 0.7, width: '100%' }}>
        <option>Loading saved papers...</option>
      </select>
    );
  }

  if (papers.length === 0) {
    return null; // Don't show dropdown if they have no saved papers
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }}>
        <Bookmark size={16} />
      </div>
      <select 
        className="search-input" 
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        defaultValue=""
        style={{ 
          padding: '10px 14px 10px 36px', 
          borderRadius: '8px', 
          width: '100%',
          cursor: 'pointer',
          appearance: 'none',
          background: 'rgba(30, 41, 59, 0.8) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E") no-repeat right 12px center'
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {papers.map((paper, idx) => (
          <option key={idx} value={paper.paper_id}>
            {paper.title || paper.paper_id}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SavedPapersDropdown;

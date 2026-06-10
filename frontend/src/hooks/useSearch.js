import { useState, useCallback } from 'react';
import { searchPapers } from '../services/api';

export const useSearch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeSearch = useCallback(async (query) => {
    if (!query) return;
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchPapers(query);
      setData(results);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during search.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, executeSearch };
};

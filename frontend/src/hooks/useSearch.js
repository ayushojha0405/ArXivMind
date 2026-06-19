import { useState, useCallback, useRef } from 'react';
import { searchPapers } from '../services/api';

const CACHE_TTL_MS = 5 * 60 * 1000;
const searchCache = new Map();

export const useSearch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const executeSearch = useCallback(async (query) => {
    const trimmed = query?.trim();
    if (!trimmed) return;

    const cacheKey = trimmed.toLowerCase();
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setData(cached.data);
      setError(null);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const results = await searchPapers(trimmed, 10, controller.signal);
      searchCache.set(cacheKey, { data: results, timestamp: Date.now() });
      setData(results);
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return;
      }
      const message =
        err.code === 'ECONNABORTED'
          ? 'Search timed out. The server may be waking up — please try again.'
          : err.response?.data?.detail || err.message || 'An error occurred during search.';
      setError(message);
    } finally {
      if (abortRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, []);

  return { data, isLoading, error, executeSearch };
};

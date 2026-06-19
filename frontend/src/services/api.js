import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const aiApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000,
});

const attachAuthInterceptor = (client) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
      return Promise.reject(error);
    }
  );
};

attachAuthInterceptor(api);
attachAuthInterceptor(aiApi);

export const warmupBackend = async () => {
  try {
    await api.get('/health', { timeout: 20000 });
  } catch {
    // Non-blocking: backend may still be waking from cold start
  }
};

export const searchPapers = async (query, topK = 10, signal = null) => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/search/', {
    params: { q: query, top_k: topK },
    headers,
    signal,
  });
  return response.data;
};

export const getPaperDetails = async (paperId) => {
  const response = await api.get(`/paper/${paperId}`);
  return response.data;
};

export const getAllPapers = async () => {
  const response = await api.get('/paper/all');
  return response.data;
};

export const askQuestion = async (question, contextPaperId = null) => {
  const payload = { question };
  if (contextPaperId) {
    payload.context_paper_id = contextPaperId;
  }
  const response = await aiApi.post('/qa/', payload);
  return response.data;
};

export const summarizePaper = async (paperId) => {
  const response = await aiApi.post('/summarize/', { paper_id: paperId });
  return response.data;
};

export const comparePapers = async (paperIdA, paperIdB) => {
  const response = await aiApi.post('/compare/', { paper_a_id: paperIdA, paper_b_id: paperIdB });
  return response.data;
};


export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const getCategoryTrends = async () => {
  const response = await api.get('/analytics/categories');
  return response.data;
};

export const getPublicationTrends = async () => {
  const response = await api.get('/analytics/publications');
  return response.data;
};

export const getCollections = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/collections/collections', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getSavedPapers = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/collections/saved', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAuthorMetrics = async () => {
  const response = await api.get('/analytics/advanced/authors');
  return response.data;
};

export const getCitationNetwork = async () => {
  const response = await api.get('/analytics/advanced/network');
  return response.data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getSearchHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/collections/history', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createCollection = async (name) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/collections/collections', { name }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const savePaperToWorkspace = async (paperId, title, collectionId = null) => {
  const token = localStorage.getItem('token');
  const payload = { paper_id: paperId, title, collection_id: collectionId };
  const response = await api.post('/collections/saved', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteCollection = async (collectionId) => {
  const token = localStorage.getItem('token');
  const response = await api.delete(`/collections/collections/${collectionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const removeSavedPaper = async (paperId) => {
  const token = localStorage.getItem('token');
  const response = await api.delete(`/collections/saved/${paperId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const clearSearchHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await api.delete('/collections/history', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

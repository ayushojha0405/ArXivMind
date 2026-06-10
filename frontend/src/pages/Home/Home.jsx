import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import ResultsList from '../../components/ResultsList';
import { useSearch } from '../../hooks/useSearch';
import { MessageSquare, GitCompare, FileText, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Try to get query from URL first, then fallback to sessionStorage
  const urlQuery = searchParams.get('q');
  const [initialQuery, setInitialQuery] = useState(urlQuery || sessionStorage.getItem('lastSearchQuery') || '');
  
  const { data, isLoading, error, executeSearch } = useSearch();

  // Keep URL in sync with the state if we loaded from sessionStorage
  useEffect(() => {
    if (initialQuery && !urlQuery) {
      setSearchParams({ q: initialQuery }, { replace: true });
    }
  }, [initialQuery, urlQuery, setSearchParams]);

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery, executeSearch]);

  const handleSearch = (query) => {
    setInitialQuery(query);
    sessionStorage.setItem('lastSearchQuery', query);
    setSearchParams({ q: query }, { replace: true });
  };

  const handleClearSearch = () => {
    setInitialQuery('');
    sessionStorage.removeItem('lastSearchQuery');
    setSearchParams({}, { replace: true });
  };

  const FeatureCard = ({ icon: Icon, title, desc, to }) => (
    <Link to={to} title={`Go to ${title}`} className="glass-panel animate-slide-up" style={{ height: '100%', padding: '24px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s' }}>
      <div style={{ background: 'rgba(229, 183, 65, 0.15)', padding: '16px', borderRadius: '50%', marginBottom: '16px', color: '#af7c15', border: '1px solid rgba(229, 183, 65, 0.3)', transition: 'transform 0.3s ease' }}>
        <Icon size={28} />
      </div>
      <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>{desc}</p>
    </Link>
  );

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 80px)' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: initialQuery ? 'flex-start' : 'center', textAlign: 'center', padding: initialQuery ? '24px 0 80px' : '40px 0 80px', transition: 'all 0.3s ease' }}>
        
        <div className="animate-fade-in" style={{ maxWidth: '800px', width: '100%', marginBottom: initialQuery ? '40px' : '0' }}>
          {!initialQuery && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(255, 241, 168, 0.15)', color: '#e5b741', borderRadius: '30px', fontSize: '14px', fontWeight: '600', marginBottom: '32px', border: '1px solid rgba(255, 241, 168, 0.3)', boxShadow: '0 0 15px rgba(255, 241, 168, 0.2)' }}>
                <Sparkles size={16} /> ArXivMind AI Search Engine
              </div>
              
              <h1 style={{ fontSize: '72px', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.03em' }}>
                Discover Research with <br/><span className="gradient-text">Semantic AI</span>
              </h1>
              
              <p style={{ fontSize: '20px', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.6' }}>
                Navigate millions of computer science papers using natural language, RAG-powered Q&A, and interactive trend analysis.
              </p>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
            {initialQuery && (
              <button onClick={handleClearSearch} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '12px' }} title="Back to Home">
                <ArrowLeft size={24} />
              </button>
            )}
            <div style={{ flex: 1 }}>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} initialValue={initialQuery} />
            </div>
          </div>
          
          {!initialQuery && (
            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <span>Trending searches:</span>
              <button onClick={() => handleSearch('Transformers in NLP')} style={{ background: 'none', border: 'none', color: 'var(--accent-hover)', cursor: 'pointer', textDecoration: 'underline' }}>Transformers</button>
              <button onClick={() => handleSearch('Diffusion Models')} style={{ background: 'none', border: 'none', color: 'var(--accent-hover)', cursor: 'pointer', textDecoration: 'underline' }}>Diffusion Models</button>
              <button onClick={() => handleSearch('LLM alignment')} style={{ background: 'none', border: 'none', color: 'var(--accent-hover)', cursor: 'pointer', textDecoration: 'underline' }}>LLM alignment</button>
              <button onClick={() => handleSearch('Quantum Machine Learning')} style={{ background: 'none', border: 'none', color: 'var(--accent-hover)', cursor: 'pointer', textDecoration: 'underline' }}>Quantum ML</button>
              <button onClick={() => handleSearch('RAG Architectures')} style={{ background: 'none', border: 'none', color: 'var(--accent-hover)', cursor: 'pointer', textDecoration: 'underline' }}>RAG Architectures</button>
            </div>
          )}
        </div>

        {initialQuery ? (
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1000px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Search Results</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Showing results for "{initialQuery}"
            </p>
            <ResultsList results={data?.results} isLoading={isLoading} error={error} />
          </div>
        ) : (
          <div className="animate-fade-in" style={{ marginTop: '80px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="delay-100" style={{ height: '100%' }}>
              <FeatureCard icon={MessageSquare} title="AI Chat & QA" desc="Ask questions and get instant answers powered by RAG technology." to="/chat" />
            </div>
            <div className="delay-200" style={{ height: '100%' }}>
              <FeatureCard icon={GitCompare} title="Paper Comparison" desc="Compare methodologies and results across multiple papers." to="/compare" />
            </div>
            <div className="delay-300" style={{ height: '100%' }}>
              <FeatureCard icon={TrendingUp} title="Trend Analysis" desc="Discover emerging topics and author networks over time." to="/trends" />
            </div>
            <div className="delay-400" style={{ height: '100%' }}>
              <FeatureCard icon={FileText} title="Smart Summaries" desc="Get the gist of 50-page PDFs in seconds." to="/summarizer" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;

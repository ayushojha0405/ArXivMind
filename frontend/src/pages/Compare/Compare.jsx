import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { comparePapers } from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageLayout from '../../components/layout/PageLayout';
import SavedPapersDropdown from '../../components/SavedPapersDropdown';

function Compare() {
  const [searchParams] = useSearchParams();
  const [paperA, setPaperA] = useState(searchParams.get('paper_a') || '');
  const [paperB, setPaperB] = useState(searchParams.get('paper_b') || '');

  const [comparison, setComparison] = useState('');
  const [titleA, setTitleA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    e?.preventDefault();
    if (!paperA.trim() || !paperB.trim() || isLoading) return;

    const arXivRegex = /^([a-z\-]+(\.[A-Z]{2})?\/\d{7}(v\d+)?|\d{4}\.\d{4,5}(v\d+)?)$/i;
    if (!arXivRegex.test(paperA.trim()) || !arXivRegex.test(paperB.trim())) {
      setError('Invalid ArXiv ID format. Please use a valid format (e.g., 2305.14314 or cs.AI/0101001).');
      return;
    }

    setIsLoading(true);
    setError('');
    setComparison('');

    try {
      const result = await comparePapers(paperA.trim(), paperB.trim());
      setComparison(result.comparison);
      setTitleA(result.title_a);
      setTitleB(result.title_b);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to compare papers.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Compare Research Papers"
      subtitle="Compare methodologies and results across multiple papers"
    >
      <div className="glass-panel page-card page-card--padded animate-fade-in">
        <div style={{ background: 'rgba(229, 183, 65, 0.1)', border: '1px solid rgba(229, 183, 65, 0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#af7c15' }}>
          <span style={{ fontSize: '18px' }}>💡</span>
          <strong>Tip:</strong> You can select papers to compare directly from Search results by clicking &quot;Compare&quot; to add them to your tray!
        </div>

        <form onSubmit={handleCompare} style={{ display: 'flex', gap: '20px', marginBottom: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              value={paperA}
              onChange={(e) => setPaperA(e.target.value)}
              placeholder="Paper ID (A)"
              className="search-input"
              disabled={isLoading}
            />
            <SavedPapersDropdown onSelect={setPaperA} disabled={isLoading} placeholder="Or select Paper A from saved..." />
          </div>
          <div style={{ fontWeight: '600', color: 'var(--text-secondary)', marginTop: '12px' }}>VS</div>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              value={paperB}
              onChange={(e) => setPaperB(e.target.value)}
              placeholder="Paper ID (B)"
              className="search-input"
              disabled={isLoading}
            />
            <SavedPapersDropdown onSelect={setPaperB} disabled={isLoading} placeholder="Or select Paper B from saved..." />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading || !paperA.trim() || !paperB.trim()}>
            {isLoading ? 'Comparing...' : 'Compare'}
          </button>
        </form>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading-container">
            <div className="loader" />
            <p className="loading-text">Analyzing methodology and results...</p>
          </div>
        )}

        {comparison && !isLoading && (
          <div className="animate-fade-in summary-container">
            <div className="page-grid-2" style={{ marginBottom: '24px' }}>
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)' }}>
                <h4 style={{ color: 'var(--accent-hover)', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase' }}>Paper A</h4>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{titleA}</p>
              </div>
              <div className="glass-panel" style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.05)' }}>
                <h4 style={{ color: '#c084fc', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase' }}>Paper B</h4>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{titleB}</p>
              </div>
            </div>

            <div className="markdown-content summary-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {comparison}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Compare;

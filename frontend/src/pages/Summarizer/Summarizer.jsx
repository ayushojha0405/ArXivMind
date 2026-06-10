import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { summarizePaper } from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageLayout from '../../components/layout/PageLayout';
import SavedPapersDropdown from '../../components/SavedPapersDropdown';

function Summarizer() {
  const [searchParams] = useSearchParams();
  const initialPaperId = searchParams.get('paper_id') || '';

  const [paperId, setPaperId] = useState(initialPaperId);
  const [summary, setSummary] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async (e) => {
    e?.preventDefault();
    if (!paperId.trim() || isLoading) return;

    const arXivRegex = /^([a-z\-]+(\.[A-Z]{2})?\/\d{7}(v\d+)?|\d{4}\.\d{4,5}(v\d+)?)$/i;
    if (!arXivRegex.test(paperId.trim())) {
      setError('Invalid ArXiv ID format. Please use a valid format (e.g., 2305.14314 or cs.AI/0101001).');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');
    setTitle('');

    try {
      const result = await summarizePaper(paperId.trim());
      setSummary(result.summary);
      setTitle(result.title);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to generate summary.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Research Paper Summarizer"
      subtitle="Get the gist of 50-page PDFs in seconds"
    >
      <div className="glass-panel page-card page-card--padded animate-fade-in">
        <form onSubmit={handleSummarize} style={{ display: 'flex', gap: '12px', marginBottom: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              value={paperId}
              onChange={(e) => setPaperId(e.target.value)}
              placeholder="Enter Paper ID (e.g., 2305.14314)"
              className="search-input"
              disabled={isLoading}
            />
            <SavedPapersDropdown onSelect={setPaperId} disabled={isLoading} placeholder="Or select a paper from your saved items..." />
          </div>
          <button type="submit" className="btn-primary summarizer-submit" disabled={isLoading || !paperId.trim()}>
            {isLoading ? 'Summarizing...' : 'Summarize'}
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
            <p className="loading-text">Reading and synthesizing paper...</p>
          </div>
        )}

        {summary && !isLoading && (
          <div className="animate-fade-in summary-container">
            <h3 className="summary-title">{title}</h3>
            <div className="markdown-content summary-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Summarizer;

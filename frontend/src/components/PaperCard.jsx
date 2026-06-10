import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, GitCompare, MessageSquare, Plus, Check, Bookmark } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { savePaperToWorkspace } from '../services/api';

const PaperCard = ({ paper }) => {
  const { compareList, addToCompare, removeFromCompare } = useCompare();
  const [isSaved, setIsSaved] = useState(false);
  
  const isSelected = compareList.some(p => p.paper_id === paper.paper_id);

  const toggleCompare = (e) => {
    e.preventDefault();
    if (isSelected) {
      removeFromCompare(paper.paper_id);
    } else {
      addToCompare(paper);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await savePaperToWorkspace(paper.paper_id, paper.title || `Paper ${paper.paper_id}`);
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save paper");
    }
  };

  const getScoreStyle = (score) => {
    const percent = score * 100;
    if (percent >= 80) return { background: 'rgba(255, 241, 168, 0.15)', color: '#e5b741', border: '1px solid rgba(255, 241, 168, 0.3)' };
    if (percent >= 60) return { background: 'rgba(229, 183, 65, 0.15)', color: '#af7c15', border: '1px solid rgba(229, 183, 65, 0.3)' };
    return { background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.3)' };
  };

  const renderCategories = (catStr) => {
    if (!catStr) return null;
    return catStr.split(' ').map((cat, i) => (
      <span key={i} style={{ 
        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '500',
        background: 'rgba(229, 183, 65, 0.1)', color: '#af7c15', border: '1px solid rgba(229, 183, 65, 0.2)'
      }}>
        {cat}
      </span>
    ));
  };

  return (
    <div className="glass-panel paper-card animate-fade-in" style={{ position: 'relative', paddingBottom: '70px', borderColor: isSelected ? 'var(--accent-hover)' : 'var(--glass-border)', boxShadow: isSelected ? '0 0 20px var(--accent-glow)' : 'var(--glass-shadow)' }}>
      <div className="paper-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ 
            padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
            ...getScoreStyle(paper.score)
          }}>
            Match: {(paper.score * 100).toFixed(1)}%
          </span>
          {renderCategories(paper.categories)}
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{paper.update_date}</span>
        </div>
        <button 
          onClick={handleSave} 
          title="Save to Workspace" 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? '#e5b741' : 'var(--text-secondary)' }}
        >
          <Bookmark size={20} fill={isSaved ? '#e5b741' : 'none'} />
        </button>
      </div>
      <h3 style={{ marginBottom: '12px', fontSize: '20px', color: 'var(--text-primary)', marginTop: '12px' }}>
        Paper: {paper.paper_id}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
        {paper.preview}...
      </p>
      
      {/* Action Buttons */}
      <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', display: 'flex', gap: '8px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
        <button 
          onClick={toggleCompare} 
          className={isSelected ? "btn-secondary" : "btn-primary"} 
          style={{ 
            padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', border: 'none',
            background: isSelected ? 'rgba(255, 241, 168, 0.15)' : 'var(--accent)', 
            color: isSelected ? '#e5b741' : 'white',
            flex: 1, justifyContent: 'center', borderRadius: '8px'
          }} 
          title="Add to Compare Tray"
        >
          {isSelected ? <><Check size={14} /> Added</> : <><Plus size={14} /> Compare</>}
        </button>
        
        <Link to={`/summarizer?paper_id=${paper.paper_id}`} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', textDecoration: 'none', border: '1px solid var(--accent-hover)' }} title="Auto-Summarize this paper">
          <FileText size={14} /> Summarize
        </Link>
        <Link to={`/chat?paper_id=${paper.paper_id}`} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px', textDecoration: 'none', border: '1px solid var(--accent-hover)' }} title="Chat with this paper">
          <MessageSquare size={14} /> Chat
        </Link>
      </div>
    </div>
  );
};

export default PaperCard;

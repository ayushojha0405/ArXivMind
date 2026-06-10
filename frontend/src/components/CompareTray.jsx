import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { GitCompare, X, Trash2 } from 'lucide-react';

const CompareTray = () => {
  const { compareList, removeFromCompare, clearCompare, error } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0 && !error) return null;

  const handleCompareNow = () => {
    if (compareList.length === 2) {
      navigate(`/compare?paper_a=${compareList[0].paper_id}&paper_b=${compareList[1].paper_id}`);
      clearCompare();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: '90%',
      maxWidth: '600px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {error && (
        <div style={{ background: '#ef4444', color: 'white', padding: '12px 24px', borderRadius: '12px', marginBottom: '12px', textAlign: 'center', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)', fontWeight: '500' }}>
          {error}
        </div>
      )}
      
      {compareList.length > 0 && (
        <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--card-bg)', border: '1px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <GitCompare size={18} color="var(--accent-hover)" /> 
              Compare Tray ({compareList.length}/2)
            </h4>
            <button onClick={clearCompare} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
              <Trash2 size={14} /> Clear
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            {[0, 1].map(index => {
              const paper = compareList[index];
              return (
                <div key={index} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', position: 'relative', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  {paper ? (
                    <>
                      <div style={{ fontSize: '12px', color: 'var(--accent-hover)', marginBottom: '4px' }}>{paper.paper_id}</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{paper.title || `Paper ${paper.paper_id}`}</div>
                      <button 
                        onClick={() => removeFromCompare(paper.paper_id)}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic' }}>
                      Add another paper...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={handleCompareNow} 
            disabled={compareList.length !== 2}
            className="btn-primary" 
            style={{ width: '100%', opacity: compareList.length === 2 ? 1 : 0.5, padding: '14px' }}
          >
            {compareList.length === 2 ? 'Compare Now' : 'Select 2 papers to compare'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CompareTray;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCollections, getSavedPapers, getSearchHistory, createCollection, deleteCollection, removeSavedPaper, clearSearchHistory } from '../../services/api';
import { Trash2, Bookmark, FolderOpen, History, Plus, LogOut, ChevronRight, Clock } from 'lucide-react';

function Workspace() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(true);
  const [collections, setCollections] = useState([]);
  const [savedPapers, setSavedPapers] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const cols = await getCollections();
      const papers = await getSavedPapers();
      const history = await getSearchHistory();
      setCollections(cols);
      setSavedPapers(papers);
      setSearchHistory(history);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuth(false);
      navigate('/login');
      return;
    }
    const profile = parseJwt(token);
    if (profile) setUserProfile(profile);
    fetchData();
  }, [navigate]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    try {
      const newCol = await createCollection(newCollectionName);
      setCollections([...collections, newCol]);
      setNewCollectionName('');
    } catch (err) {
      console.error("Failed to create collection");
    }
  };

  const handleDeleteCollection = async (id) => {
    try {
      await deleteCollection(id);
      setCollections(collections.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete collection");
    }
  };

  const handleRemoveSavedPaper = async (paperId) => {
    try {
      await removeSavedPaper(paperId);
      setSavedPapers(savedPapers.filter(p => p.paper_id !== paperId));
    } catch (err) {
      console.error("Failed to remove saved paper");
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearSearchHistory();
      setSearchHistory([]);
    } catch (err) {
      console.error("Failed to clear history");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!isAuth) return null;

  return (
    <div className="container" style={{ paddingBottom: '60px', maxWidth: '90%' }}>
      <div style={{ padding: '40px 0' }}>
        <div className="animate-fade-in">

          {/* Premium User Profile Banner */}
          <div className="glass-panel" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '40px', 
            padding: '24px 32px',
            background: 'linear-gradient(135deg, rgba(4, 75, 112, 0.6) 0%, rgba(0, 10, 20, 0.8) 100%)',
            borderLeft: '4px solid var(--accent)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, rgba(255, 174, 0, 0.2), rgba(255, 174, 0, 0.05))', 
                boxShadow: '0 0 20px rgba(255, 174, 0, 0.3)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: 'var(--accent)', fontWeight: 'bold', fontSize: '28px',
                border: '1px solid rgba(255, 174, 0, 0.3)'
              }}>
                {userProfile?.sub ? userProfile.sub.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '28px', margin: '0 0 4px 0', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                  {userProfile?.sub || 'User'}
                </h2>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#00e676', borderRadius: '50%', boxShadow: '0 0 10px #00e676' }}></span>
                  Active Research Scholar
                </div>
              </div>
            </div>
            <button onClick={handleLogout} style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', 
              color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', 
              cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500'
            }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* 40/60 Split Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '40fr 60fr', gap: '32px', height: 'calc(100vh - 250px)', minHeight: '600px' }}>

            {/* Left Column: Saved Papers & Collections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', minHeight: 0 }}>

              {/* Saved Papers Panel */}
              <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexShrink: 0 }}>
                  <Bookmark size={24} color="var(--accent)" />
                  <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px', letterSpacing: '0.5px' }}>Saved Papers</h3>
                </div>
                
                {savedPapers.length > 0 ? (
                  <ul style={{ listStyle: 'none', margin: 0, padding: '0 8px 0 0', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
                    {savedPapers.map((paper, idx) => (
                      <li key={idx} style={{ flexShrink: 0 }}>
                        <Link to={`/search?q=${paper.paper_id}`} style={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          background: 'rgba(0, 10, 20, 0.4)', padding: '16px 20px', borderRadius: '12px', 
                          border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', transition: 'all 0.2s'
                        }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-hover)'; e.currentTarget.style.background = 'rgba(0, 195, 255, 0.05)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(0, 10, 20, 0.4)'; }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '16px' }}>
                            {paper.title || paper.paper_id}
                          </span>
                          <button onClick={(e) => { e.preventDefault(); handleRemoveSavedPaper(paper.paper_id); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }} title="Remove Paper">
                            <Trash2 size={18} />
                          </button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'center' }}>
                    <Bookmark size={48} color="rgba(255,255,255,0.1)" />
                    <p>You haven't saved any papers yet.</p>
                  </div>
                )}
              </div>

              {/* My Collections Panel */}
              <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexShrink: 0 }}>
                  <FolderOpen size={24} color="var(--accent)" />
                  <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px', letterSpacing: '0.5px' }}>My Collections</h3>
                </div>

                {/* Seamless Input Group */}
                <form onSubmit={handleCreateCollection} style={{ display: 'flex', marginBottom: '24px', position: 'relative', flexShrink: 0 }}>
                  <input
                    type="text"
                    placeholder="New collection name..."
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    style={{ 
                      flex: 1, padding: '14px 24px', paddingRight: '120px', borderRadius: '50px',
                      border: '1px solid var(--glass-border)', background: 'rgba(0, 10, 20, 0.6)', 
                      color: 'var(--text-primary)', fontSize: '15px', outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ 
                    position: 'absolute', right: '4px', top: '4px', bottom: '4px',
                    borderRadius: '50px', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <Plus size={18} /> Create
                  </button>
                </form>

                {collections.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', overflowY: 'auto', paddingRight: '8px', flex: 1, alignContent: 'start', minHeight: 0 }}>
                    {collections.map((col, idx) => (
                      <div key={idx} style={{ 
                        background: 'rgba(0, 10, 20, 0.4)', padding: '20px', borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', 
                        alignItems: 'flex-start', transition: 'all 0.2s'
                      }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FolderOpen size={16} color="var(--accent)" /> {col.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(col.created_at).toLocaleDateString()}</div>
                        </div>
                        <button onClick={() => handleDeleteCollection(col.id)} style={{ background: 'rgba(255,0,0,0.1)', border: 'none', color: '#ff4444', borderRadius: '8px', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Collection">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'center' }}>
                    <FolderOpen size={48} color="rgba(255,255,255,0.1)" />
                    <p>No collections created yet.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Search History */}
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <History size={24} color="var(--accent)" />
                  <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '20px', letterSpacing: '0.5px' }}>Search History</h3>
                </div>
                {searchHistory.length > 0 && (
                  <button onClick={handleClearHistory} style={{ 
                    background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: '8px', 
                    padding: '8px 16px', color: '#ff6b6b', cursor: 'pointer', fontSize: '13px', 
                    display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', transition: 'all 0.2s'
                  }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,0,0,0.2)'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,0,0,0.1)'; e.currentTarget.style.color = '#ff6b6b'; }}>
                    <Trash2 size={14} /> Clear All
                  </button>
                )}
              </div>
              
              {searchHistory.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: '0 8px 0 0', margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
                  {searchHistory.map((hist, idx) => (
                    <li key={idx} style={{ flexShrink: 0 }}>
                      <Link to={`/search?q=${encodeURIComponent(hist.query)}`} style={{ 
                        color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '20px 24px', background: 'rgba(0, 10, 20, 0.4)', borderRadius: '16px', 
                        border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-hover)'; e.currentTarget.style.background = 'rgba(0, 195, 255, 0.05)'; e.currentTarget.style.transform = 'translateX(5px)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(0, 10, 20, 0.4)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '16px', color: '#fff' }}>{hist.query}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={12} /> {new Date(hist.searched_at).toLocaleString()}
                          </div>
                        </div>
                        <div style={{ color: 'var(--accent)', opacity: 0.7 }}>
                          <ChevronRight size={24} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'center' }}>
                  <History size={64} color="rgba(255,255,255,0.05)" />
                  <p style={{ fontSize: '18px' }}>Your recent searches will appear here.</p>
                  <p style={{ fontSize: '14px', maxWidth: '300px', margin: '0 auto', opacity: 0.6 }}>Start exploring the ArXiv corpus using the search bar above.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MessageSquare, 
  FileText, 
  GitCompare, 
  TrendingUp, 
  BarChart2, 
  User, 
  LogOut 
} from 'lucide-react';

import { getCurrentUser } from '../../services/api';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth status on route change
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (token) {
      getCurrentUser().then(setUser).catch(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      });
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        title={label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: isActive ? '#fff' : 'var(--text-secondary)',
          background: isActive ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.2s',
          fontWeight: isActive ? '600' : '500'
        }}
      >
        <Icon size={18} style={{ color: isActive ? '#fbbf24' : 'inherit' }} />
        <span style={{ display: 'none' }} className="nav-label">{label}</span>
      </Link>
    );
  };

  return (
    <header className="global-navbar glass-panel">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px', padding: '0 24px' }}>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #fbbf24, #fb7185)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: '12px', fontWeight: 'bold', color: 'white'
          }}>
            A
          </div>
          <span className="logo" style={{ margin: 0 }}>ArXiv<span className="gradient-text">Mind</span></span>
        </Link>

        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="nav-links">
          <NavItem to="/" icon={Search} label="Search" />
          <NavItem to="/chat" icon={MessageSquare} label="RAG Chat" />
          <NavItem to="/summarizer" icon={FileText} label="Summarizer" />
          <NavItem to="/compare" icon={GitCompare} label="Compare" />
          
          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 8px' }}></div>
          
          <NavItem to="/trends" icon={TrendingUp} label="Trends" />
          <NavItem to="/advanced-analytics" icon={BarChart2} label="Deep Insights" />
          
          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 8px' }}></div>

          {isAuthenticated ? (
            <>
              <Link 
                to="/workspace"
                title="Workspace"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px',
                  background: location.pathname === '/workspace' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '20px', fontSize: '14px',
                  color: location.pathname === '/workspace' ? '#fbbf24' : 'var(--text-primary)', 
                  border: '1px solid',
                  borderColor: location.pathname === '/workspace' ? 'rgba(251, 191, 36, 0.3)' : 'var(--glass-border)',
                  marginLeft: '8px', transition: 'all 0.2s', fontWeight: '500', textDecoration: 'none'
                }}
              >
                <User size={16} style={{ color: location.pathname === '/workspace' ? '#fbbf24' : 'var(--accent)' }} />
                <span>{user ? user.username : 'Workspace'}</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                title="Logout"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.1)',
                  color: '#ff6b6b', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                  transition: 'all 0.2s', marginLeft: '4px'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,0,0,0.15)'; e.currentTarget.style.color = '#fff'; }} 
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,0,0,0.05)'; e.currentTarget.style.color = '#ff6b6b'; }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px', marginLeft: '8px' }}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      <footer style={{ padding: '32px 24px 24px 24px', borderTop: '1px solid var(--glass-border)', marginTop: 'auto', background: 'var(--glass-bg)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>ArXivMind</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', maxWidth: '80%' }}>
              Discover research with semantic AI. Navigate millions of computer science papers using natural language, RAG-powered Q&A, and interactive trend analysis.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>About Us</Link></li>
              <li><Link to="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Features Overview</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tools</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><Link to="/summarizer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>AI Summarizer</Link></li>
              <li><Link to="/compare" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Paper Comparison</Link></li>
              <li><Link to="/chat" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>Chat with Sage</Link></li>
              <li><Link to="/workspace" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>My Workspace</Link></li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
            © 2026 ArXivMind. Made with <span style={{ color: 'var(--accent)' }}>💛</span> by Ayush Ranjan Ojha
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

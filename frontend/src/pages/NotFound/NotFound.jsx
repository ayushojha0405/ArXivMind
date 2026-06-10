import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container animate-fade-in" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative' }}>
        <h1 style={{ fontSize: '120px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, var(--accent-color) 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.1, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Lost in the Papers?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 32px' }}>
          The page you are looking for does not exist or has been moved. Let's get you back to your research.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

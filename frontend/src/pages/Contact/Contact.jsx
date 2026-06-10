import React, { useState } from 'react';

function Contact() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thanks for reaching out! A wizard will respond to your owl shortly.');
  };

  return (
    <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
      <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="gradient-text" style={{ fontSize: '48px', marginBottom: '24px', textAlign: 'center' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.8', marginBottom: '40px', textAlign: 'center' }}>
          Have questions, feedback, or feature requests? We'd love to hear from you.
        </p>
        
        <div className="glass-panel" style={{ padding: '40px' }}>
          {status ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--accent-hover)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦉</div>
              <h3>{status}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-primary)', fontSize: '14px' }}>Name</label>
                <input required type="text" className="search-input" style={{ width: '100%', borderRadius: '8px', background: 'rgba(0, 10, 20, 0.6)' }} placeholder="Your name" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-primary)', fontSize: '14px' }}>Email</label>
                <input required type="email" className="search-input" style={{ width: '100%', borderRadius: '8px', background: 'rgba(0, 10, 20, 0.6)' }} placeholder="your.email@example.com" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-primary)', fontSize: '14px' }}>Message</label>
                <textarea required rows={5} className="search-input" style={{ width: '100%', borderRadius: '8px', background: 'rgba(0, 10, 20, 0.6)', resize: 'vertical' }} placeholder="How can we help?" />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '48px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--accent)', fontSize: '24px', marginBottom: '8px' }}>📧</div>
            <div style={{ color: 'var(--text-secondary)' }}>support@arxivmind.com</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--accent)', fontSize: '24px', marginBottom: '8px' }}>💬</div>
            <div style={{ color: 'var(--text-secondary)' }}>@ArXivMind</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

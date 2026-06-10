import React from 'react';

function Features() {
  return (
    <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
      <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="gradient-text" style={{ fontSize: '48px', marginBottom: '24px', textAlign: 'center' }}>Platform Features</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.8', marginBottom: '48px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}>
          Explore the powerful tools we provide to help you navigate, analyze, and understand the vast ocean of academic research.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 174, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-hover)', fontSize: '24px' }}>✨</div>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Semantic Search</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Forget rigid keyword matching. Ask questions naturally like "What are the latest advancements in LLM alignment?" Our semantic engine embeds your query and retrieves contextually relevant papers instantly.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 174, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-hover)', fontSize: '24px' }}>🧙‍♂️</div>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Chat with Sage</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Interact directly with Sage, your AI research mentor. Pin a specific paper to your context and ask Sage to explain methodologies, summarize findings, or critique conclusions.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 174, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-hover)', fontSize: '24px' }}>⚖️</div>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Paper Comparison</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Queue multiple papers into the Comparison Tray and generate side-by-side matrices. Compare methodologies, datasets used, and key contributions automatically extracted by our AI pipeline.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 174, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-hover)', fontSize: '24px' }}>📈</div>
              <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Research Trends</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Visualize the publication velocity of different categories in real-time. Identify emerging sub-fields and dominant domains like computer vision or natural language processing through beautiful interactive charts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;

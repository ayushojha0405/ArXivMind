import React from 'react';

function About() {
  return (
    <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
      <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="gradient-text" style={{ fontSize: '48px', marginBottom: '24px', textAlign: 'center' }}>About ArXivMind</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.8', marginBottom: '32px', textAlign: 'center' }}>
          ArXivMind is a next-generation academic research platform designed to bridge the gap between complex computer science literature and human understanding.
        </p>
        
        <div className="glass-panel" style={{ padding: '40px', marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '24px' }}>
            The pace of AI and machine learning research is accelerating exponentially. Hundreds of papers are published daily on arXiv, making it nearly impossible for researchers, students, and enthusiasts to keep up. Our mission is to harness the power of Semantic AI and Large Language Models to make discovering, understanding, and comparing research papers effortless.
          </p>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>The Technology</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            Built entirely around the arXiv API, ArXivMind employs advanced embeddings and Retrieval-Augmented Generation (RAG). By embedding paper abstracts and metadata into vector space, we can perform highly accurate semantic searches, bypassing the limitations of traditional keyword matching. Our AI assistant, Sage, acts as your personal research mentor, capable of deeply analyzing context and answering complex questions about the literature.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { askQuestion } from '../../services/api';
import { Send, Wand2, User, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageLayout from '../../components/layout/PageLayout';

function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const contextPaperId = searchParams.get('paper_id');

  const initialMessage = { role: 'assistant', text: 'Greetings! I am Sage, your AI Wizard and research mentor. Ask me any question about the magical archives...' };
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleClearContext = () => {
    searchParams.delete('paper_id');
    setSearchParams(searchParams);
  };

  const handleClearChat = () => {
    setMessages([initialMessage]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const backendQuery = contextPaperId
      ? `Regarding paper ID ${contextPaperId}: ${input}`
      : input;

    setInput('');
    setIsLoading(true);

    try {
      const result = await askQuestion(backendQuery, contextPaperId);
      setMessages((prev) => [...prev, { role: 'assistant', text: result.answer, sources: result.sources }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: `Error: ${error.message || 'Something went wrong.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatAction = messages.length > 1 ? (
    <button
      type="button"
      onClick={handleClearChat}
      className="page-nav-btn"
      style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)', background: 'rgba(248, 113, 113, 0.1)' }}
    >
      <X size={14} />
      Clear Chat
    </button>
  ) : null;

  return (
    <PageLayout
      title="Chat with Sage"
      subtitle="Your personal AI research mentor"
      fullHeight
      actions={clearChatAction}
    >
      <div className="glass-panel page-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(20px, 3vw, 36px)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '16px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--accent)' : 'rgba(229, 183, 65, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: msg.role === 'user' ? 'white' : '#af7c15',
                boxShadow: msg.role === 'user' ? '0 0 15px var(--accent-glow)' : 'none',
              }}
              >
                {msg.role === 'user' ? <User size={20} /> : <Wand2 size={20} />}
              </div>

              <div className="markdown-content" style={{
                maxWidth: '75%',
                padding: '16px 20px',
                borderRadius: '20px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '20px',
                borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '20px',
                background: msg.role === 'user' ? 'var(--accent)' : 'rgba(22, 40, 50, 0.5)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                border: msg.role === 'assistant' ? '1px solid var(--glass-border)' : 'none',
                lineHeight: '1.6',
                fontSize: '15px',
              }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                    <strong>Sources:</strong> {msg.sources.map((s) => s.paper_id).join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(229, 183, 65, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#af7c15' }}>
                <Wand2 size={20} />
              </div>
              <div style={{ padding: '16px 24px', borderRadius: '20px', background: 'rgba(22, 40, 50, 0.5)', border: '1px solid var(--glass-border)' }}>
                <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px', margin: '0' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '20px clamp(20px, 3vw, 36px)', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--glass-border)' }}>
          {contextPaperId && (
            <div style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderRadius: '20px', fontSize: '13px' }}>
              <span>Context: Paper <strong>{contextPaperId}</strong></span>
              <button type="button" onClick={handleClearContext} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', padding: '2px' }} title="Clear Context">
                <X size={14} />
              </button>
            </div>
          )}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={contextPaperId ? `Ask Sage a question about Paper ${contextPaperId}...` : 'Ask about transformers, diffusion models, or specific paper IDs...'}
              className="search-input"
              style={{ flex: 1, paddingRight: '60px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.8)' }}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="search-btn"
              disabled={isLoading || !input.trim()}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: (!input.trim() || isLoading) ? 0.5 : 1 }}
            >
              <Send size={18} />
            </button>
          </form>
          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
            Sage can make mistakes. Verify important research claims.
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Chat;

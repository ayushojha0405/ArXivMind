import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuthorMetrics, getCitationNetwork } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageLayout from '../../components/layout/PageLayout';

function AdvancedAnalytics() {
  const { data: authors = [], isLoading: isLoadingAuthors } = useQuery({
    queryKey: ['authorMetrics'],
    queryFn: getAuthorMetrics,
  });

  const { data: network = { nodes: [], links: [] }, isLoading: isLoadingNetwork } = useQuery({
    queryKey: ['citationNetwork'],
    queryFn: getCitationNetwork,
  });

  const isLoading = isLoadingAuthors || isLoadingNetwork;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '12px 16px', background: 'rgba(15, 23, 42, 0.9)' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#f8fafc' }}>{label}</p>
          <p style={{ margin: '4px 0 0', color: payload[0].color }}>
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageLayout
      title="Deep Insights Dashboard"
      subtitle="Explore author impact and citation relationships"
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="loader" />
        </div>
      ) : (
        <div className="page-grid-2--stack">
          <div className="page-grid-2">
            <div className="glass-panel page-card page-card--padded" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Top Authors by Citations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
                This chart highlights the most influential researchers based on citation count within our database.
                Identifying top authors helps you discover foundational papers and track leading experts in the field.
              </p>
              <div style={{ height: '320px', width: '100%', marginTop: 'auto' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={authors} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAuthor" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fde047" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal vertical={false} />
                    <XAxis type="number" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
                    <YAxis dataKey="author" type="category" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={100} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="citations" name="Citations" fill="url(#colorAuthor)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel page-card page-card--padded" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Topic Citation Network</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
                Explore how different research topics intersect. Larger nodes represent highly-cited central concepts,
                while connections reveal cross-disciplinary collaboration and the flow of knowledge between domains.
              </p>
              <div style={{ height: '320px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginTop: 'auto' }}>
                <p style={{ zIndex: 10, color: 'var(--text-secondary)' }}>Interactive Graph Visualization Area</p>

                {network.nodes.map((node, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: `${node.radius * 2}px`,
                      height: `${node.radius * 2}px`,
                      background: node.group === 1 ? 'rgba(229, 183, 65, 0.5)' : node.group === 2 ? 'rgba(255, 241, 168, 0.5)' : 'rgba(148, 163, 184, 0.5)',
                      borderRadius: '50%',
                      top: `${Math.random() * 60 + 20}%`,
                      left: `${Math.random() * 60 + 20}%`,
                      boxShadow: '0 0 20px rgba(229, 183, 65, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    {node.id}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel page-card page-card--padded animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(229, 183, 65, 0.05) 0%, rgba(255, 241, 168, 0.05) 100%)', border: '1px solid rgba(229, 183, 65, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(229, 183, 65, 0.2)', padding: '8px', borderRadius: '8px', color: '#af7c15' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '22px', color: '#e2e8f0' }}>AI Executive Summary</h3>
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.7' }}>
              {authors.length > 0 ? (
                <>
                  Based on our deep analysis, <strong>{authors[0]?.author}</strong> is currently leading the citation impact with <strong>{authors[0]?.citations}</strong> citations. The interactive citation network reveals <strong>{network?.nodes?.length || 0}</strong> critical interconnected concept nodes, highlighting the highly collaborative and cross-disciplinary nature of this domain&apos;s research evolution.
                </>
              ) : (
                'Gathering insights from the archive...'
              )}
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default AdvancedAnalytics;

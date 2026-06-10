import React from 'react';
import BackNavigation from './BackNavigation';

function PageLayout({
  title,
  subtitle,
  backLabel = 'Back to Results',
  backTo,
  actions,
  children,
  fullHeight = false,
  className = '',
}) {
  return (
    <div
      className={`page-container animate-fade-in${fullHeight ? ' page-container--full-height' : ''}${className ? ` ${className}` : ''}`}
    >
      <header className="page-header">
        <div className="page-nav">
          <BackNavigation to={backTo} label={backLabel} />
          {actions ? <div className="page-actions">{actions}</div> : <div className="page-actions" />}
        </div>

        {(title || subtitle) && (
          <div className="page-title-block">
            {title && <h2 className="page-title">{title}</h2>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        )}
      </header>

      <main className={`page-content${fullHeight ? ' page-content--full-height' : ''}`}>
        {children}
      </main>
    </div>
  );
}

export default PageLayout;

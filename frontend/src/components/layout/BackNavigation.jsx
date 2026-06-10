import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

function BackNavigation({ to, label = 'Back to Results' }) {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    if (to === -1) {
      navigate(-1);
    } else if (to) {
      navigate(to);
    } else {
      const lastSearch = sessionStorage.getItem('lastSearch');
      if (lastSearch) {
        navigate(`/search?q=${encodeURIComponent(lastSearch)}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <nav className="page-back-nav" aria-label="Page navigation">
      <button type="button" onClick={handleBack} className="page-nav-btn">
        <ArrowLeft size={16} />
        {label}
      </button>

      <Link to="/" className="page-nav-btn page-nav-btn--link">
        <Home size={16} />
        Home
      </Link>
    </nav>
  );
}

export default BackNavigation;

import React, { createContext, useState, useContext } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
  return useContext(CompareContext);
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [error, setError] = useState(null);

  const addToCompare = (paper) => {
    if (compareList.find(p => p.paper_id === paper.paper_id)) {
      return;
    }
    if (compareList.length >= 2) {
      setError("You can only compare exactly 2 papers at a time.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setCompareList([...compareList, paper]);
  };

  const removeFromCompare = (paperId) => {
    setCompareList(compareList.filter(p => p.paper_id !== paperId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, error }}>
      {children}
    </CompareContext.Provider>
  );
};

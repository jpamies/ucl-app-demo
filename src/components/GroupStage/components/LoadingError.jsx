// src/components/GroupStage/components/LoadingError.jsx
import React from 'react';

function LoadingError({ isLoading, error }) {
  if (isLoading) {
    return <div className="loading">Loading matches...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return null;
}

export default LoadingError;

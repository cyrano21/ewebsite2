import React from 'react';

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <style jsx>{`
      .loading-spinner {
        border: 4px solid rgba(0,0,0,0.1);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border-left-color: #09f;
        animation: spin 1s linear infinite;
        margin: 20px auto;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;

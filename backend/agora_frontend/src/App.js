import React, { useState } from 'react';
import './App.css';
import PostsList from './components/PostsList';

function App() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="agora-header">
        <div className="agora-header-content">
          {!logoError ? (
            <img 
              src="https://www.yale.edu/sites/default/files/yale_wordmark_white_1.png" 
              alt="Yale University" 
              className="yale-logo"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="yale-logo-text">YALE</div>
          )}
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">Agora</h1>
        </div>
      </div>
      <div className="container mx-auto pl-12 pr-6 pb-8">
        <PostsList />
      </div>
    </div>
  );
}

export default App;

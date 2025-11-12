import React, { useState } from 'react';
import './App.css';
import PostsList from './components/PostsList';

function App() {
  const [feedType, setFeedType] = useState('new');

  return (
    <div className="App p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Agora — Posts</h1>
        <div>
          <label className="mr-2">Sort:</label>
          <select value={feedType} onChange={(e) => setFeedType(e.target.value)} className="border rounded p-1">
            <option value="new">New</option>
            <option value="all">All</option>
            <option value="top">Top</option>
          </select>
        </div>
      </div>

      <PostsList feedType={feedType} />
    </div>
  );
}

export default App;

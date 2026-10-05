import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import SocialPostsPage from './pages/SocialPostsPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Route matching
  if (currentPath === '/social-posts' || currentPath === '/social-posts/') {
    return <SocialPostsPage initialTab="preview" />;
  }
  if (currentPath.startsWith('/social-posts/templates')) {
    return <SocialPostsPage initialTab="templates" />;
  }
  if (currentPath.startsWith('/social-posts/history')) {
    return <SocialPostsPage initialTab="history" />;
  }

  // Default to Main Dashboard
  return <Dashboard />;
}

export default App;

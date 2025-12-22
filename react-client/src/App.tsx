import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoPage from './pages/TodoPage';
import ChatPage from './pages/ChatPage';
import MemoryPage from './pages/MemoryPage';
import { fetchLoggedInUser } from './services/authService';
import './App.css';

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetchLoggedInUser()
      .then((user) => {
        setUsername(user);
      })
      .catch(() => {
        // Authentication handled by the server
      })
      .finally(() => setLoadingUser(false));
  }, []);

  return (
    <Router>
      <div className="app-shell">
        <main>
          {username && (
            <Routes>
              <Route path="/" element={<Navigate to="/todo" replace />} />
              <Route path="/todo" element={<TodoPage username={username} />} />
              <Route path="/chat" element={<ChatPage username={username} />} />
              <Route path="/monitoring" element={<MemoryPage username={username} />} />
            </Routes>
          )}
          {!username && loadingUser && (
            <div className="p-3 text-center text-muted">Authenticating…</div>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;

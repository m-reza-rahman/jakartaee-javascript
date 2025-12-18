import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import TodoPage from './pages/TodoPage';
import ChatPage from './pages/ChatPage';
import { fetchLoggedInUser, redirectToLogin } from './services/authService';
import './App.css';

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    fetchLoggedInUser()
      .then((user) => {
        setUsername(user);
        setAuthError('');
      })
      .catch((err) => {
        setAuthError(err instanceof Error ? err.message : 'Authentication required');
      })
      .finally(() => setLoadingUser(false));
  }, []);

  const items: MenuItem[] = [
    {
      label: 'To-Do',
      icon: 'pi pi-list-check',
      template: (item: MenuItem, options: any) => (
        <NavLink className={({ isActive }) => options.className + (isActive ? ' p-menuitem-active' : '')} to="/todo">
          <span className={options.labelClassName}>
            <i className={item.icon + ' mr-2'} />{item.label}
          </span>
        </NavLink>
      )
    },
    {
      label: 'Chat',
      icon: 'pi pi-comments',
      template: (item: MenuItem, options: any) => (
        <NavLink className={({ isActive }) => options.className + (isActive ? ' p-menuitem-active' : '')} to="/chat">
          <span className={options.labelClassName}>
            <i className={item.icon + ' mr-2'} />{item.label}
          </span>
        </NavLink>
      )
    }
  ];

  const end = (
    <div className="flex align-items-center gap-3">
      <span className="text-900 font-semibold">
        {username ? `Signed in as ${username}` : loadingUser ? 'Authenticating…' : 'Not signed in'}
      </span>
      {authError && !loadingUser && (
        <Button
          type="button"
          label="Sign in"
          icon="pi pi-sign-in"
          onClick={() => redirectToLogin()}
        />
      )}
    </div>
  );

  return (
    <Router>
      <div className="app-shell">
        <Menubar model={items} start={<span className="text-900 font-bold ml-2">Jakarta EE Demo</span>} end={end} className="shadow-1" />
        {authError && !loadingUser && (
          <div className="p-message p-component p-message-error m-3">
            <div className="p-message-wrapper">
              <span className="p-message-icon pi pi-times-circle" />
              <span className="p-message-text">{authError}</span>
            </div>
          </div>
        )}
        <main className="py-4">
          {username && (
            <Routes>
              <Route path="/" element={<Navigate to="/todo" replace />} />
              <Route path="/todo" element={<TodoPage username={username} />} />
              <Route path="/chat" element={<ChatPage username={username} />} />
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

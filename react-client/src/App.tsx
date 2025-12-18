import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { MenuItem } from 'primereact/menuitem';
import TodoPage from './pages/TodoPage';
import ChatPage from './pages/ChatPage';
import { DEFAULT_USERNAME } from './services/apiConfig';
import './App.css';

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || DEFAULT_USERNAME);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

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
      <div className="p-inputgroup username-form">
        <span className="p-inputgroup-addon">
          <i className="pi pi-user" />
        </span>
        <InputText id="username-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
      </div>
    </div>
  );

  return (
    <Router>
      <div className="app-shell">
        <Menubar model={items} start={<span className="text-900 font-bold ml-2">Jakarta EE Demo</span>} end={end} className="shadow-1" />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/todo" replace />} />
            <Route path="/todo" element={<TodoPage username={username} />} />
            <Route path="/chat" element={<ChatPage username={username} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

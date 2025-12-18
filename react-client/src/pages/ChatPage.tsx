import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { createChatClient, ChatMessage } from '../services/chatClient';
import { ensureAuthenticated } from '../services/todoApi';

interface ChatPageProps {
  username: string;
}

function ChatPage({ username }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const clientRef = useRef<ReturnType<typeof createChatClient> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure basic auth session is established before opening WebSocket
    ensureAuthenticated().then(() => {
      const client = createChatClient(username, {
        onMessage: (msg) => setMessages((prev) => [...prev, msg]),
        onError: (err) => setStatus(err || 'Connection error'),
        onOpen: () => setStatus('Connected'),
        onClose: () => setStatus('Disconnected'),
      });
      clientRef.current = client;
    });
    
    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [username]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    const text = newMessage.trim();
    if (!text) return;
    clientRef.current?.send(text);
    setNewMessage('');
  };

  return (
    <Card className="chat-card shadow-1">
      <div className="d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h5 mb-0">Chat as {username || 'Anonymous'}</h2>
            <small className="text-muted">WebSocket connected to the backend chat endpoint.</small>
          </div>
          <span className={`badge ${status === 'Connected' ? 'bg-success' : 'bg-secondary'}`}>{status}</span>
        </div>

        <div className="chat-box border rounded p-2" ref={listRef}>
          <table className="table table-sm mb-0 align-middle">
            <tbody>
              {messages.map((m, idx) => (
                <tr key={idx}>
                  <td className="text-muted small" style={{ width: '25%' }}>{m.timestamp}</td>
                  <td className="fw-bold" style={{ width: '15%' }}>{m.user}</td>
                  <td style={{ width: '60%' }}>{m.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!messages.length && <div className="text-muted text-center py-3">No messages yet.</div>}
        </div>

        <form className="d-flex gap-2" onSubmit={handleSend}>
          <InputText
            placeholder="Say hello..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
            className="flex-grow-1"
          />
          <Button type="submit" label="Send" icon="pi pi-send" />
        </form>
      </div>
    </Card>
  );
}

export default ChatPage;

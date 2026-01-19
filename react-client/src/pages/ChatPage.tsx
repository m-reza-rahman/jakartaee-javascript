import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { createChatClient, ChatMessage } from '../services/chatClient';

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
    const client = createChatClient(username, {
      onMessage: (msg) => setMessages((prev) => [...prev, msg]),
      onError: (err) => setStatus(err || 'Connection error'),
      onOpen: () => setStatus('Connected'),
      onClose: () => setStatus('Disconnected'),
    });
    clientRef.current = client;
    
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
    <Card
      className="chat-card shadow-1"
      title={`Chat as ${username || 'Anonymous'}`}
      subTitle={<span className="text-muted">WebSocket connected to the backend chat endpoint. <span className={`badge ms-2 ${status === 'Connected' ? 'bg-success' : 'bg-secondary'}`}>{status}</span></span>}
    >
      <div className="d-flex flex-column gap-3">
        <div className="chat-box border rounded p-3" ref={listRef}>
          <div className="messages-container">
            {messages.map((m, idx) => (
              <div key={idx} className="message-bubble">
                <div className="message-header">
                  <span className="message-user">{m.user}</span>
                  <span className="message-timestamp">{m.timestamp}</span>
                </div>
                <div className="message-content">{m.message}</div>
              </div>
            ))}
            {!messages.length && <div className="text-muted text-center py-3">No messages yet.</div>}
          </div>
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

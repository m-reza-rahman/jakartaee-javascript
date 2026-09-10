import { FormEvent, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { createChatClient, ChatMessage } from '../services/chatClient';

interface ChatPageProps {
  username: string;
}

const MIN_MESSAGE_LENGTH = 2;
const MAX_MESSAGE_LENGTH = 255;

function ChatPage({ username }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const [errorMsg, setErrorMsg] = useState('');
  const clientRef = useRef<ReturnType<typeof createChatClient> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const client = createChatClient(username, {
      onMessage: (msg) => {
        setMessages((prev) => [...prev, msg]);
        setErrorMsg('');
      },
      onError: (err) => setErrorMsg(err || 'Connection error'),
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

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    const text = newMessage.trim();
    if (text.length < MIN_MESSAGE_LENGTH) {
      setErrorMsg(`Message must be at least ${MIN_MESSAGE_LENGTH} characters.`);
      return;
    }
    clientRef.current?.send(text);
    setNewMessage('');
    setErrorMsg('');
  };

  const trimmedLength = newMessage.trim().length;
  const canSend = trimmedLength >= MIN_MESSAGE_LENGTH && trimmedLength <= MAX_MESSAGE_LENGTH;

  return (
    <div className="p-3">
      <Card
        className="chat-card shadow-1"
        title={`Chat as ${username || 'Anonymous'}`}
        subTitle={<span className="text-muted">WebSocket communication with the backend chat endpoint. <span className={`badge ms-2 ${status === 'Connected' ? 'bg-success' : 'bg-secondary'}`}>{status}</span></span>}
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

          {errorMsg && <Message severity="error" text={errorMsg} className="w-full" />}

          <form className="d-flex gap-2" onSubmit={handleSend}>
            <InputText
              placeholder="Say hello..."
              value={newMessage}
              minLength={MIN_MESSAGE_LENGTH}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={(e) => setNewMessage(e.target.value)}
              required
              className="flex-grow-1"
              aria-describedby="chat-input-hint"
            />
            <Button type="submit" label="Send" icon="pi pi-send" disabled={!canSend} />
          </form>
          <small id="chat-input-hint" className="text-muted">
            {newMessage.trim().length}/{MAX_MESSAGE_LENGTH} characters (minimum {MIN_MESSAGE_LENGTH})
          </small>
        </div>
      </Card>
    </div>
  );
}

export default ChatPage;

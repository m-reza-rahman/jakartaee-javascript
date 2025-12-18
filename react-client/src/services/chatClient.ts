import { WS_URL } from './apiConfig';

export interface ChatMessage {
  user: string;
  message: string;
  error?: string;
  timestamp?: string;
}

interface ChatClientOptions {
  onMessage?: (data: ChatMessage) => void;
  onError?: (error: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

interface ChatClient {
  send: (text: string) => void;
  close: () => void;
}

export function createChatClient(username: string, { onMessage, onError, onOpen, onClose }: ChatClientOptions = {}): ChatClient {
  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    if (onOpen) onOpen();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.error) {
        if (onError) onError(data.error);
        return;
      }
      if (onMessage) onMessage(data);
    } catch (err) {
      if (onError) onError('Received malformed message');
    }
  };

  socket.onerror = () => {
    if (onError) onError('Connection error');
  };

  socket.onclose = () => {
    if (onClose) onClose();
  };

  const send = (text: string) => {
    if (!text) return;
    const payload = JSON.stringify({ user: username, message: text });
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
      return;
    }
    if (socket.readyState === WebSocket.CONNECTING) {
      socket.addEventListener('open', () => socket.send(payload), { once: true });
    }
  };

  const close = () => {
    socket.close();
  };

  return { send, close };
}

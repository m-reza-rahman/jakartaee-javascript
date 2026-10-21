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
  send: (text: string) => boolean;
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
    if (socket.readyState !== WebSocket.OPEN) {
      onError?.('Chat is not connected. Your message has not been sent.');
      return false;
    }
    try {
      socket.send(JSON.stringify({ user: username, message: text }));
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Unable to send message.');
      return false;
    }
    return true;
  };

  const close = () => {
    socket.close();
  };

  return { send, close };
}

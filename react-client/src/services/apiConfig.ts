const fallbackApiBase = 'http://localhost:8080/resources';
const fallbackWsUrl = 'ws://localhost:8080/chat';

export const API_BASE = import.meta.env.VITE_API_BASE || fallbackApiBase;
export const WS_URL = import.meta.env.VITE_WS_URL || fallbackWsUrl;

const fallbackApiBase = 'https://localhost:8443/jakartaee-javascript/resources';
const fallbackWsUrl = 'wss://localhost:8443/jakartaee-javascript/chat';

export const API_BASE = import.meta.env.VITE_API_BASE || fallbackApiBase;
export const WS_URL = import.meta.env.VITE_WS_URL || fallbackWsUrl;
export const DEFAULT_USERNAME = import.meta.env.VITE_USERNAME || 'reza';

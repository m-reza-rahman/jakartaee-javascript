import { API_BASE } from './apiConfig';

export function redirectToLogin(): never {
  const here = window.location.href;
  const redirect = encodeURIComponent(here);
  window.location.assign(`${API_BASE}/auth/user?redirect=${redirect}`);
  throw new Error('Authentication required');
}

export async function fetchLoggedInUser(): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/user`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 401) {
    redirectToLogin();
  }

  if (!response.ok) {
    throw new Error('Unable to determine authenticated user');
  }

  const data = await response.json();
  const username = (data && data.username ? String(data.username) : '').trim();
  if (!username) {
    throw new Error('Authenticated user not available');
  }
  return username;
}

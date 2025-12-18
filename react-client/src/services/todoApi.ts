import { API_BASE } from './apiConfig';

interface ToDoItem {
  id: number;
  description: string;
  completed?: boolean;
}

interface WhoAmIResponse {
  user: string;
  roles: string[];
}

const jsonHeaders: Record<string, string> = { 'Content-Type': 'application/json' };

function redirectToBasicLogin(): void {
  const here = window.location.href;
  const redirect = encodeURIComponent(here);
  // Use protected JSP to trigger browser Basic Auth prompt, then return to SPA
  window.location.assign(`/auth.jsp?redirect=${redirect}`);
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T | null> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { ...jsonHeaders, ...(options.headers || {}) },
    ...options,
  });

  if (response.status === 401) {
    redirectToBasicLogin();
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      if (Array.isArray(data) && data.length && data[0].message) {
        message = data[0].message;
      } else if (data.message) {
        message = data.message;
      }
    } catch (err) {
      // ignore parse errors
    }
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchToDos(username: string): Promise<ToDoItem[] | null> {
  return request<ToDoItem[]>(`/todo/${encodeURIComponent(username)}`);
}

export function createToDo(username: string, description: string): Promise<ToDoItem | null> {
  return request<ToDoItem>(`/todo/${encodeURIComponent(username)}`, {
    method: 'POST',
    body: JSON.stringify({ description }),
  });
}

export function updateToDo(username: string, item: ToDoItem): Promise<ToDoItem | null> {
  return request<ToDoItem>(`/todo/${encodeURIComponent(username)}/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
}

export function deleteToDo(username: string, id: number): Promise<null> {
  return request(`/todo/${encodeURIComponent(username)}/${id}`, {
    method: 'DELETE',
  });
}

// Perform a no-op call that will trigger auth if needed
export async function ensureAuthenticated(username: string): Promise<void> {
  try {
    await request('/auth/whoami');
  } catch (e) {
    // redirect handled inside request()
  }
}

export function getWhoAmI(): Promise<WhoAmIResponse | null> {
  return request<WhoAmIResponse>('/auth/whoami');
}


// utils/apiWithAuth.js
import { getAuthHeaders } from './authService';

export async function fetchWithAuth(url, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

export const apiWithAuth = {
  get: (url) => fetchWithAuth(url),
  post: (url, data) => fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (url, data) => fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (url) => fetchWithAuth(url, {
    method: 'DELETE'
  })
};

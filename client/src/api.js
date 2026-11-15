// Thin fetch wrapper: attaches the JWT, parses JSON, throws readable errors.
const BASE = import.meta.env.VITE_API_URL || '/api';

export const tokenStore = {
  get: () => localStorage.getItem('bloom_token'),
  set: (t) => localStorage.setItem('bloom_token', t),
  clear: () => localStorage.removeItem('bloom_token'),
};

async function request(path, { method = 'GET', body } = {}) {
  const token = tokenStore.get();
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Please try again in a moment.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
  put: (p, body) => request(p, { method: 'PUT', body }),
  del: (p) => request(p, { method: 'DELETE' }),
};

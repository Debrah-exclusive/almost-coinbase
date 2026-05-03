/**
 * Centralised API service for communicating with the backend.
 * All requests include credentials (cookies) for JWT auth.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include', // send HTTP-only cookie with every request
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  logout:   ()     => request('/auth/logout',   { method: 'POST' }),
  profile:  ()     => request('/auth/profile'),
};

// ─── Crypto ───────────────────────────────────────────────────────────────────
export const cryptoApi = {
  getAll:    () => request('/crypto'),
  getGainers:() => request('/crypto/gainers'),
  getNew:    () => request('/crypto/new'),
  add:       (body) => request('/crypto', { method: 'POST', body: JSON.stringify(body) }),
};

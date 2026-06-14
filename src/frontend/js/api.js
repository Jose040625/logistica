// api.js — Authenticated fetch wrapper
const API = {
  _token: null,

  setToken(t) { this._token = t; },
  clearToken() { this._token = null; },

  async _fetch(method, path, body) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (this._token) opts.headers['Authorization'] = `Bearer ${this._token}`;
    if (body !== undefined) opts.body = JSON.stringify(body);

    const res = await fetch(`/api${path}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  },

  get(path)         { return this._fetch('GET',    path); },
  post(path, body)  { return this._fetch('POST',   path, body); },
  put(path, body)   { return this._fetch('PUT',    path, body); },
  del(path)         { return this._fetch('DELETE', path); },
};

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
async function request(path, options = {}) {
  const { body, signal, ...rest } = options;
  const headers = { ...rest.headers };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    signal,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
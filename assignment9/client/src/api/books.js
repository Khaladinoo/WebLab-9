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

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export function fetchBooks(params = {}, signal) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      searchParams.set(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  const path = queryString ? `/api/books?${queryString}` : '/api/books';
  return request(path, { signal });
}
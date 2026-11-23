const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
async function request(path, options = {}) {
  const { body, signal, ...rest } = options;
  const headers = { ...rest.headers };
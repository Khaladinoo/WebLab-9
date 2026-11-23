const VALID_GENRES = ['fiction', 'non-fiction', 'science', 'history', 'fantasy', 'other'];
const CURRENT_YEAR = new Date().getFullYear();

export function validateBookInput(body, isPatch = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  const clean = {};
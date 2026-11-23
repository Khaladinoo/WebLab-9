const VALID_GENRES = ['fiction', 'non-fiction', 'science', 'history', 'fantasy', 'other'];
const CURRENT_YEAR = new Date().getFullYear();

export function validateBookInput(body, isPatch = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  const clean = {};

  if(!isPatch || body.title !== undefined) {
    if(typeof body.title !=='string'){
        return {error: 'Title must be a string'}; 
    }
    const trimmed = body.title.trim();
    if(trimmed.length < 1 || trimmed.length > 100){
        return {error: 'Title must be between 1 and 100 characters'};
    }
    clean.title = trimmed;
  }
  
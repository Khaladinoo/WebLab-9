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

  if(!isPatch || body.author !== undefined){
    if(typeof body.author !== 'string'){
        return {error: 'Author must be between 1 and 100 characters'};
    }
    clean.author = trimmed;
  }

  if (!isPatch || body.year !== undefined) {
    if (typeof body.year !== 'number' || !Number.isInteger(body.year) || body.year < 1000 || body.year > CURRENT_YEAR) {
      return { error: `Year must be an integer between 1000 and ${CURRENT_YEAR}` };
    }
    clean.year = body.year;
  }

  if (!isPatch || body.genre !== undefined) {
    if (typeof body.genre !== 'string' || !VALID_GENRES.includes(body.genre)) {
      return { error: `Genre must be one of: ${VALID_GENRES.join(', ')}` };
    }
    clean.genre = body.genre;
  }

  if (body.read !== undefined) {
    if (typeof body.read !== 'boolean') {
      return { error: 'Read status must be a boolean' };
    }
    clean.read = body.read;
  } else if (!isPatch) {
    clean.read = false;
  }

  if (body.rating !== undefined) {
    if (body.rating !== null && (typeof body.rating !== 'number' || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5)) {
      return { error: 'Rating must be an integer between 1 and 5, or null' };
    }
    clean.rating = body.rating;
  } else if (!isPatch) {
    clean.rating = null;
  }

  return { data: clean };
}

export function validateMergedBook(book) {
  if (!book.read && book.rating !== null) {
    return { error: 'Rating is allowed only when read is true' };
  }
  return { data: book };
}
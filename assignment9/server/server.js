import express from 'express';
import cors from 'cors';
import {
  getAllBooks,
  getBookById,
  isDuplicate,
  createBook,
  replaceBook,
  updateBookPartial,
  deleteBook
} from './bookStore.js';
import {
  validateBookInput,
  validateMergedBook,
  parsePositiveId,
  VALID_GENRES
} from './validate.js';

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }
  next(err);
});

// GET /api/books - Filter, search, sort, and paginate books
app.get('/api/books', async (req, res, next) => {
  try {
    const { genre, read, q, sort, order, limit, page } = req.query;

    // Reject repeated query parameters
    if (Array.isArray(genre) || Array.isArray(read) || Array.isArray(q) || Array.isArray(sort) || Array.isArray(order) || Array.isArray(limit) || Array.isArray(page)) {
      return res.status(400).json({ error: 'Repeated query parameters are not allowed' });
    }

    // Validate query parameter values
    if (genre !== undefined && !VALID_GENRES.includes(genre)) {
      return res.status(400).json({ error: 'Invalid genre filter' });
    }

    if (read !== undefined && read !== 'true' && read !== 'false') {
      return res.status(400).json({ error: 'Read parameter must be true or false' });
    }

    const validSorts = ['title', 'author', 'year', 'rating'];
    if (sort !== undefined && !validSorts.includes(sort)) {
      return res.status(400).json({ error: 'Invalid sort field' });
    }

    if (order !== undefined && order !== 'asc' && order !== 'desc') {
      return res.status(400).json({ error: 'Order must be asc or desc' });
    }

    let parsedLimit = 50;
    if (limit !== undefined) {
      parsedLimit = Number(limit);
      if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50 || String(parsedLimit) !== limit) {
        return res.status(400).json({ error: 'Limit must be an integer between 1 and 50' });
      }
    }

    let parsedPage = 1;
    if (page !== undefined) {
      parsedPage = Number(page);
      if (!Number.isInteger(parsedPage) || parsedPage < 1 || String(parsedPage) !== page) {
        return res.status(400).json({ error: 'Page must be a positive integer' });
      }
    }

    let result = await getAllBooks();

    if (genre !== undefined) {
      result = result.filter((b) => b.genre === genre);
    }

    if (read !== undefined) {
      const boolRead = read === 'true';
      result = result.filter((b) => b.read === boolRead);
    }
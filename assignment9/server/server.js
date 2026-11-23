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

    if (q !== undefined && q.trim() !== '') {
      const queryLower = q.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(queryLower) ||
          b.author.toLowerCase().includes(queryLower)
      );
    }

    const sortDir = order === 'desc' ? -1 : 1;
    const sorted = [...result].sort((a, b) => {
      if (!sort) {
        return (a.id - b.id) * sortDir;
      }
      if (sort === 'rating') {
        if (a.rating === null && b.rating === null) return 0;
        if (a.rating === null) return 1;
        if (b.rating === null) return -1;
        return (a.rating - b.rating) * sortDir;
      }
      if (sort === 'year') {
        return (a.year - b.year) * sortDir;
      }
      return a[sort].localeCompare(b[sort]) * sortDir;
    });

    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginated = sorted.slice(startIndex, startIndex + parsedLimit);

    res.json(paginated);
  } catch (err) {
    next(err);
  }
});
app.get('/api/books/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const book = await getBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    next(err);
  }
});

app.post('/api/books', async (req, res, next) => {
  try {
    const { data, error } = validateBookInput(req.body, false);
    if (error) {
      return res.status(400).json({ error });
    }

    const mergedCheck = validateMergedBook(data);
    if (mergedCheck.error) {
      return res.status(400).json({ error: mergedCheck.error });
    }

    const duplicate = await isDuplicate(data.title, data.author);
    if (duplicate) {
      return res.status(409).json({ error: 'A book with this title and author already exists' });
    }

    const created = await createBook(data);
    res.status(201).location(`/api/books/${created.id}`).json(created);
  } catch (err) {
    next(err);
  }
});

app.put('/api/books/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const existing = await getBookById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { data, error } = validateBookInput(req.body, false);
    if (error) {
      return res.status(400).json({ error });
    }

    const mergedCheck = validateMergedBook(data);
    if (mergedCheck.error) {
      return res.status(400).json({ error: mergedCheck.error });
    }

    const duplicate = await isDuplicate(data.title, data.author, id);
    if (duplicate) {
      return res.status(409).json({ error: 'A book with this title and author already exists' });
    }

    const replaced = await replaceBook(id, data);
    res.json(replaced);
  } catch (err) {
    next(err);
  }
});

app.patch('/api/books/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const existing = await getBookById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { data, error } = validateBookInput(req.body, true);
    if (error) {
      return res.status(400).json({ error });
    }

    const merged = {
      ...existing,
      ...data
    };

    if (data.read === false && data.rating === undefined) {
      merged.rating = null;
    }

    const mergedCheck = validateMergedBook(merged);
    if (mergedCheck.error) {
      return res.status(400).json({ error: mergedCheck.error });
    }

    const duplicate = await isDuplicate(merged.title, merged.author, id);
    if (duplicate) {
      return res.status(409).json({ error: 'A book with this title and author already exists' });
    }

    const updated = await updateBookPartial(id, merged);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/books/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const deleted = await deleteBook(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.get('/api/stats', async (req, res, next) => {
  try {
    const all = await getAllBooks();
    const total = all.length;
    const read = all.filter((b) => b.read).length;
    const unread = total - read;

    const ratedBooks = all.filter((b) => b.rating !== null);
    const averageRating =
      ratedBooks.length > 0
        ? Number((ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(1))
        : null;

    const byGenre = {};
    for (const book of all) {
      byGenre[book.genre] = (byGenre[book.genre] || 0) + 1;
    }

    res.json({
      total,
      read,
      unread,
      averageRating,
      byGenre
    });
  } catch (err) {
    next(err);
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
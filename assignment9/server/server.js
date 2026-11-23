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
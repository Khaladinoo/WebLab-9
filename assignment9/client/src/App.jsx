import { useState, useEffect, useCallback } from 'react';
import {
  fetchBooks,
  fetchStats,
  createBookApi,
  replaceBookApi,
  patchBookApi,
  deleteBookApi
} from './api/books';
import StatsPanel from './components/StatsPanel';
import BookForm from './components/BookForm';
import BookItem from './components/BookItem';

const GENRES = ['fiction', 'non-fiction', 'science', 'history', 'fantasy', 'other'];

const INITIAL_FORM = {
  title: '',
  author: '',
  year: new Date().getFullYear(),
  genre: 'fiction',
  read: false,
  rating: ''
};

export default function App() {

}
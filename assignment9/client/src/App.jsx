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
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);
}

const [q, setQ] = useState('');
  const [genre, setGenre] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('asc');

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);   

  
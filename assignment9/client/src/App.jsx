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


  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('asc');

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);   

  const loadStats = useCallback(async (signal) => {
    try {
      const data = await fetchStats(signal);
      setStats(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    }
  }, []);

    useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetchBooks({ q, genre, read: readFilter, sort, order }, controller.signal)
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [q, genre, readFilter, sort, order]);


 useEffect(() => {
    const controller = new AbortController();
    loadStats(controller.signal);
    return () => controller.abort();
  }, [loadStats]);

  const refreshAll = async () => {
    const [freshBooks, freshStats] = await Promise.all([
      fetchBooks({ q, genre, read: readFilter, sort, order }),
      fetchStats()
    ]);
    setBooks(freshBooks);
    setStats(freshStats);
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setSubmitting(true);

    const payload = {
      title: formData.title,
      author: formData.author,
      year: Number(formData.year),
      genre: formData.genre,
      read: Boolean(formData.read),
      rating: formData.read && formData.rating !== '' ? Number(formData.rating) : null
    };

    try {
      if (editingId) {
        await replaceBookApi(editingId, payload);
        setEditingId(null);
      } else {
        await createBookApi(payload);
      }
      setFormData(INITIAL_FORM);
      await refreshAll();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (book) => {
    setActionError('');
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      year: book.year,
      genre: book.genre,
      read: book.read,
      rating: book.rating ?? ''
    });
  };
}
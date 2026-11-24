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

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setActionError('');
  };

  const handleToggleRead = async (book) => {
    setActionError('');
    try {
      const nextRead = !book.read;
      const patchData = nextRead ? { read: true } : { read: false, rating: null };
      const updated = await patchBookApi(book.id, patchData);
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
      await loadStats();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleRatingChange = async (book, newRating) => {
    setActionError('');
    try {
      const ratingValue = newRating === '' ? null : Number(newRating);
      const updated = await patchBookApi(book.id, { rating: ratingValue });
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
      await loadStats();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setActionError('');
    try {
      await deleteBookApi(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      await loadStats();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Reading List</h1>

      {/* Live statistics summary */}
      <StatsPanel stats={stats} />

      {/* Server-side validation or mutation error banner */}
      {actionError && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
          {actionError}
        </div>
      )}

      {/* Book creation and editing form */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editingId={editingId}
        onCancel={cancelEdit}
        submitting={submitting}
        genres={GENRES}
      />

      {/* Search, filter, and sort controls */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search title or author..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="all">All Genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="true">Read</option>
          <option value="false">Unread</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Default Sort (ID)</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="year">Year</option>
          <option value="rating">Rating</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </section>

      {/* Loading, error, empty, and populated list states */}
      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: '#b91c1c' }}>Error: {error}</p>}
      {!loading && !error && books.length === 0 && <p>No books found matching your criteria.</p>}

      {!loading && !error && books.length > 0 && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {books.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              onToggleRead={handleToggleRead}
              onRatingChange={handleRatingChange}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
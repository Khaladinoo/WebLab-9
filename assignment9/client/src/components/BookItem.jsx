export default function BookItem({ book, onToggleRead, onRatingChange, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      {/* Book metadata display */}
      <div>
        <strong>{book.title}</strong> by {book.author} ({book.year}) — <em>{book.genre}</em>
        <div style={{ marginTop: '0.3rem', fontSize: '0.9rem' }}>
          Status: {book.read ? 'Read' : 'Unread'} | Rating: {book.rating ? `${book.rating}/5` : 'Unrated'}
        </div>
      </div>

      {/* Book action controls (PATCH read/rating, PUT edit, DELETE) */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button type="button" onClick={() => onToggleRead(book)}>
          Mark {book.read ? 'Unread' : 'Read'}
        </button>

        {book.read && (
          <select
            value={book.rating ?? ''}
            onChange={(e) => onRatingChange(book, e.target.value)}
          >
            <option value="">Rate</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} ★</option>
            ))}
          </select>
        )}

        <button type="button" onClick={() => onEdit(book)}>Edit</button>
        <button type="button" onClick={() => onDelete(book.id)} style={{ color: '#b91c1c' }}>Delete</button>
      </div>
    </div>
  );
}
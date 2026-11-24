export default function BookForm({ formData, setFormData, onSubmit, editingId, onCancel, submitting, genres }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
      {/* Title input */}
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      {/* Author input */}
      <input
        type="text"
        placeholder="Author"
        value={formData.author}
        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        required
      />

      {/* Publication year input */}
      <input
        type="number"
        placeholder="Year"
        value={formData.year}
        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        required
      />

      {/* Genre selector */}
      <select value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })}>
        {genres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Read checkbox (clears rating if unchecked) */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <input
          type="checkbox"
          checked={formData.read}
          onChange={(e) => setFormData({ ...formData, read: e.target.checked, rating: e.target.checked ? formData.rating : '' })}
        />
        Read
      </label>

      {/* Rating selector (enabled only when read is true) */}
      <select
        value={formData.rating}
        disabled={!formData.read}
        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
      >
        <option value="">No Rating</option>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>{r} Stars</option>
        ))}
      </select>

      {/* Submit and optional Cancel buttons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingId ? 'Update Book' : 'Add Book'}
        </button>
        {editingId && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
export default function StatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <section style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
      {/* Overall counts and average rating */}
      <strong>Stats:</strong> Total: {stats.total} | Read: {stats.read} | Unread: {stats.unread} | Avg Rating: {stats.averageRating ?? 'N/A'}

      {/* Genre breakdown */}
      <div style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: '#475569' }}>
        By Genre: {Object.entries(stats.byGenre).map(([g, count]) => `${g} (${count})`).join(', ') || 'None'}
      </div>
    </section>
  );
}
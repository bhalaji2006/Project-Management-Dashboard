export default function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card stat-${accent || 'default'}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

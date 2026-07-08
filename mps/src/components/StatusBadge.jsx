import { STATUS_META } from '../utils/helpers.js';

export default function StatusBadge({ status, size = 'md' }) {
  const meta = STATUS_META[status] || STATUS_META.draft;
  return (
    <span
      className={`status-badge status-badge--${size}`}
      style={{
        color: meta.color,
        background: meta.bg,
      }}
    >
      <span className="status-badge-dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

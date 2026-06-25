import React from 'react';
import { STATUS_META } from '../data/mockData.js';

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 9px',
        borderRadius: 'var(--r-sm)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        color: meta.color,
        background: meta.bg,
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
      {meta.label}
    </span>
  );
}

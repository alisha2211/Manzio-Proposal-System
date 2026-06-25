import React from 'react';
import { STAGES, OFF_PATH_STAGES, STATUS_META } from '../data/mockData.js';
import './StatusThread.css';

/**
 * The signature motif of MPS: a stitched/dashed thread that represents
 * a proposal's path from Draft to Accepted. Off-path states (Rejected,
 * Expired, Cancelled) break the thread visibly rather than continuing it.
 *
 * size: 'sm' (inline, list rows) | 'md' (cards) | 'lg' (builder header / detail page)
 */
export default function StatusThread({ status, size = 'md' }) {
  const isOffPath = OFF_PATH_STAGES.includes(status);
  const currentIdx = STAGES.findIndex(s => s.key === status);
  const meta = STATUS_META[status];

  return (
    <div className={`thread thread--${size} ${isOffPath ? 'thread--off' : ''}`} role="img"
      aria-label={`Proposal status: ${meta.label}`}>
      {STAGES.map((stage, i) => {
        let state = 'upcoming';
        if (!isOffPath) {
          if (i < currentIdx) state = 'done';
          else if (i === currentIdx) state = 'current';
        } else {
          // for off-path, mark everything up to "sent" as done, then show a break
          state = i <= 3 ? 'done' : 'upcoming';
        }
        return (
          <React.Fragment key={stage.key}>
            <div className={`thread-node thread-node--${state}`}>
              <span className="thread-dot" />
              {size !== 'sm' && <span className="thread-label">{stage.label}</span>}
            </div>
            {i < STAGES.length - 1 && (
              <span className={`thread-seg thread-seg--${state === 'done' ? 'done' : 'idle'}`} />
            )}
          </React.Fragment>
        );
      })}
      {isOffPath && (
        <>
          <span className="thread-break" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div className="thread-node thread-node--final" style={{ '--final-color': meta.color }}>
            <span className="thread-dot thread-dot--final" />
            {size !== 'sm' && <span className="thread-label" style={{ color: meta.color }}>{meta.label}</span>}
          </div>
        </>
      )}
    </div>
  );
}

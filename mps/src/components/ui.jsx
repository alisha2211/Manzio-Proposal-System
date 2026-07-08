import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ui.css';

/* =========================================================
   CARD
   ========================================================= */
export function Card({ children, className = '', hover = false, ...rest }) {
  if (hover) {
    return (
      <motion.div
        className={`ui-card ${className}`}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
  return <div className={`ui-card ${className}`} {...rest}>{children}</div>;
}

/* =========================================================
   BUTTON
   ========================================================= */
export function Button({ children, variant = 'primary', size = 'md', icon, loading, ...rest }) {
  return (
    <motion.button
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${loading ? 'ui-btn--loading' : ''}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={loading}
      {...rest}
    >
      {loading && <span className="ui-btn-spinner" />}
      {icon && <span className="ui-btn-icon">{icon}</span>}
      {children}
    </motion.button>
  );
}

/* =========================================================
   PAGE HEADER
   ========================================================= */
export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <motion.div
      className="ui-page-header"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        {eyebrow && <div className="ui-eyebrow">{eyebrow}</div>}
        <h1 className="ui-page-title">{title}</h1>
        {description && <p className="ui-page-desc">{description}</p>}
      </div>
      {actions && <div className="ui-page-actions">{actions}</div>}
    </motion.div>
  );
}

/* =========================================================
   PAGE TRANSITION WRAPPER
   ========================================================= */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   STAT TILE
   ========================================================= */
export function StatTile({ label, value, sub, accent }) {
  return (
    <div className="ui-stat-tile">
      <span className="ui-stat-label">{label}</span>
      <span className="ui-stat-value" style={accent ? { color: accent } : undefined}>{value}</span>
      {sub && <span className="ui-stat-sub">{sub}</span>}
    </div>
  );
}

/* =========================================================
   ANIMATED COUNTER
   ========================================================= */
export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1200, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const target = typeof value === 'number' ? value : parseFloat(value) || 0;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * target);
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    }

    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [value, duration]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString('en-IN');

  return <>{prefix}{formatted}{suffix}</>;
}

/* =========================================================
   AVATAR
   ========================================================= */
export function Avatar({ user, size = 28 }) {
  if (!user) return null;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <span
      className="ui-avatar"
      style={{ background: user.avatarColor, width: size, height: size, fontSize: size * 0.38 }}
      title={user.name}
    >
      {initials}
    </span>
  );
}

/* =========================================================
   EMPTY STATE
   ========================================================= */
export function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      className="ui-empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {icon && <div className="ui-empty-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </motion.div>
  );
}

/* =========================================================
   SKELETON LOADER
   ========================================================= */
export function Skeleton({ width, height = 16, rounded = false, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height,
        borderRadius: rounded ? '50%' : undefined,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="ui-card ui-skeleton-card">
      <Skeleton width={120} height={12} />
      <Skeleton width={80} height={28} className="skeleton-mt" />
      <Skeleton width={100} height={12} className="skeleton-mt" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="ui-skeleton-table">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="ui-skeleton-row">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={`${60 + Math.random() * 40}%`} height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   TOASTS
   ========================================================= */
export function Toasts({ toasts }) {
  return (
    <div className="ui-toast-stack" aria-live="polite">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className={`ui-toast ui-toast--${t.tone}`}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <span className="ui-toast-icon">
              {t.tone === 'success' && '✓'}
              {t.tone === 'danger' && '✕'}
              {t.tone === 'default' && 'ℹ'}
              {!['success', 'danger', 'default'].includes(t.tone) && 'ℹ'}
            </span>
            <span className="ui-toast-msg">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   BADGE
   ========================================================= */
export function Badge({ children, variant = 'default' }) {
  return <span className={`ui-badge ui-badge--${variant}`}>{children}</span>;
}

/* =========================================================
   MODAL
   ========================================================= */
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="ui-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`ui-modal ui-modal--${size}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {title && (
            <div className="ui-modal-header">
              <h2>{title}</h2>
              <button className="ui-modal-close" onClick={onClose} aria-label="Close">×</button>
            </div>
          )}
          <div className="ui-modal-body">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

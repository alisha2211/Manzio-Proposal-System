import React from 'react';
import './ui.css';

export function Card({ children, className = '', ...rest }) {
  return <div className={`ui-card ${className}`} {...rest}>{children}</div>;
}

export function Button({ children, variant = 'primary', size = 'md', icon, ...rest }) {
  return (
    <button className={`ui-btn ui-btn--${variant} ui-btn--${size}`} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="ui-page-header">
      <div>
        {eyebrow && <div className="ui-eyebrow">{eyebrow}</div>}
        <h1 className="ui-page-title">{title}</h1>
        {description && <p className="ui-page-desc">{description}</p>}
      </div>
      {actions && <div className="ui-page-actions">{actions}</div>}
    </div>
  );
}

export function StatTile({ label, value, sub, accent }) {
  return (
    <div className="ui-stat-tile">
      <span className="ui-stat-label">{label}</span>
      <span className="ui-stat-value" style={accent ? { color: accent } : undefined}>{value}</span>
      {sub && <span className="ui-stat-sub">{sub}</span>}
    </div>
  );
}

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

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="ui-empty">
      {icon && <div className="ui-empty-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function Toasts({ toasts }) {
  return (
    <div className="ui-toast-stack" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`ui-toast ui-toast--${t.tone}`}>{t.message}</div>
      ))}
    </div>
  );
}

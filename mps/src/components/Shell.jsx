import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import './Shell.css';

const NAV = [
  { to: '/', label: 'Dashboard', icon: IconGrid, roles: ['admin', 'sales', 'management'] },
  { to: '/proposals', label: 'Proposals', icon: IconDoc, roles: ['admin', 'sales', 'management'] },
  { to: '/clients', label: 'Clients', icon: IconUsers, roles: ['admin', 'sales'] },
  { to: '/templates', label: 'Templates', icon: IconLayers, roles: ['admin', 'sales'] },
  { to: '/approvals', label: 'Approvals', icon: IconCheck, roles: ['admin', 'management'] },
  { to: '/reports', label: 'Reports', icon: IconChart, roles: ['admin', 'management'] },
  { to: '/portal', label: 'Client Portal', icon: IconExternal, roles: ['admin', 'sales', 'management'] },
  { to: '/settings', label: 'Settings', icon: IconSettings, roles: ['admin'] },
];

export default function Shell({ children }) {
  const { role, currentUser, pushToast, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer whenever the route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  function handleLogout() {
    logout();
    pushToast('You have been signed out.', 'default');
  }

  const visibleNav = NAV.filter(n => n.roles.includes(role));

  function onSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/proposals?q=${encodeURIComponent(query.trim())}`);
    setDrawerOpen(false);
  }

  const railContent = (isMobile = false) => (
    <>
      <div className="shell-brand">
        <div className="brand-mark">M</div>
        {(!collapsed || isMobile) && (
          <div className="brand-text">
            <span className="brand-name">Manzio</span>
            <span className="brand-sub">Proposal System</span>
          </div>
        )}
        {isMobile && (
          <button
            className="drawer-close-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <IconX />
          </button>
        )}
      </div>

      <nav className="shell-nav">
        {visibleNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `shell-nav-item ${isActive ? 'is-active' : ''}`}
            title={collapsed && !isMobile ? item.label : undefined}
          >
            <item.icon />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User chip in drawer */}
      <div className="rail-user-chip">
        <span className="user-avatar" style={{ background: currentUser.avatarColor }}>
          {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </span>
        {(!collapsed || isMobile) && (
          <div className="user-chip-text">
            <span className="user-chip-name">{currentUser.name}</span>
            <span className="user-chip-role">
              {role === 'sales' ? 'Sales Executive' : role === 'management' ? 'Management' : 'Super Admin'}
            </span>
          </div>
        )}
      </div>

      {/* Logout button */}
      <button
        className="shell-logout-btn"
        onClick={handleLogout}
        title={collapsed && !isMobile ? 'Sign out' : undefined}
        aria-label="Sign out"
      >
        <IconLogout />
        {(!collapsed || isMobile) && <span>Sign out</span>}
      </button>

      {!isMobile && (
        <button
          className="shell-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label="Toggle navigation width"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 220ms' }}>
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </>
  );

  return (
    <div className={`shell ${collapsed ? 'shell--collapsed' : ''}`}>
      {/* Desktop sidebar */}
      <aside className="shell-rail shell-rail--desktop">
        {railContent(false)}
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="shell-overlay"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside className={`shell-rail shell-rail--mobile ${drawerOpen ? 'is-open' : ''}`}>
        {railContent(true)}
      </aside>

      {/* Main content area */}
      <div className="shell-main">
        <header className="shell-topbar">
          {/* Hamburger — mobile only */}
          <button
            className="topbar-hamburger"
            onClick={() => setDrawerOpen(o => !o)}
            aria-label="Open navigation menu"
          >
            <IconMenu />
          </button>

          <form className="shell-search" onSubmit={onSearch}>
            <IconSearch />
            <input
              type="text"
              placeholder="Search proposals…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Global search"
            />
          </form>

          <div className="shell-topbar-right">
            <span className="role-badge">
              {role === 'sales' ? '💼 Sales' : role === 'management' ? '📋 Manager' : '👑 Admin'}
            </span>

            <button className="topbar-icon-btn" aria-label="Notifications">
              <IconBell />
              <span className="notif-dot" />
            </button>

            <div className="user-chip">
              <span className="user-avatar" style={{ background: currentUser.avatarColor }}>
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
              <div className="user-chip-text">
                <span className="user-chip-name">{currentUser.name}</span>
                <span className="user-chip-role">
                  {role === 'sales' ? 'Sales Executive' : role === 'management' ? 'Management' : 'Super Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}

/* ---- inline icon set ---- */
function IconGrid() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>;
}
function IconDoc() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 2h7l3 3v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6.5 8h5M6.5 11h5M6.5 14h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function IconUsers() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M2 15c.5-2.8 2.3-4.2 4.5-4.2S10.8 12.2 11 15M11.5 15c.4-2 1.6-3.2 3.3-3.2S17.6 13 18 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function IconLayers() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2 2 6l7 4 7-4-7-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M2 10l7 4 7-4M2 13.5l7 4 7-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
}
function IconCheck() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M6 9l2 2 4-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconChart() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 15V3M3 15h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M6 12V9M9.5 12V6M13 12V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function IconExternal() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7.5 3H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 2h6v6M15.5 2.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconSettings() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4"/><path d="M9 1.8v1.8M9 14.4v1.8M16.2 9h-1.8M3.6 9H1.8M14 4l-1.3 1.3M5.3 12.7L4 14M14 14l-1.3-1.3M5.3 5.3L4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function IconSearch() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M13 13l-2.2-2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function IconBell() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2.5c-2 0-3.5 1.6-3.5 4v2.3c0 .6-.2 1.2-.6 1.7l-.9 1.1c-.4.5 0 1.4.7 1.4h8.6c.7 0 1.1-.9.7-1.4l-.9-1.1c-.4-.5-.6-1.1-.6-1.7V6.5c0-2.4-1.5-4-3.5-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7.3 15a1.8 1.8 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function IconLogout() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 3H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12l3-3-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 9H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}
function IconMenu() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}
function IconX() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}


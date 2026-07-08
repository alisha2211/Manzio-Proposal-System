import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import {
  LayoutDashboard, FileText, Users, Layers, CheckCircle2,
  BarChart3, ExternalLink, Settings, Bell, Search, LogOut,
  Menu, X, ChevronLeft, Command
} from 'lucide-react';
import NotificationsPanel from './NotificationsPanel.jsx';
import CommandPalette from './CommandPalette.jsx';
import './Shell.css';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'management'] },
  { to: '/proposals', label: 'Proposals', icon: FileText, roles: ['admin', 'management'] },
  { to: '/clients', label: 'Clients', icon: Users, roles: ['admin', 'management'] },
  { to: '/templates', label: 'Templates', icon: Layers, roles: ['admin', 'management'] },
  { to: '/approvals', label: 'Approvals', icon: CheckCircle2, roles: ['admin', 'management'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'management'] },
  { to: '/portal', label: 'Client Portal', icon: ExternalLink, roles: ['admin', 'management'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export default function Shell({ children }) {
  const { role, currentUser, pushToast, logout, darkMode, toggleDarkMode, unreadCount } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);

  // Close mobile drawer whenever the route changes
  useEffect(() => {
    setDrawerOpen(false);
    setShowNotifs(false);
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

  // Keyboard shortcut: Ctrl+K for command palette
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(true);
      }
      if (e.key === 'Escape') {
        setShowPalette(false);
        setShowNotifs(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    }
    if (showNotifs) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifs]);

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

  const sidebarContent = (isMobile = false) => (
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
            <X size={20} />
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
            <item.icon size={20} strokeWidth={1.8} />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User chip */}
      <div className="rail-user-chip">
        <span className="user-avatar" style={{ background: currentUser.avatarColor }}>
          {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </span>
        {(!collapsed || isMobile) && (
          <div className="user-chip-text">
            <span className="user-chip-name">{currentUser.name}</span>
            <span className="user-chip-role">
              {role === 'management' ? 'Manager' : 'Super Admin'}
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
        <LogOut size={18} />
        {(!collapsed || isMobile) && <span>Sign out</span>}
      </button>

      {!isMobile && (
        <button
          className="shell-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label="Toggle navigation width"
        >
          <ChevronLeft
            size={16}
            style={{
              transform: collapsed ? 'rotate(180deg)' : 'none',
              transition: 'transform 220ms'
            }}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      )}
    </>
  );

  return (
    <div className={`shell ${collapsed ? 'shell--collapsed' : ''}`}>
      {/* Desktop sidebar */}
      <aside className="shell-rail shell-rail--desktop">
        {sidebarContent(false)}
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="shell-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <aside className={`shell-rail shell-rail--mobile ${drawerOpen ? 'is-open' : ''}`}>
        {sidebarContent(true)}
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
            <Menu size={22} />
          </button>

          <form className="shell-search" onSubmit={onSearch}>
            <Search size={16} strokeWidth={2} />
            <input
              type="text"
              placeholder="Search proposals…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Global search"
            />
            <kbd className="search-kbd" onClick={() => setShowPalette(true)}>
              <Command size={11} /> K
            </kbd>
          </form>

          <div className="shell-topbar-right">

            <div className="topbar-notif-wrap" ref={notifRef}>
              <button
                className="topbar-icon-btn"
                aria-label="Notifications"
                onClick={() => setShowNotifs(v => !v)}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="notif-dot">{unreadCount}</span>
                )}
              </button>
              <AnimatePresence>
                {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
              </AnimatePresence>
            </div>

            <div className="user-chip">
              <span className="user-avatar" style={{ background: currentUser.avatarColor }}>
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
              <div className="user-chip-text">
                <span className="user-chip-name">{currentUser.name}</span>
                <span className="user-chip-role">
                  {role === 'management' ? 'Manager' : 'Super Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="shell-content">{children}</main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={showPalette} onClose={() => setShowPalette(false)} />
    </div>
  );
}
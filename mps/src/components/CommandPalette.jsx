import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, FileText, Users, Layers,
  CheckCircle2, BarChart3, Settings, ExternalLink,
  ChevronRight, ArrowRight
} from 'lucide-react';
import './CommandPalette.css';

const COMMANDS = [
  { id: 'dashboard',   label: 'Go to Dashboard',       icon: LayoutDashboard, to: '/',           group: 'Navigation' },
  { id: 'proposals',  label: 'Go to Proposals',        icon: FileText,         to: '/proposals',  group: 'Navigation' },
  { id: 'new-prop',   label: 'Create New Proposal',    icon: FileText,         to: '/proposals/new', group: 'Actions' },
  { id: 'clients',    label: 'Go to Clients',          icon: Users,            to: '/clients',    group: 'Navigation' },
  { id: 'templates',  label: 'Go to Templates',        icon: Layers,           to: '/templates',  group: 'Navigation' },
  { id: 'approvals',  label: 'Go to Approvals',        icon: CheckCircle2,     to: '/approvals',  group: 'Navigation' },
  { id: 'reports',    label: 'Go to Reports',          icon: BarChart3,        to: '/reports',    group: 'Navigation' },
  { id: 'portal',     label: 'Open Client Portal',     icon: ExternalLink,     to: '/portal',     group: 'Navigation' },
  { id: 'settings',   label: 'Go to Settings',         icon: Settings,         to: '/settings',   group: 'Navigation' },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  // Group results
  const groups = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  const flatFiltered = filtered;

  function handleSelect(cmd) {
    navigate(cmd.to);
    onClose();
    setQuery('');
    setSelected(0);
  }

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected(s => Math.min(s + 1, flatFiltered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected(s => Math.max(s - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatFiltered[selected]) handleSelect(flatFiltered[selected]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, flatFiltered, selected]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            className="cmd-box"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="cmd-search-row">
              <Search size={16} className="cmd-search-icon" />
              <input
                ref={inputRef}
                className="cmd-input"
                type="text"
                placeholder="Type a command or search…"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="cmd-esc-key">esc</kbd>
            </div>

            {/* Results */}
            <div className="cmd-results">
              {flatFiltered.length === 0 ? (
                <div className="cmd-empty">
                  <Search size={20} />
                  <p>No results for "<strong>{query}</strong>"</p>
                </div>
              ) : (
                Object.entries(groups).map(([group, cmds]) => (
                  <div key={group} className="cmd-group">
                    <div className="cmd-group-label">{group}</div>
                    {cmds.map(cmd => {
                      const globalIdx = flatFiltered.indexOf(cmd);
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          className={`cmd-item ${globalIdx === selected ? 'cmd-item--active' : ''}`}
                          onMouseEnter={() => setSelected(globalIdx)}
                          onClick={() => handleSelect(cmd)}
                        >
                          <span className="cmd-item-icon">
                            <Icon size={15} />
                          </span>
                          <span className="cmd-item-label">{cmd.label}</span>
                          <ArrowRight size={13} className="cmd-item-arrow" />
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="cmd-footer">
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

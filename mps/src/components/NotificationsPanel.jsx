import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { Bell, CheckCheck, Eye, Clock, Plus } from 'lucide-react';
import './NotificationsPanel.css';

const NOTIF_ICONS = {
  approved:  { icon: CheckCheck, color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  viewed:    { icon: Eye,         color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  expiring:  { icon: Clock,       color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  created:   { icon: Plus,        color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  default:   { icon: Bell,        color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
};

function getNotifMeta(n) {
  if (n.type) return NOTIF_ICONS[n.type] || NOTIF_ICONS.default;
  const msg = (n.message || '').toLowerCase();
  if (msg.includes('approv'))  return NOTIF_ICONS.approved;
  if (msg.includes('viewed') || msg.includes('view')) return NOTIF_ICONS.viewed;
  if (msg.includes('expir'))   return NOTIF_ICONS.expiring;
  if (msg.includes('created') || msg.includes('new')) return NOTIF_ICONS.created;
  return NOTIF_ICONS.default;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsPanel({ onClose }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      className="notif-panel"
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Header */}
      <div className="notif-header">
        <div className="notif-title-row">
          <span className="notif-title">Notifications</span>
          {unread > 0 && (
            <span className="notif-count-badge">{unread}</span>
          )}
        </div>
        {unread > 0 && (
          <button className="notif-mark-all" onClick={markAllNotificationsRead}>
            <CheckCheck size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <Bell size={28} />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const meta = getNotifMeta(n);
            const Icon = meta.icon;
            return (
              <motion.button
                key={n.id || i}
                className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
                onClick={() => markNotificationRead(n.id)}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  className="notif-icon-wrap"
                  style={{ background: meta.bg }}
                >
                  <Icon size={14} color={meta.color} />
                </div>
                <div className="notif-body">
                  <p className="notif-msg">{n.message}</p>
                  <span className="notif-time">{timeAgo(n.at || n.createdAt)}</span>
                </div>
                {!n.read && <span className="notif-unread-dot" />}
              </motion.button>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

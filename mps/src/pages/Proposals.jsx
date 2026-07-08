import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { fmtMoney, computeTotals } from '../utils/helpers.js';
import { Card, PageHeader, Button, Avatar, EmptyState } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { Search, FileText, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import './Proposals.css';
import PillTabs from '../components/PillTabs.jsx';

const STATUS_FILTERS = ['all', 'draft', 'pending', 'approved', 'sent', 'accepted', 'rejected', 'expired'];

const STATUS_LABELS = {
  all: 'All',
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  sent: 'Sent',
  accepted: 'Accepted',
  rejected: 'Rejected',
  expired: 'Expired',
};

const SERVICES = ['UI/UX Design', 'Web Design', 'Software Development', 'Marketing', 'CRM Implementation'];

export default function Proposals() {
  const { proposals, clients, users, role, currentUser } = useApp();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState('all');
  const [owner, setOwner] = useState('all');
  const [service, setService] = useState('all');
  const [query, setQuery] = useState(params.get('q') || '');
  const [sort, setSort] = useState('updated');
  const [sortDir, setSortDir] = useState('desc');

  const getClient = (id) => clients.find(c => String(c.id) === String(id));
  const getOwner = (id) => users.find(u => String(u.id) === String(id));

  const scoped = role === 'sales' ? proposals.filter(p => p.owner === currentUser.id) : proposals;

  const filtered = useMemo(() => {
    let list = scoped.filter(p => {
      const client = p.client === 'custom' ? p.customClient : getClient(p.client);
      const matchesQuery = !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.number.toLowerCase().includes(query.toLowerCase()) ||
        client?.name.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'all' || p.status === status;
      const matchesOwner = owner === 'all' || p.owner === owner;
      const matchesService = service === 'all' || p.service === service;
      return matchesQuery && matchesStatus && matchesOwner && matchesService;
    });

    list = [...list].sort((a, b) => {
      let diff = 0;
      if (sort === 'updated') diff = new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sort === 'value')   diff = computeTotals(b).total - computeTotals(a).total;
      if (sort === 'expiring') diff = new Date(a.expiresAt) - new Date(b.expiresAt);
      if (sort === 'number')  diff = a.number.localeCompare(b.number);
      return sortDir === 'asc' ? -diff : diff;
    });

    return list;
  }, [scoped, query, status, owner, service, sort, sortDir]);

  function toggleSort(col) {
    if (sort === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(col);
      setSortDir('desc');
    }
  }

  function SortIcon({ col }) {
    if (sort !== col) return <ArrowUpDown size={12} className="sort-icon sort-icon--inactive" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="sort-icon" />
      : <ChevronDown size={12} className="sort-icon" />;
  }

  const statusCounts = useMemo(() => {
    const counts = { all: scoped.length };
    STATUS_FILTERS.slice(1).forEach(s => {
      counts[s] = scoped.filter(p => p.status === s).length;
    });
    return counts;
  }, [scoped]);

  return (
    <div>
      <PageHeader
  eyebrow="Pipeline"
  title="Proposals"
  description="Every proposal across the studio."
  actions={
    <Link to="/proposals/new">
      <Button variant="accent" icon={<FileText size={15} />}>
        + New Proposal
      </Button>
    </Link>
  }
/>


      <div className="prop-filter-bar">
  <PillTabs tabs={STATUS_FILTERS.map(s => ({ id: s, label: STATUS_LABELS[s] }))} activeId={status} onChange={setStatus} />
        <div className="prop-search-wrap">
          <Search size={15} className="prop-search-icon" />
          <input
            className="prop-search-input"
            placeholder="Search by title, number, or client…"
            value={query}
            onChange={e => { setQuery(e.target.value); setParams({}); }}
          />
        </div>

        <div className="prop-selects">
          {role !== 'sales' && (
            <select className="prop-select" value={owner} onChange={e => setOwner(e.target.value)}>
              <option value="all">All executives</option>
              {users.filter(u => u.role === 'sales').map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          )}
          <select className="prop-select" value={service} onChange={e => setService(e.target.value)}>
            <option value="all">All services</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="prop-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="updated">Recently updated</option>
            <option value="value">Highest value</option>
            <option value="expiring">Expiring soon</option>
            <option value="number">Proposal #</option>
          </select>
        </div>
      </div>

      {/* ---- Table ---- */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={32} />}
            title="No proposals match these filters"
            description="Try a different search term, or clear filters to see the full pipeline."
            action={
              <Button variant="secondary" onClick={() => { setQuery(''); setStatus('all'); setOwner('all'); setService('all'); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <table className="ui-table prop-table">
            <thead>
              <tr>
                <th>
                  <button className="sort-th" onClick={() => toggleSort('number')}>
                    Proposal <SortIcon col="number" />
                  </button>
                </th>
                <th>Client</th>
                <th>Status</th>
                <th>Owner</th>
                <th>
                  <button className="sort-th" onClick={() => toggleSort('value')}>
                    Value <SortIcon col="value" />
                  </button>
                </th>
                <th>
                  <button className="sort-th" onClick={() => toggleSort('expiring')}>
                    Expires <SortIcon col="expiring" />
                  </button>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const client = p.client === 'custom' ? p.customClient : getClient(p.client);
                const o = getOwner(p.owner);
                const totals = computeTotals(p);
                const isExpiring = p.status === 'sent' && new Date(p.expiresAt) - new Date() < 1000 * 60 * 60 * 24 * 5;
                return (
                  <motion.tr
                    key={p.id}
                    className="prop-row clickable"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => navigate(`/proposals/${p.id}`)}
                  >
                    <td>
                      <div className="prop-cell-title">
                        <span className="mono prop-number">{p.number}</span>
                        <span className="prop-title-text">{p.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="prop-client-name">{client?.name}</span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td>
                      <div className="prop-owner">
                        <Avatar user={o} size={24} />
                        <span className="prop-owner-name">{o?.name.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="mono prop-value">{fmtMoney(totals.total, p.currency)}</td>
                    <td>
                      <span className={`mono prop-expiry ${isExpiring ? 'prop-expiry--soon' : ''}`}>
                        {p.expiresAt}
                        {isExpiring && <span className="expiry-warn"> ⚠</span>}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/proposals/${p.id}`}
                        className="prop-view-btn"
                        onClick={e => e.stopPropagation()}
                      >
                        View →
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}

        {filtered.length > 0 && (
          <div className="prop-table-footer">
            <span className="prop-count-text">
              Showing {filtered.length} of {scoped.length} proposals
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}

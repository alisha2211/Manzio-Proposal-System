import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fmtMoney, computeTotals, getClient, getOwner, STATUS_META, SERVICES } from '../data/mockData.js';
import { Card, PageHeader, Button, Avatar, EmptyState } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import './Proposals.css';

const STATUS_FILTERS = ['all', 'draft', 'pending', 'approved', 'sent', 'accepted', 'rejected', 'expired'];

export default function Proposals() {
  const { proposals, users, role, currentUser } = useApp();
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState('all');
  const [owner, setOwner] = useState('all');
  const [service, setService] = useState('all');
  const [query, setQuery] = useState(params.get('q') || '');
  const [sort, setSort] = useState('updated');

  const scoped = role === 'sales' ? proposals.filter(p => p.owner === currentUser.id) : proposals;

  const filtered = useMemo(() => {
    let list = scoped.filter(p => {
      const client = getClient(p.client);
      const matchesQuery = !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.number.toLowerCase().includes(query.toLowerCase()) ||
        client?.name.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'all' || p.status === status;
      const matchesOwner = owner === 'all' || p.owner === owner;
      const matchesService = service === 'all' || p.service === service;
      return matchesQuery && matchesStatus && matchesOwner && matchesService;
    });
    if (sort === 'updated') list = [...list].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (sort === 'value') list = [...list].sort((a, b) => computeTotals(b).total - computeTotals(a).total);
    if (sort === 'expiring') list = [...list].sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
    return list;
  }, [scoped, query, status, owner, service, sort]);

  return (
    <div>
      <PageHeader
        eyebrow="Pipeline"
        title="Proposals"
        description={role === 'sales' ? 'Every proposal you own, in one ledger.' : 'Every proposal across the studio.'}
        actions={role !== 'management' && (
          <Link to="/proposals/new"><Button variant="accent">+ New Proposal</Button></Link>
        )}
      />

      <div className="prop-filters">
        <input
          className="prop-search-input"
          placeholder="Search by title, number, or client…"
          value={query}
          onChange={e => { setQuery(e.target.value); setParams({}); }}
        />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_FILTERS.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All statuses' : STATUS_META[s].label}</option>
          ))}
        </select>
        {role !== 'sales' && (
          <select value={owner} onChange={e => setOwner(e.target.value)}>
            <option value="all">All sales executives</option>
            {users.filter(u => u.role === 'sales').map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        )}
        <select value={service} onChange={e => setService(e.target.value)}>
          <option value="all">All services</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="updated">Sort: Recently updated</option>
          <option value="value">Sort: Highest value</option>
          <option value="expiring">Sort: Expiring soon</option>
        </select>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<DocIcon />}
            title="No proposals match these filters"
            description="Try a different search term, or clear filters to see the full pipeline."
            action={<Button variant="secondary" onClick={() => { setQuery(''); setStatus('all'); setOwner('all'); setService('all'); }}>Clear filters</Button>}
          />
        ) : (
          <table className="ui-table prop-table">
            <thead>
              <tr>
                <th>Proposal</th>
                <th>Client</th>
                <th>Status thread</th>
                <th>Owner</th>
                <th>Value</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const client = getClient(p.client);
                const o = getOwner(p.owner);
                const totals = computeTotals(p);
                const isExpiring = p.status === 'sent' && new Date(p.expiresAt) - new Date() < 1000 * 60 * 60 * 24 * 5;
                return (
                  <tr key={p.id} onClick={() => window.location.hash = `#/proposals/${p.id}`}>
                    <td>
                      <div className="prop-cell-title">
                        <span className="mono prop-number">{p.number}</span>
                        <span>{p.title}</span>
                      </div>
                    </td>
                    <td>{client?.name}</td>
                    <td><StatusThread status={p.status} size="sm" /></td>
                    <td><div className="prop-owner"><Avatar user={o} size={24} />{o?.name.split(' ')[0]}</div></td>
                    <td className="mono prop-value">{fmtMoney(totals.total, p.currency)}</td>
                    <td>
                      <span className={`mono prop-expiry ${isExpiring ? 'prop-expiry--soon' : ''}`}>
                        {p.expiresAt}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

function DocIcon() {
  return <svg width="32" height="32" viewBox="0 0 18 18" fill="none"><path d="M4 2h7l3 3v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 8h5M6.5 11h5M6.5 14h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

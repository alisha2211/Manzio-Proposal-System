import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { CLIENTS, computeTotals } from '../data/mockData.js';
import { Card, PageHeader, Button, EmptyState } from '../components/ui.jsx';
import './Clients.css';

export default function Clients() {
  const { proposals } = useApp();
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    return CLIENTS.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.contact.toLowerCase().includes(query.toLowerCase()) ||
      c.industry.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  function clientValue(clientId) {
    return proposals
      .filter(p => p.client === clientId && ['sent', 'approved', 'accepted'].includes(p.status))
      .reduce((sum, p) => sum + computeTotals(p).total, 0);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Relationships"
        title="Clients"
        description="Every company Manzio has proposed work to, with contact details and history."
        actions={<Button variant="accent" onClick={() => setShowAdd(true)}>+ Add Client</Button>}
      />

      <input
        className="prop-search-input"
        style={{ marginBottom: 18, maxWidth: 420 }}
        placeholder="Search clients by name, contact, or industry…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <Card><EmptyState title="No clients found" description="Try a different search term." /></Card>
      ) : (
        <div className="client-grid">
          {filtered.map(c => (
            <Link to={`/clients/${c.id}`} key={c.id} className="client-card-link">
              <Card className="client-card">
                <div className="client-card-top">
                  <div className="client-avatar">{c.name.slice(0, 2).toUpperCase()}</div>
                  <span className="client-industry">{c.industry}</span>
                </div>
                <h3>{c.name}</h3>
                <p className="client-contact">{c.contact} · {c.email}</p>
                <p className="client-address">{c.address}</p>
                <div className="client-card-footer">
                  <span>{c.proposalsCount} proposal{c.proposalsCount !== 1 ? 's' : ''}</span>
                  <span className="mono">₹{clientValue(c.id).toLocaleString('en-IN')}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="ui-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <h2 className="pd-modal-title">Add a new client</h2>
            <p className="pd-modal-desc">This is a demo form — connect it to your backend to persist clients.</p>
            <div className="ui-field" style={{ marginBottom: 12 }}>
              <label>Company name</label>
              <input placeholder="e.g. Acme Pvt Ltd" />
            </div>
            <div className="ui-field" style={{ marginBottom: 12 }}>
              <label>Primary contact</label>
              <input placeholder="Contact person's name" />
            </div>
            <div className="ui-field" style={{ marginBottom: 16 }}>
              <label>Email</label>
              <input placeholder="contact@company.com" />
            </div>
            <div className="pd-modal-actions">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button variant="accent" onClick={() => setShowAdd(false)}>Add Client</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

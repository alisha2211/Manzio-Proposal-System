import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { computeTotals } from '../utils/helpers.js';
import { Card, PageHeader, Button, EmptyState } from '../components/ui.jsx';
import './Clients.css';

export default function Clients() {
  const { proposals, clients, addClient, pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = useMemo(() => {
    return clients.filter(c =>
      (c.name?.toLowerCase() || '').includes(query.toLowerCase()) ||
      (c.contact?.toLowerCase() || '').includes(query.toLowerCase()) ||
      (c.industry?.toLowerCase() || '').includes(query.toLowerCase())
    );
  }, [clients, query]);

  function clientValue(clientId) {
    return proposals
      .filter(p => p.client === clientId && ['sent', 'approved', 'accepted'].includes(p.status))
      .reduce((sum, p) => sum + computeTotals(p).total, 0);
  }

  async function handleAddClient(e) {
    e.preventDefault();
    if (!name.trim()) {
      pushToast('Company name is required.', 'danger');
      return;
    }

    // Check duplicate client name
    const isDuplicate = clients.some(c => c.name.toLowerCase() === name.trim().toLowerCase());
    if (isDuplicate) {
      pushToast('A client with this company name already exists.', 'danger');
      return;
    }

    // Email validation
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        pushToast('Please enter a valid email address.', 'danger');
        return;
      }
    }

    // Phone validation (numbers, space, plus, dashes, parentheses)
    if (phone.trim()) {
      const phoneRegex = /^[0-9+\s()-]{7,20}$/;
      if (!phoneRegex.test(phone.trim())) {
        pushToast('Please enter a valid phone number.', 'danger');
        return;
      }
    }
    
    const clientData = {
      name: name.trim(),
      contact: contact.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
      industry: industry.trim() || null,
      notes: notes.trim() || null,
    };

    const saved = await addClient(clientData);
    if (saved) {
      setShowAdd(false);
      // Reset form
      setName('');
      setContact('');
      setEmail('');
      setPhone('');
      setAddress('');
      setIndustry('');
      setNotes('');
    }
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
        <Card><EmptyState title="No clients found" description="Try a different search term or add a new client." /></Card>
      ) : (
        <div className="client-grid">
          {filtered.map(c => (
            <Link to={`/clients/${c.id}`} key={c.id} className="client-card-link">
              <Card className="client-card">
                <div className="client-card-top">
                  <div className="client-avatar">{(c.name || 'C').slice(0, 2).toUpperCase()}</div>
                  <span className="client-industry">{c.industry || 'General'}</span>
                </div>
                <h3>{c.name}</h3>
                <p className="client-contact">{c.contact || 'No contact'} · {c.email || 'No email'}</p>
                <p className="client-address">{c.address || 'No address'}</p>
                <div className="client-card-footer">
                  <span>{c.proposalsCount || 0} proposal{c.proposalsCount !== 1 ? 's' : ''}</span>
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
            <p className="pd-modal-desc" style={{ marginBottom: 16 }}>Register a new company to enable building proposals for them.</p>
            <form onSubmit={handleAddClient}>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Company name *</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme Pvt Ltd" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Primary contact</label>
                <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact person's name" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@company.com" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +91 99999 88888" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Industry</label>
                <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. SaaS, F&B, Logistics" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Address</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Bengaluru, KA" />
              </div>
              <div className="ui-field" style={{ marginBottom: 16 }}>
                <label>Notes</label>
                <textarea style={{ width: '100%', minHeight: 60, padding: 8, borderRadius: 4, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions or details..." />
              </div>
              <div className="pd-modal-actions">
                <Button variant="ghost" type="button" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button variant="accent" type="submit">Add Client</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

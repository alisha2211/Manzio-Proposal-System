import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { computeTotals, fmtMoney } from '../utils/helpers.js';
import { Card, Button } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import './ClientDetail.css';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, clients, updateClient, removeClient } = useApp();
  const client = clients.find(c => String(c.id) === String(id));

  // Form states for editing
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [notes, setNotes] = useState('');

  if (!client) return <Card style={{ padding: 40 }}>Client not found. <Link to="/clients">Back to clients</Link></Card>;

  const clientProposals = proposals.filter(p => String(p.client) === String(id)).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const totalValue = clientProposals
    .filter(p => ['sent', 'approved', 'accepted'].includes(p.status))
    .reduce((s, p) => s + computeTotals(p).total, 0);
  const accepted = clientProposals.filter(p => p.status === 'accepted').length;

  function openEditModal() {
    setName(client.name || '');
    setContact(client.contact || '');
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setAddress(client.address || '');
    setIndustry(client.industry || '');
    setNotes(client.notes || '');
    setShowEdit(true);
  }

  async function handleEditClient(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const clientData = {
      name: name.trim(),
      contact: contact.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
      industry: industry.trim() || null,
      notes: notes.trim() || null,
    };

    const saved = await updateClient(client.id, clientData);
    if (saved) {
      setShowEdit(false);
    }
  }

  async function handleDeleteClient() {
    if (window.confirm(`Are you sure you want to delete client "${client.name}"? This action cannot be undone.`)) {
      const ok = await removeClient(client.id);
      if (ok) {
        navigate('/clients');
      }
    }
  }

  return (
    <div>
      <div className="pd-breadcrumb"><Link to="/clients">Clients</Link> <span>/</span> <span>{client.name}</span></div>

      <div className="cd-header">
        <div className="client-avatar" style={{ width: 52, height: 52, fontSize: 18 }}>{(client.name || 'C').slice(0, 2).toUpperCase()}</div>
        <div>
          <h1>{client.name}</h1>
          <p className="cd-sub">{client.industry || 'General'} · {client.address || 'No address'}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="secondary" onClick={openEditModal}>Edit Details</Button>
          <Button variant="danger" onClick={handleDeleteClient}>Delete</Button>
          <Link to="/proposals/new"><Button variant="accent">+ New Proposal</Button></Link>
        </div>
      </div>

      <div className="cd-grid">
        <div className="cd-left">
          <Card className="pd-section">
            <h3>Contact</h3>
            <dl className="cd-contact-list">
              <div><dt>Contact person</dt><dd>{client.contact || '—'}</dd></div>
              <div><dt>Email</dt><dd>{client.email || '—'}</dd></div>
              <div><dt>Phone</dt><dd className="mono">{client.phone || '—'}</dd></div>
              <div><dt>Address</dt><dd>{client.address || '—'}</dd></div>
            </dl>
          </Card>

          <Card className="pd-section">
            <h3>Notes</h3>
            <p className="cd-notes">{client.notes || 'No notes added.'}</p>
          </Card>

          <Card className="pd-section">
            <h3>Snapshot</h3>
            <div className="cd-snapshot">
              <div><span>Total proposals</span><span className="mono">{clientProposals.length}</span></div>
              <div><span>Accepted</span><span className="mono">{accepted}</span></div>
              <div><span>Active pipeline value</span><span className="mono">{fmtMoney(totalValue)}</span></div>
            </div>
          </Card>
        </div>

        <div className="cd-right">
          <Card className="pd-section">
            <h3>Proposal history</h3>
            {clientProposals.length === 0 ? (
              <p className="cd-notes">No proposals yet for this client.</p>
            ) : (
              <div className="cd-proposal-list">
                {clientProposals.map(p => {
                  const totals = computeTotals(p);
                  return (
                    <Link to={`/proposals/${p.id}`} key={p.id} className="cd-proposal-row">
                      <div className="cd-proposal-main">
                        <span className="mono cd-proposal-number">{p.number}</span>
                        <span className="cd-proposal-title">{p.title}</span>
                      </div>
                      <StatusThread status={p.status} size="sm" />
                      <div className="cd-proposal-end">
                        <span className="mono">{fmtMoney(totals.total, p.currency)}</span>
                        <StatusBadge status={p.status} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {showEdit && (
        <div className="ui-modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <h2 className="pd-modal-title">Edit client details</h2>
            <p className="pd-modal-desc" style={{ marginBottom: 16 }}>Update demographic and contact details for {client.name}.</p>
            <form onSubmit={handleEditClient}>
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
                <Button variant="ghost" type="button" onClick={() => setShowEdit(false)}>Cancel</Button>
                <Button variant="accent" type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

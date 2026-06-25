import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { CLIENTS, computeTotals, fmtMoney } from '../data/mockData.js';
import { Card, Button } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import './ClientDetail.css';

export default function ClientDetail() {
  const { id } = useParams();
  const { proposals } = useApp();
  const client = CLIENTS.find(c => c.id === id);

  if (!client) return <Card style={{ padding: 40 }}>Client not found. <Link to="/clients">Back to clients</Link></Card>;

  const clientProposals = proposals.filter(p => p.client === id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const totalValue = clientProposals
    .filter(p => ['sent', 'approved', 'accepted'].includes(p.status))
    .reduce((s, p) => s + computeTotals(p).total, 0);
  const accepted = clientProposals.filter(p => p.status === 'accepted').length;

  return (
    <div>
      <div className="pd-breadcrumb"><Link to="/clients">Clients</Link> <span>/</span> <span>{client.name}</span></div>

      <div className="cd-header">
        <div className="client-avatar" style={{ width: 52, height: 52, fontSize: 18 }}>{client.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <h1>{client.name}</h1>
          <p className="cd-sub">{client.industry} · {client.address}</p>
        </div>
        <Link to="/proposals/new" style={{ marginLeft: 'auto' }}><Button variant="accent">+ New Proposal</Button></Link>
      </div>

      <div className="cd-grid">
        <div className="cd-left">
          <Card className="pd-section">
            <h3>Contact</h3>
            <dl className="cd-contact-list">
              <div><dt>Contact person</dt><dd>{client.contact}</dd></div>
              <div><dt>Email</dt><dd>{client.email}</dd></div>
              <div><dt>Phone</dt><dd className="mono">{client.phone}</dd></div>
              <div><dt>Address</dt><dd>{client.address}</dd></div>
            </dl>
          </Card>

          <Card className="pd-section">
            <h3>Notes</h3>
            <p className="cd-notes">{client.notes}</p>
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
    </div>
  );
}

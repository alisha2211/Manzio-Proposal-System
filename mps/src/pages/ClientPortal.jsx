import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { getClient, computeTotals, fmtMoney } from '../data/mockData.js';
import { Card, Button } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import ProposalPdfPreview from '../components/ProposalPdfPreview.jsx';
import './ClientPortal.css';

export default function ClientPortal() {
  const { proposals, pushToast } = useApp();
  const sentProposals = proposals.filter(p => ['sent', 'accepted', 'rejected'].includes(p.status));
  const [activeId, setActiveId] = useState(sentProposals[0]?.id || null);
  const [comment, setComment] = useState('');
  const [showRequestChanges, setShowRequestChanges] = useState(false);

  const active = proposals.find(p => p.id === activeId);
  const client = active ? getClient(active.client) : null;
  const totals = active ? computeTotals(active) : null;

  return (
    <div className="portal-page">
      <div className="portal-intro">
        <h1>Client Portal — Preview</h1>
        <p>This is what {client?.contact || 'your client'} sees when they open a proposal link. It's a live simulation, not a separate login — useful for QA before sending real proposals.</p>
      </div>

      <div className="portal-shell">
        <div className="portal-frame">
          <div className="portal-frame-bar">
            <span className="portal-frame-dot" /><span className="portal-frame-dot" /><span className="portal-frame-dot" />
            <span className="mono portal-frame-url">portal.manzio.studio/p/{active?.number.toLowerCase()}</span>
          </div>

          {!active ? (
            <div className="portal-empty">No sent proposals yet to preview.</div>
          ) : (
            <div className="portal-body">
              <header className="portal-header">
                <div className="portal-logo">M</div>
                <div>
                  <span className="portal-brand">Manzio</span>
                  <span className="portal-brand-sub">Proposal for {client?.name}</span>
                </div>
              </header>

              <div className="portal-status-row">
                <StatusThread status={active.status} size="md" />
                <StatusBadge status={active.status} />
              </div>

              <div className="portal-grid">
                <div className="portal-main">
                  <h2>{active.title}</h2>
                  <p className="portal-sub">Proposal {active.number} · Valid until {active.expiresAt}</p>

                  <div className="portal-pdf-wrap">
                    <ProposalPdfPreview proposal={active} client={client} totals={totals} />
                  </div>

                  {active.status === 'sent' && (
                    <div className="portal-cta">
                      <Button variant="success" onClick={() => pushToast('Client accepted the proposal (demo).', 'success')}>Accept Proposal</Button>
                      <Button variant="danger" onClick={() => pushToast('Client rejected the proposal (demo).', 'danger')}>Reject</Button>
                      <Button variant="secondary" onClick={() => setShowRequestChanges(true)}>Request Changes</Button>
                      <Button variant="ghost" onClick={() => pushToast('PDF downloaded (demo).')}>Download PDF</Button>
                    </div>
                  )}
                  {active.status === 'accepted' && (
                    <div className="portal-decision portal-decision--accepted">✓ You accepted this proposal on {active.acceptedAt}.</div>
                  )}
                  {active.status === 'rejected' && (
                    <div className="portal-decision portal-decision--rejected">This proposal was declined.</div>
                  )}

                  {showRequestChanges && (
                    <div className="portal-comment-box">
                      <label>What would you like changed?</label>
                      <textarea rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="e.g. Could we get an itemised breakdown of the support hours?" />
                      <div className="portal-comment-actions">
                        <Button variant="ghost" size="sm" onClick={() => setShowRequestChanges(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={() => { setShowRequestChanges(false); setComment(''); pushToast('Change request sent to Manzio (demo).'); }}>Send Request</Button>
                      </div>
                    </div>
                  )}
                </div>

                <aside className="portal-side">
                  <div className="portal-side-card">
                    <span className="portal-side-label">Prepared by</span>
                    <p>Manzio Studio</p>
                    <p className="portal-dim">hello@manzio.studio</p>
                  </div>
                  <div className="portal-side-card">
                    <span className="portal-side-label">Total</span>
                    <p className="mono portal-total">{fmtMoney(totals.total, active.currency)}</p>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>

        {sentProposals.length > 0 && (
          <div className="portal-switcher">
            <span className="portal-switcher-label">Preview a different proposal</span>
            {sentProposals.map(p => (
              <button key={p.id} className={`portal-switcher-item ${activeId === p.id ? 'is-active' : ''}`} onClick={() => setActiveId(p.id)}>
                <span className="mono">{p.number}</span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { computeTotals, fmtMoney } from '../utils/helpers.js';
import { Button } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import ProposalPdfPreview from '../components/ProposalPdfPreview.jsx';
import './ClientPortal.css';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from './pdf/ProposalV2.jsx';

export default function ClientPortal() {
  const { proposals, clients, updateProposalStatus, pushToast, settings } = useApp();
  const sentProposals = proposals.filter(p => ['sent', 'accepted', 'rejected'].includes(p.status));
  const [activeId, setActiveId] = useState(sentProposals[0]?.id || null);
  const [comment, setComment] = useState('');
  const [showRequestChanges, setShowRequestChanges] = useState(false);
  const [acting, setActing] = useState(false);

  const active = proposals.find(p => p.id === activeId);

  // Resolve client from live clients list
  const client = active
    ? (active.client === 'custom'
        ? active.customClient
        : clients.find(c => String(c.id) === String(active.client)) || null)
    : null;

  const totals = active ? computeTotals(active) : null;

  async function handleAccept() {
    if (!active || acting) return;
    setActing(true);
    await updateProposalStatus(active.id, 'accepted', 'Proposal accepted by client.');
    setActing(false);
  }

  async function handleReject() {
    if (!active || acting) return;
    setActing(true);
    await updateProposalStatus(active.id, 'rejected', 'Proposal rejected by client.');
    setActing(false);
  }

  async function handleRequestChanges() {
    if (!comment.trim()) {
      pushToast('Please describe what you would like changed.', 'danger');
      return;
    }
    if (!active || acting) return;
    setActing(true);
    await updateProposalStatus(active.id, 'revision', `Change request: ${comment.trim()}`);
    setShowRequestChanges(false);
    setComment('');
    setActing(false);
  }

  return (
    <div className="portal-page">
      <div className="portal-intro">
        <h1>Client Portal — Preview</h1>
        <p>This is how your client views their proposal. Use this view to review the layout and approve actions before sending.</p>
      </div>

      <div className="portal-shell">
        <div className="portal-frame">
          <div className="portal-frame-bar">
            <span className="portal-frame-dot" /><span className="portal-frame-dot" /><span className="portal-frame-dot" />
            <span className="mono portal-frame-url">portal.manzio.studio/p/{active?.number?.toLowerCase()}</span>
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
                    <ProposalPdfPreview proposal={active} client={client} totals={totals} settings={settings} />
                  </div>

                  {active.status === 'sent' && (
                    <div className="portal-cta">
                      <Button variant="success" disabled={acting} onClick={handleAccept}>
                        {acting ? 'Processing…' : 'Accept Proposal'}
                      </Button>
                      <Button variant="danger" disabled={acting} onClick={handleReject}>
                        {acting ? 'Processing…' : 'Reject'}
                      </Button>
                      <Button variant="secondary" onClick={() => setShowRequestChanges(true)}>
                        Request Changes
                      </Button>
                      <PDFDownloadLink
                        key={`${active.id}-${active.title}-${totals?.total}`}
                        document={
                          <ProposalPDF
                            proposal={active}
                            client={client}
                            totals={totals}
                            settings={settings}
                          />
                        }
                        fileName={`Manzio-${(active.number || active.id || 'Proposal').replace(/[^a-z0-9]/gi, '_')}.pdf`}
                        style={{ textDecoration: 'none' }}
                      >
                        {({ loading }) => (
                          <Button variant="ghost">
                            {loading ? 'Preparing PDF...' : 'Download PDF'}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    </div>
                  )}

                  {active.status === 'accepted' && (
                    <div className="portal-decision portal-decision--accepted">✓ This proposal has been accepted.</div>
                  )}
                  {active.status === 'rejected' && (
                    <div className="portal-decision portal-decision--rejected">This proposal was declined.</div>
                  )}
                  {active.status === 'revision' && (
                    <div className="portal-decision portal-decision--revision">📝 Change request submitted. Awaiting revision from Manzio.</div>
                  )}

                  {showRequestChanges && (
                    <div className="portal-comment-box">
                      <label>What would you like changed?</label>
                      <textarea
                        rows={3}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="e.g. Could we get an itemised breakdown of the support hours?"
                      />
                      <div className="portal-comment-actions">
                        <Button variant="ghost" size="sm" onClick={() => { setShowRequestChanges(false); setComment(''); }}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" disabled={acting} onClick={handleRequestChanges}>
                          {acting ? 'Sending…' : 'Send Request'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <aside className="portal-side">
                  <div className="portal-side-card">
                    <span className="portal-side-label">Prepared by</span>
                    <p>Manzio Creative Studio</p>
                    <p className="portal-dim">hello@manzio.studio</p>
                  </div>
                  <div className="portal-side-card">
                    <span className="portal-side-label">Total</span>
                    <p className="mono portal-total">{fmtMoney(totals?.total, active.currency)}</p>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>

        {sentProposals.length > 0 && (
          <div className="portal-switcher">
            <span className="portal-switcher-label">Preview a different proposal</span>
            <div className="portal-switcher-list">
              {sentProposals.map(p => (
                <button key={p.id} className={`portal-switcher-item ${activeId === p.id ? 'is-active' : ''}`} onClick={() => setActiveId(p.id)}>
                  <span className="mono">{p.number}</span>
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

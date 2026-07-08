import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fmtMoney, computeTotals } from '../utils/helpers.js';
import { Card, Button, Avatar } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import ProposalPdfPreview from '../components/ProposalPdfPreview.jsx';
import './ProposalDetail.css';

import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from './pdf/ProposalV2.jsx';

export default function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, clients, role, currentUser, updateProposalStatus, removeProposal, duplicateProposal, sendProposal, pushToast, settings, users } = useApp();
  const [showShare, setShowShare] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [showReject, setShowReject] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this proposal? This action cannot be undone.")) {
      await removeProposal(proposal.id);
      navigate('/proposals');
    }
  };

  const proposal = proposals.find(p => p.id === id);
  if (!proposal) return <Card style={{ padding: 40 }}>Proposal not found. <Link to="/proposals">Back to proposals</Link></Card>;

  // Resolve client from live context (DB IDs are numeric, use loose ==)
  const client = proposal.client === 'custom'
    ? proposal.customClient
    : clients.find(c => String(c.id) === String(proposal.client)) || null;
  const owner = users.find(u => String(u.id) === String(proposal.owner)) || { name: 'Unknown', avatarColor: '#94A3B8' };
  const totals = computeTotals(proposal);
  const isOwner = proposal.owner === currentUser?.id;
  const canEdit = proposal.status === 'draft' && (role === 'admin' || role === 'management' || isOwner);
  const canSubmit = canEdit;
  const canApprove = (role === 'admin' || role === 'management') && proposal.status === 'pending';
  const canSend = (role === 'admin' || role === 'management' || isOwner) && proposal.status === 'approved';
  const canMarkAccepted = (role === 'admin' || role === 'management' || isOwner) && proposal.status === 'sent';

  const handleDuplicate = async () => {
    const saved = await duplicateProposal(proposal.id);
    if (saved) {
      navigate(`/proposals/${saved.id}`);
    }
  };

  async function handleAction(action) {
    switch (action) {
      case 'submit':
        updateProposalStatus(proposal.id, 'pending');
        pushToast('Submitted for approval.');
        break;
      case 'approve':
        updateProposalStatus(proposal.id, 'approved');
        pushToast('Proposal approved.', 'success');
        break;
      case 'reject':
        updateProposalStatus(proposal.id, 'rejected', rejectNote || 'No reason provided.');
        pushToast('Proposal rejected.', 'danger');
        setShowReject(false);
        setRejectNote('');
        break;
      case 'send':
        await sendProposal(proposal.id);
        break;
      case 'accepted':
        updateProposalStatus(proposal.id, 'accepted');
        pushToast('Marked as accepted by client.', 'success');
        break;
      case 'cancel':
        updateProposalStatus(proposal.id, 'cancelled');
        pushToast('Proposal cancelled.');
        break;
      default: break;
    }
  }

  const shareLink = `https://portal.manzio.studio/p/${proposal.number.toLowerCase()}`;

  return (
    <div className="pd-page">
      <div className="pd-breadcrumb">
        <Link to="/proposals">Proposals</Link> <span>/</span> <span className="mono">{proposal.number}</span>
      </div>

      <div className="pd-header">
        <div>
          <div className="pd-header-top">
            <span className="mono pd-number">{proposal.number}</span>
            <StatusBadge status={proposal.status} />
          </div>
          <h1>{proposal.title}</h1>
          <div className="pd-meta">
            <span>{client?.name}</span>
            <span className="dot">·</span>
            <span>{proposal.service}</span>
            <span className="dot">·</span>
            <div className="pd-owner"><Avatar user={owner} size={20} />{owner?.name}</div>
          </div>
        </div>
        <div className="pd-actions">
          <Button variant="secondary" onClick={handleDuplicate}>Duplicate</Button>
          {canEdit && <Link to={`/proposals/${proposal.id}/edit`}><Button variant="secondary">Edit</Button></Link>}
          {canSubmit && <Button variant="primary" onClick={() => handleAction('submit')}>Submit for Approval</Button>}
          {canApprove && (
            <>
              <Button variant="danger" onClick={() => setShowReject(true)}>Reject</Button>
              <Button variant="success" onClick={() => handleAction('approve')}>Approve</Button>
            </>
          )}
          {canSend && <Button variant="accent" onClick={() => { setShareEmail(client?.email || ''); setShowShare(true); }}>Share &amp; Send</Button>}
          {canMarkAccepted && <Button variant="success" onClick={() => handleAction('accepted')}>Mark Client Accepted</Button>}
          {['draft', 'pending', 'approved'].includes(proposal.status) && (role === 'admin' || role === 'management' || isOwner) && (
            <Button variant="ghost" onClick={() => handleAction('cancel')}>Cancel</Button>
          )}
          {(role === 'admin' || role === 'management' || isOwner) && (
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          )}
        </div>
      </div>

      <Card className="pd-thread-card">
        <StatusThread status={proposal.status} size="lg" />
      </Card>

      <div className="pd-grid">
        {/* LEFT: details + activity */}
        <div className="pd-left">
          <Card className="pd-section">
            <h3>Scope &amp; Line Items</h3>
            <table className="pd-items-table">
              <thead>
                <tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {proposal.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.desc}</td>
                    <td className="mono">{it.qty}</td>
                    <td className="mono">{fmtMoney(it.rate, proposal.currency)}</td>
                    <td className="mono">{fmtMoney(it.qty * it.rate, proposal.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pd-totals">
              <div><span>Subtotal</span><span className="mono">{fmtMoney(totals.subtotal, proposal.currency)}</span></div>
              {proposal.discount > 0 && (
                <div><span>Discount ({(proposal.discount * 100).toFixed(0)}%)</span><span className="mono">−{fmtMoney(totals.discountAmt, proposal.currency)}</span></div>
              )}
              {proposal.tax > 0 && (
                <div><span>Tax ({(proposal.tax * 100).toFixed(0)}%)</span><span className="mono">{fmtMoney(totals.taxAmt, proposal.currency)}</span></div>
              )}
              <div className="pd-total-row"><span>Total</span><span className="mono">{fmtMoney(totals.total, proposal.currency)}</span></div>
            </div>
          </Card>

          <Card className="pd-section">
            <h3>Approval &amp; Activity History</h3>
            <ul className="pd-activity">
              {proposal.activity.map((a, i) => (
                <li key={i}>
                  <span className="pd-activity-dot" />
                  <div>
                    <p><strong>{a.label}</strong></p>
                    <span className="pd-activity-meta">{a.by} · {a.at}</span>
                    {a.note && <p className="pd-activity-note">"{a.note}"</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="pd-section">
            <h3>Tracking</h3>
            <div className="pd-tracking">
              <div><span className="pd-tracking-label">Times opened</span><span className="mono pd-tracking-value">{proposal.views}</span></div>
              <div><span className="pd-tracking-label">Last viewed</span><span className="mono pd-tracking-value">{proposal.lastViewed || '—'}</span></div>
              <div><span className="pd-tracking-label">Expires on</span><span className="mono pd-tracking-value">{proposal.expiresAt}</span></div>
            </div>
          </Card>
        </div>

        {/* RIGHT: PDF preview */}
        <div className="pd-right">
          <div className="pd-preview-sticky">
            <div className="pd-preview-label">Proposal PDF preview</div>
            <ProposalPdfPreview proposal={proposal} client={client} totals={totals} settings={settings} />
            <div className="pd-preview-actions">
              <BlobProvider
                document={
                  <ProposalPDF
                    proposal={proposal}
                    client={client}
                    totals={totals}
                    settings={settings}
                  />
                }
              >
                {({ blob, url, loading }) => {
                  const pdfName = `Manzio-${(proposal.number || 'Proposal').replace(/[^a-z0-9]/gi, '_')}.pdf`;

                  // ⬇ Download: trigger direct local download of the generated PDF blob
                  const handleDownload = () => {
                    if (!blob) return;
                    const href = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = href;
                    link.download = pdfName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(href);
                  };

                  // 👁 View: open blob directly in new tab — no server, no UUID URL
                  const handleView = () => {
                    if (!blob) return;
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                    // Revoke after a short delay to allow the new tab to load
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
                  };

                  return (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={loading}
                        onClick={handleView}
                      >
                        {loading ? 'Generating PDF...' : '👁 View PDF'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                        onClick={handleDownload}
                      >
                        {loading ? '...' : '⬇ Download PDF'}
                      </Button>
                    </>
                  );
                }}
              </BlobProvider>
              <Button variant="ghost" size="sm" onClick={() => {
                navigator.clipboard.writeText(shareLink);
                pushToast('Link copied to clipboard.');
              }}>Copy share link</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {showReject && (
        <div className="ui-modal-overlay" onClick={() => setShowReject(false)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <h2 className="pd-modal-title">Reject this proposal?</h2>
            <p className="pd-modal-desc">Add a comment so {owner?.name.split(' ')[0]} knows what to revise.</p>
            <textarea
              className="pd-modal-textarea"
              rows={4}
              placeholder="e.g. Margin is too thin on the dev line item — revise before resubmitting."
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
            />
            <div className="pd-modal-actions">
              <Button variant="ghost" onClick={() => setShowReject(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleAction('reject')}>Reject Proposal</Button>
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShare && (
        <div className="ui-modal-overlay" onClick={() => setShowShare(false)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <h2 className="pd-modal-title">Share with {client?.name || 'Client'}</h2>
            <p className="pd-modal-desc">This sends an email with a secure portal link and marks the proposal as Sent.</p>
            <div className="ui-field" style={{ marginBottom: 12 }}>
              <label>CLIENT EMAIL</label>
              <input
                type="email"
                placeholder="Enter client email address"
                value={shareEmail}
                onChange={e => setShareEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="ui-field" style={{ marginBottom: 12 }}>
              <label>SECURE LINK</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={shareLink} readOnly className="mono" style={{ flex: 1 }} />
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(shareLink); pushToast('Link copied!', 'success'); }}>Copy</Button>
              </div>
            </div>
            <div className="pd-modal-actions">
              <Button variant="ghost" onClick={() => setShowShare(false)}>Cancel</Button>
              <Button
                variant="accent"
                disabled={!shareEmail.trim()}
                onClick={() => {
                  if (!shareEmail.trim()) return;
                  handleAction('send');
                  setShowShare(false);
                }}
              >
                Send Proposal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

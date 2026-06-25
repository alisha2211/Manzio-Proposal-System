import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fmtMoney, computeTotals, getClient, getOwner } from '../data/mockData.js';
import { Card, Button, Avatar } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import ProposalPdfPreview from '../components/ProposalPdfPreview.jsx';
import './ProposalDetail.css';

export default function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, role, currentUser, updateProposalStatus, pushToast } = useApp();
  const [showShare, setShowShare] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showReject, setShowReject] = useState(false);

  const proposal = proposals.find(p => p.id === id);
  if (!proposal) return <Card style={{ padding: 40 }}>Proposal not found. <Link to="/proposals">Back to proposals</Link></Card>;

  const client = getClient(proposal.client);
  const owner = getOwner(proposal.owner);
  const totals = computeTotals(proposal);
  const isOwner = proposal.owner === currentUser.id;
  const canEdit = role !== 'management' && proposal.status === 'draft' && (role === 'admin' || isOwner);
  const canSubmit = canEdit;
  const canApprove = (role === 'admin' || role === 'management') && proposal.status === 'pending';
  const canSend = (role === 'admin' || isOwner) && proposal.status === 'approved';
  const canMarkAccepted = (role === 'admin' || isOwner) && proposal.status === 'sent';

  function handleAction(action) {
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
        updateProposalStatus(proposal.id, 'sent');
        pushToast('Proposal sent to client.', 'success');
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
          {canEdit && <Link to={`/proposals/${proposal.id}/edit`}><Button variant="secondary">Edit</Button></Link>}
          {canSubmit && <Button variant="primary" onClick={() => handleAction('submit')}>Submit for Approval</Button>}
          {canApprove && (
            <>
              <Button variant="danger" onClick={() => setShowReject(true)}>Reject</Button>
              <Button variant="success" onClick={() => handleAction('approve')}>Approve</Button>
            </>
          )}
          {canSend && <Button variant="accent" onClick={() => setShowShare(true)}>Share &amp; Send</Button>}
          {canMarkAccepted && <Button variant="success" onClick={() => handleAction('accepted')}>Mark Client Accepted</Button>}
          {['draft', 'pending', 'approved'].includes(proposal.status) && (role === 'admin' || isOwner) && (
            <Button variant="ghost" onClick={() => handleAction('cancel')}>Cancel</Button>
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
            <ProposalPdfPreview proposal={proposal} client={client} totals={totals} />
            <div className="pd-preview-actions">
              <Button variant="secondary" size="sm" onClick={() => pushToast('PDF downloaded (demo).')}>Download PDF</Button>
              <Button variant="ghost" size="sm" onClick={() => pushToast('Link copied to clipboard.')}>Copy share link</Button>
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
            <h2 className="pd-modal-title">Share with {client?.contact}</h2>
            <p className="pd-modal-desc">This sends an email with a secure portal link and marks the proposal as Sent.</p>
            <div className="ui-field" style={{ marginBottom: 12 }}>
              <label>Client email</label>
              <input value={client?.email} readOnly />
            </div>
            <div className="ui-field" style={{ marginBottom: 12 }}>
              <label>Secure link</label>
              <input value={shareLink} readOnly className="mono" />
            </div>
            <div className="pd-modal-actions">
              <Button variant="ghost" onClick={() => setShowShare(false)}>Cancel</Button>
              <Button variant="accent" onClick={() => { handleAction('send'); setShowShare(false); }}>Send Proposal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

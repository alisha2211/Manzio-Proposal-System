import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getClient, getOwner, computeTotals, fmtMoney } from '../data/mockData.js';
import { Card, PageHeader, Button, Avatar, EmptyState } from '../components/ui.jsx';
import './Approvals.css';

export default function Approvals() {
  const { proposals, updateProposalStatus, pushToast } = useApp();
  const [rejectingId, setRejectingId] = useState(null);
  const [note, setNote] = useState('');

  const pending = proposals.filter(p => p.status === 'pending');
  const recentDecisions = proposals
    .filter(p => ['approved', 'rejected'].includes(p.status))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  function approve(id) {
    updateProposalStatus(id, 'approved');
    pushToast('Proposal approved.', 'success');
  }
  function reject(id) {
    updateProposalStatus(id, 'rejected', note || 'No reason provided.');
    pushToast('Proposal rejected.', 'danger');
    setRejectingId(null);
    setNote('');
  }

  return (
    <div>
      <PageHeader
        eyebrow="Management"
        title="Approvals"
        description="Proposals waiting on your sign-off before they can be sent to a client."
      />

      {pending.length === 0 ? (
        <Card><EmptyState title="Nothing waiting on you" description="Every proposal in the pipeline has already been reviewed." /></Card>
      ) : (
        <div className="appr-list">
          {pending.map(p => {
            const client = getClient(p.client);
            const owner = getOwner(p.owner);
            const totals = computeTotals(p);
            return (
              <Card className="appr-card" key={p.id}>
                <div className="appr-card-main">
                  <div className="appr-card-head">
                    <span className="mono appr-number">{p.number}</span>
                    <span className="appr-waiting">Waiting {daysSince(p.updatedAt)}</span>
                  </div>
                  <Link to={`/proposals/${p.id}`} className="appr-title">{p.title}</Link>
                  <div className="appr-meta">
                    <span>{client?.name}</span>
                    <span className="dot">·</span>
                    <div className="appr-owner"><Avatar user={owner} size={20} />{owner?.name}</div>
                    <span className="dot">·</span>
                    <span className="mono">{fmtMoney(totals.total, p.currency)}</span>
                  </div>
                </div>
                <div className="appr-actions">
                  <Button variant="danger" size="sm" onClick={() => setRejectingId(p.id)}>Reject</Button>
                  <Button variant="success" size="sm" onClick={() => approve(p.id)}>Approve</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="appr-recent">
        <h3>Recent decisions</h3>
        <div className="appr-recent-list">
          {recentDecisions.map(p => (
            <Link to={`/proposals/${p.id}`} key={p.id} className="appr-recent-row">
              <span className="mono">{p.number}</span>
              <span className="appr-recent-title">{p.title}</span>
              <span className={`appr-decision appr-decision--${p.status}`}>{p.status === 'approved' ? 'Approved' : 'Rejected'}</span>
            </Link>
          ))}
        </div>
      </Card>

      {rejectingId && (
        <div className="ui-modal-overlay" onClick={() => setRejectingId(null)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <h2 className="pd-modal-title">Reject this proposal?</h2>
            <p className="pd-modal-desc">Leave a comment for the Sales Executive.</p>
            <textarea
              className="pd-modal-textarea"
              rows={4}
              placeholder="What needs to change before this can be resubmitted?"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <div className="pd-modal-actions">
              <Button variant="ghost" onClick={() => setRejectingId(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => reject(rejectingId)}>Reject Proposal</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function daysSince(dateStr) {
  const diff = Math.round((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return 'today';
  if (diff === 1) return '1 day';
  return `${diff} days`;
}

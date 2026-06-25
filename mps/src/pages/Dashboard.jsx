import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fmtMoney, computeTotals, getClient, monthlySeries, STATUS_META } from '../data/mockData.js';
import { Card, PageHeader, Button } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import './Dashboard.css';
import api from "../services/api";

export default function Dashboard() {
  useEffect(() => {
    api.get("/proposals")
      .then((response) => {
        console.log("Backend Data:", response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  const { proposals, currentUser, role } = useApp();

  const stats = React.useMemo(() => {
    const byStatus = (s) => proposals.filter(p => p.status === s).length;
    const totalValue = proposals
      .filter(p => ['sent', 'approved', 'accepted'].includes(p.status))
      .reduce((sum, p) => sum + computeTotals(p).total, 0);
    return {
      total: proposals.length,
      draft: byStatus('draft'),
      pending: byStatus('pending'),
      sent: byStatus('sent'),
      accepted: byStatus('accepted'),
      rejected: byStatus('rejected') + byStatus('expired'),
      totalValue,
    };
  }, [proposals]);

  const recent = React.useMemo(() => {
    return [...proposals].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);
  }, [proposals]);

  const activity = React.useMemo(() => {
    const all = proposals.flatMap(p => p.activity.map(a => ({ ...a, proposal: p.number, proposalId: p.id })));
    return all.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 8);
  }, [proposals]);

  const data = monthlySeries();

  return (
    <div>
      <PageHeader
        eyebrow={`MZ · ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
        title={`Good to see you, ${currentUser.name.split(' ')[0]}.`}
        description={
          role === 'management'
            ? 'Here is where every proposal in the pipeline currently stands.'
            : 'Here is the state of your pipeline across every client.'
        }
        actions={role !== 'management' && (
          <Link to="/proposals/new"><Button variant="accent">+ New Proposal</Button></Link>
        )}
      />

      {/* ---- Ledger stat strip — the signature dashboard treatment ---- */}
      <Card className="stat-strip">
        <div className="stat-strip-item">
          <span className="stat-strip-label">Total Proposals</span>
          <span className="stat-strip-value mono">{stats.total}</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-label" style={{ color: STATUS_META.draft.color }}>Draft</span>
          <span className="stat-strip-value mono">{stats.draft}</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-label" style={{ color: STATUS_META.pending.color }}>Pending</span>
          <span className="stat-strip-value mono">{stats.pending}</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-label" style={{ color: STATUS_META.sent.color }}>Sent</span>
          <span className="stat-strip-value mono">{stats.sent}</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-label" style={{ color: STATUS_META.accepted.color }}>Accepted</span>
          <span className="stat-strip-value mono">{stats.accepted}</span>
        </div>
        <div className="stat-strip-item">
          <span className="stat-strip-label" style={{ color: 'var(--red)' }}>Rejected / Expired</span>
          <span className="stat-strip-value mono">{stats.rejected}</span>
        </div>
        <div className="stat-strip-item stat-strip-item--accent">
          <span className="stat-strip-label">Pipeline Value</span>
          <span className="stat-strip-value mono">{fmtMoney(stats.totalValue)}</span>
        </div>
      </Card>

      <div className="dash-grid">
        {/* ---- Chart ---- */}
        <Card className="dash-chart-card">
          <div className="dash-card-header">
            <h3>Sent vs. Accepted</h3>
            <span className="dash-card-sub">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B8DEF" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#5B8DEF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4D2E" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#FF4D2E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#EDEBE3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A8F98' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8A8F98' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ borderRadius: 6, border: '1px solid #DEDAD0', fontSize: 12, fontFamily: 'Inter' }}
              />
              <Area type="monotone" dataKey="sent" stroke="#5B8DEF" strokeWidth={2} fill="url(#sentGrad)" name="Sent" />
              <Area type="monotone" dataKey="accepted" stroke="#FF4D2E" strokeWidth={2} fill="url(#accGrad)" name="Accepted" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="dash-legend">
            <span><i style={{ background: '#5B8DEF' }} /> Sent</span>
            <span><i style={{ background: '#FF4D2E' }} /> Accepted</span>
          </div>
        </Card>

        {/* ---- Activity feed ---- */}
        <Card className="dash-activity-card">
          <div className="dash-card-header">
            <h3>Recent Activity</h3>
          </div>
          <ul className="activity-list">
            {activity.map((a, i) => (
              <li key={i}>
                <span className="activity-dot" />
                <div className="activity-body">
                  <p><strong>{a.label}</strong> <span className="mono activity-prop">{a.proposal}</span></p>
                  <span className="activity-meta">{a.by} · {a.at}</span>
                  {a.note && <span className="activity-note">"{a.note}"</span>}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ---- Recent proposals table ---- */}
      <Card className="dash-recent-card">
        <div className="dash-card-header">
          <h3>Recently Updated Proposals</h3>
          <Link to="/proposals" className="dash-card-link">View all →</Link>
        </div>
        <div className="recent-list">
          {recent.map(p => {
            const client = getClient(p.client);
            const totals = computeTotals(p);
            return (
              <Link to={`/proposals/${p.id}`} key={p.id} className="recent-row">
                <div className="recent-row-main">
                  <span className="mono recent-number">{p.number}</span>
                  <span className="recent-title">{p.title}</span>
                  <span className="recent-client">{client?.name}</span>
                </div>
                <div className="recent-row-thread">
                  <StatusThread status={p.status} size="sm" />
                </div>
                <div className="recent-row-end">
                  <span className="mono recent-value">{fmtMoney(totals.total, p.currency)}</span>
                  <StatusBadge status={p.status} />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

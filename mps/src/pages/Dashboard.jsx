import { useEffect, useMemo } from "react";
import StatTile from '../components/StatTile.jsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { fmtMoney, computeTotals, monthlySeries, STATUS_META } from '../utils/helpers.js';
import { Card, PageHeader, Button } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusThread from '../components/StatusThread.jsx';
import {
  TrendingUp, FileText, CheckCircle, XCircle,
  DollarSign, Clock, ArrowUpRight, ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import './Dashboard.css';
import api from "../services/api";

const STATUS_PIE_COLORS = {
  draft:    '#94A3B8',
  pending:  '#F59E0B',
  approved: '#3B82F6',
  sent:     '#8B5CF6',
  accepted: '#22C55E',
  rejected: '#EF4444',
  expired:  '#F97316',
};

// Custom tooltip for recharts
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="chart-tooltip-val">
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 1000 ? fmtMoney(p.value) : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

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

  const { proposals, clients, currentUser, role } = useApp();

  const getClient = (id) => clients.find(c => String(c.id) === String(id));

  const stats = useMemo(() => {
    const byStatus = (s) => proposals.filter(p => p.status === s).length;
    const totalValue = proposals
      .filter(p => ['sent', 'approved', 'accepted'].includes(p.status))
      .reduce((sum, p) => sum + computeTotals(p).total, 0);
    const acceptedValue = proposals
      .filter(p => p.status === 'accepted')
      .reduce((sum, p) => sum + computeTotals(p).total, 0);
    const closed = proposals.filter(p => ['accepted', 'rejected', 'expired'].includes(p.status));
    const won = proposals.filter(p => p.status === 'accepted');
    const conversionRate = closed.length ? Math.round((won.length / closed.length) * 100) : 0;
    return {
      total: proposals.length,
      draft: byStatus('draft'),
      pending: byStatus('pending'),
      sent: byStatus('sent'),
      accepted: byStatus('accepted'),
      rejected: byStatus('rejected') + byStatus('expired'),
      totalValue,
      acceptedValue,
      conversionRate,
    };
  }, [proposals]);

  const recent = useMemo(() => {
    return [...proposals].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6);
  }, [proposals]);

  const activity = useMemo(() => {
    const all = proposals.flatMap(p => (p.activity || []).map(a => {
      let formattedDate = a.at;
      try {
        if (a.at) {
          const date = new Date(a.at);
          formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        }
      } catch (err) {
        // Fallback
      }
      return { ...a, formattedDate, proposal: p.number, proposalId: p.id };
    }));
    return all.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 8);
  }, [proposals]);

  const chartData = monthlySeries(proposals);

  // Build donut data
  const donutData = Object.entries(STATUS_META)
    .map(([key, meta]) => ({
      name: meta.label,
      value: proposals.filter(p => p.status === key).length,
      color: STATUS_PIE_COLORS[key],
    }))
    .filter(d => d.value > 0);

  const METRIC_CARDS = [
    {
      id: 'total',
      label: 'Total Proposals',
      value: stats.total,
      trend: '+3 this week',
      trendUp: true,
      icon: FileText,
      gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
      glow: 'rgba(37, 99, 235, 0.25)',
    },
    {
      id: 'pipeline',
      label: 'Pipeline Value',
      value: stats.totalValue,
      isMoney: true,
      trend: '+12% this month',
      trendUp: true,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
      glow: 'rgba(124, 58, 237, 0.25)',
    },
    {
      id: 'accepted',
      label: 'Accepted',
      value: stats.accepted,
      trend: `${stats.conversionRate}% win rate`,
      trendUp: stats.conversionRate > 50,
      icon: CheckCircle,
      gradient: 'linear-gradient(135deg, #059669 0%, #22C55E 100%)',
      glow: 'rgba(5, 150, 105, 0.25)',
    },
    {
      id: 'revenue',
      label: 'Revenue Closed',
      value: stats.acceptedValue,
      isMoney: true,
      trend: 'Accepted proposals',
      trendUp: true,
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      glow: 'rgba(217, 119, 6, 0.25)',
    },
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div>
      {/* ---- Premium Greeting Banner ---- */}
      <div className="dash-greeting-banner">
        <div>
          <div className="dash-greeting-eyebrow">
            MZ · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="dash-greeting-title">Good to see you, {currentUser.name.split(' ')[0]}.</h1>
          <p className="dash-greeting-desc">
            {role === 'management'
              ? 'Here is where every proposal in the pipeline currently stands.'
              : 'Here is the state of your pipeline across every client.'}
          </p>
        </div>
        {role !== 'management' && (
          <Link to="/proposals/new">
            <Button variant="accent" icon={<FileText size={15} />}>New Proposal</Button>
          </Link>
        )}
      </div>

      {/* ---- Metric Cards ---- */}
      <motion.div
        className="dash-metric-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {METRIC_CARDS.map(card => {
          const Icon = card.icon;
          return (
            <StatTile
              key={card.id}
              label={card.label}
              value={card.value}
              isMoney={card.isMoney}
              trend={card.trend}
              trendUp={card.trendUp}
              icon={Icon}
              gradient={card.gradient}
              glow={card.glow}
            />
          );
        })}
      </motion.div>

      {/* ---- Charts Row ---- */}
      <div className="dash-charts-row">
        {/* Area Chart */}
        <div className="dash-chart-card">
          <div className="dash-card-header">
            <div>
              <h3>Revenue Trend</h3>
              <span className="dash-card-sub">Sent vs. Accepted — Last 6 months</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="sent" stroke="#4F46E5" strokeWidth={2.5} fill="url(#sentGrad)" name="Sent" dot={false} activeDot={{ r: 5, fill: '#4F46E5', strokeWidth: 0 }} />
              <Area type="monotone" dataKey="accepted" stroke="#10B981" strokeWidth={2.5} fill="url(#accGrad)" name="Accepted" dot={false} activeDot={{ r: 5, fill: '#10B981', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="dash-legend">
            <span><i style={{ background: '#4F46E5' }} /> Sent</span>
            <span><i style={{ background: '#10B981' }} /> Accepted</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="dash-donut-card">
          <div className="dash-card-header">
            <div>
              <h3>Proposal Status</h3>
              <span className="dash-card-sub">Current distribution</span>
            </div>
          </div>
          <div className="dash-donut-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'Inter', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="dash-donut-center">
              <span className="donut-total">{stats.total}</span>
              <span className="donut-label">Total</span>
            </div>
          </div>
          <div className="dash-donut-legend">
            {donutData.map(d => (
              <div key={d.name} className="donut-legend-item">
                <span className="donut-legend-dot" style={{ background: d.color }} />
                <span className="donut-legend-name">{d.name}</span>
                <span className="donut-legend-val">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="dash-activity-card">
          <div className="dash-card-header">
            <div>
              <h3>Recent Activity</h3>
              <span className="dash-card-sub">Latest updates</span>
            </div>
          </div>
          <ul className="activity-list">
            {activity.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="activity-dot" />
                <div className="activity-body">
                  <p><strong>{a.label}</strong> <span className="mono activity-prop">{a.proposal}</span></p>
                  <span className="activity-meta">{a.by} · {a.formattedDate}</span>
                  {a.note && <span className="activity-note">"{a.note}"</span>}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- Recent Proposals Table ---- */}
      <div className="dash-recent-card">
        <div className="dash-card-header">
          <div>
            <h3>Recently Updated Proposals</h3>
            <span className="dash-card-sub">Sorted by last activity</span>
          </div>
          <Link to="/proposals" className="dash-view-all">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="recent-list">
          {recent.map((p, i) => {
            const client = p.client === 'custom' ? p.customClient : getClient(p.client);
            const totals = computeTotals(p);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/proposals/${p.id}`} className="recent-row">
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

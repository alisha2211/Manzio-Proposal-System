import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import { monthlySeries, computeTotals, fmtMoney } from '../utils/helpers.js';
import { Card, PageHeader, Button, AnimatedCounter } from '../components/ui.jsx';
import { TrendingUp, Target, FileText, Download } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import './Reports.css';

const SERVICE_COLORS = [
  '#2563EB', '#7C3AED', '#059669', '#D97706', '#EF4444', '#06B6D4',
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="chart-tooltip-val">
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 1000 ? fmtMoney(p.value) : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function Reports() {
  const { proposals, users, pushToast, reports, addReportLog, removeReportLog } = useApp();
  const data = useMemo(() => monthlySeries(proposals), [proposals]);

  const byService = useMemo(() => {
    const map = {};
    proposals.forEach(p => {
      const totals = computeTotals(p);
      map[p.service] = (map[p.service] || 0) + totals.total;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [proposals]);

  const managementPerf = useMemo(() => {
    return users.filter(u => u.role === 'management' || u.role === 'admin').map(u => {
      const owned = proposals.filter(p => String(p.owner) === String(u.id));
      const accepted = owned.filter(p => p.status === 'accepted').length;
      const value = owned.filter(p => ['sent', 'approved', 'accepted'].includes(p.status))
        .reduce((s, p) => s + computeTotals(p).total, 0);
      return { ...u, owned: owned.length, accepted, value, rate: owned.length ? accepted / owned.length : 0 };
    });
  }, [proposals, users]);

  const overallConversion = useMemo(() => {
    const closed = proposals.filter(p => ['accepted', 'rejected', 'expired'].includes(p.status));
    const won = proposals.filter(p => p.status === 'accepted');
    return closed.length ? Math.round((won.length / closed.length) * 100) : 0;
  }, [proposals]);

  const totalValue = useMemo(() => proposals.reduce((s, p) => s + computeTotals(p).total, 0), [proposals]);
  const acceptedValue = useMemo(() => proposals.filter(p => p.status === 'accepted').reduce((s, p) => s + computeTotals(p).total, 0), [proposals]);

  const METRICS = [
    {
      label: 'Overall Conversion',
      value: overallConversion,
      suffix: '%',
      icon: Target,
      gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)',
      glow: 'rgba(37,99,235,0.25)',
      sub: 'Won / total closed',
    },
    {
      label: 'Total Proposals YTD',
      value: proposals.length,
      icon: FileText,
      gradient: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      glow: 'rgba(124,58,237,0.25)',
      sub: 'All statuses',
    },
    {
      label: 'Pipeline Value',
      value: totalValue / 100000,
      prefix: '₹',
      suffix: 'L',
      decimals: 1,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #D97706, #F59E0B)',
      glow: 'rgba(217,119,6,0.25)',
      sub: 'In-flight & closed',
    },
    {
      label: 'Revenue Closed',
      value: acceptedValue / 100000,
      prefix: '₹',
      suffix: 'L',
      decimals: 1,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #059669, #22C55E)',
      glow: 'rgba(5,150,105,0.25)',
      sub: 'Accepted proposals',
    },
  ];

  async function handleExportPDF() {
    pushToast('Generating PDF report…');
    const name = `Monthly Metrics PDF Report - ${new Date().toLocaleDateString('en-IN')}`;
    await addReportLog(name, 'PDF', { proposalCount: proposals.length, totalValue, acceptedValue });
    window.print();
  }

  async function handleExportCSV() {
    const rows = [['Title', 'Status', 'Total', 'Client', 'Date']];
    proposals.forEach(p => {
      const t = computeTotals(p);
      rows.push([p.title, p.status, t.total, p.client, p.createdAt || '']);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manzio-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    const name = `Proposals Performance CSV Export - ${new Date().toLocaleDateString('en-IN')}`;
    await addReportLog(name, 'CSV', { proposalCount: proposals.length, totalValue, acceptedValue });
    pushToast('Report exported as CSV.');
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Performance"
        title="Reports & Analytics"
        description="Monthly values, conversion rates, and performance across the studio."
        actions={
          <>
            <Button variant="secondary" icon={<Download size={14} />} onClick={handleExportPDF}>
              Export PDF
            </Button>
            <Button variant="secondary" icon={<Download size={14} />} onClick={handleExportCSV}>
              Export CSV
            </Button>
          </>
        }
      />

      {/* ---- Metric Cards ---- */}
      <motion.div
        className="rep-metric-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div key={i} className="rep-metric-card" variants={itemVariants}>
              <div className="rep-metric-top">
                <span className="rep-metric-label">{m.label}</span>
                <div
                  className="rep-metric-icon"
                  style={{ background: m.gradient, boxShadow: `0 6px 20px ${m.glow}` }}
                >
                  <Icon size={16} color="white" />
                </div>
              </div>
              <div className="rep-metric-value">
                {m.prefix}<AnimatedCounter value={m.value} decimals={m.decimals || 0} suffix={m.suffix} />
              </div>
              <div className="rep-metric-sub">{m.sub}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ---- Charts Grid ---- */}
      <div className="rep-charts-grid">
        {/* Bar Chart — Monthly Value */}
        <Card className="rep-chart-card">
          <div className="rep-chart-header">
            <h3>Monthly Proposal Value</h3>
            <span className="rep-chart-sub">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={52} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip content={<CustomTooltip />} formatter={v => fmtMoney(v)} />
              <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Value" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart — Value by Service */}
        <Card className="rep-chart-card">
          <div className="rep-chart-header">
            <h3>Revenue by Service</h3>
            <span className="rep-chart-sub">Value distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byService} dataKey="value" nameKey="name" innerRadius={56} outerRadius={84} paddingAngle={3} startAngle={90} endAngle={-270}>
                {byService.map((entry, i) => (
                  <Cell key={i} fill={SERVICE_COLORS[i % SERVICE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={v => fmtMoney(v)}
                contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'Inter', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="rep-pie-legend">
            {byService.map((s, i) => (
              <div key={s.name} className="rep-legend-item">
                <span className="rep-legend-dot" style={{ background: SERVICE_COLORS[i % SERVICE_COLORS.length] }} />
                <span className="rep-legend-name">{s.name}</span>
                <span className="rep-legend-val">{fmtMoney(s.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ---- Team Performance Table ---- */}
      <Card className="rep-section">
        <div className="rep-chart-header">
          <h3>Team Performance</h3>
          <span className="rep-chart-sub">Manager & Admin metrics</span>
        </div>
        <table className="ui-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Proposals</th>
              <th>Accepted</th>
              <th>Win Rate</th>
              <th>Value In-Flight / Closed</th>
            </tr>
          </thead>
          <tbody>
            {managementPerf.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="rep-sales-user">
                    <span
                      className="rep-sales-avatar"
                      style={{ background: u.avatarColor }}
                    >
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                    <span>{u.name}</span>
                  </div>
                </td>
                <td>
                  <span className="rep-role-badge">
                    {u.role === 'management' ? 'Manager' : u.role === 'sales' ? 'Sales' : 'Super Admin'}
                  </span>
                </td>
                <td className="mono">{u.owned}</td>
                <td className="mono">{u.accepted}</td>
                <td>
                  <div className="rep-bar-cell">
                    <div className="rep-bar-track">
                      <motion.div
                        className="rep-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${u.rate * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        style={{
                          background: u.rate >= 0.6
                            ? 'linear-gradient(90deg, #22C55E, #059669)'
                            : u.rate >= 0.4
                              ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                              : 'linear-gradient(90deg, #EF4444, #DC2626)',
                        }}
                      />
                    </div>
                    <span className="mono rep-bar-pct">{Math.round(u.rate * 100)}%</span>
                  </div>
                </td>
                <td className="mono">{fmtMoney(u.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ---- Saved Reports / Export History Table ---- */}
      <Card className="rep-section" style={{ marginTop: 24 }}>
        <div className="rep-chart-header">
          <h3>Saved Reports &amp; Export History</h3>
          <span className="rep-chart-sub">Logged reports stored in MySQL</span>
        </div>
        {reports.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '24px 0', textAlign: 'center' }}>No reports exported yet.</p>
        ) : (
          <table className="ui-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated By</th>
                <th>Date / Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>
                    <span className={`settings-role-tag`} style={{ background: r.type === 'PDF' ? '#EFF6FF' : '#ECFDF5', color: r.type === 'PDF' ? '#1D4ED8' : '#047857' }}>
                      {r.type}
                    </span>
                  </td>
                  <td>{r.creatorName}</td>
                  <td className="mono">{new Date(r.createdAt).toLocaleString('en-IN')}</td>
                  <td>
                    <Button variant="ghost" style={{ color: 'var(--danger)', padding: '2px 8px', fontSize: 12 }} onClick={() => removeReportLog(r.id)}>
                      Delete Log
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
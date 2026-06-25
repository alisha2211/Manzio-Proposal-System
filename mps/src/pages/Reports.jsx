import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { monthlySeries, computeTotals, fmtMoney, getOwner } from '../data/mockData.js';
import { Card, PageHeader, Button } from '../components/ui.jsx';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import './Reports.css';

const SERVICE_COLORS = {
  'UI/UX Design': '#FF4D2E',
  'Web Design': '#5B8DEF',
  'Software Development': '#1A8754',
  'Marketing': '#C98A1F',
  'CRM Implementation': '#8A8F98',
};

export default function Reports() {
  const { proposals, users, pushToast } = useApp();
  const data = monthlySeries();

  const byService = React.useMemo(() => {
    const map = {};
    proposals.forEach(p => {
      const totals = computeTotals(p);
      map[p.service] = (map[p.service] || 0) + totals.total;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [proposals]);

  const salesPerf = users.filter(u => u.role === 'sales').map(u => {
    const owned = proposals.filter(p => p.owner === u.id);
    const accepted = owned.filter(p => p.status === 'accepted').length;
    const value = owned.filter(p => ['sent', 'approved', 'accepted'].includes(p.status))
      .reduce((s, p) => s + computeTotals(p).total, 0);
    return { ...u, owned: owned.length, accepted, value, rate: owned.length ? accepted / owned.length : 0 };
  });

  const overallConversion = React.useMemo(() => {
    const closed = proposals.filter(p => ['accepted', 'rejected', 'expired'].includes(p.status));
    const won = proposals.filter(p => p.status === 'accepted');
    return closed.length ? Math.round((won.length / closed.length) * 100) : 0;
  }, [proposals]);

  return (
    <div>
      <PageHeader
        eyebrow="Performance"
        title="Reports & Analytics"
        description="Monthly values, conversion, and sales performance across the studio."
        actions={
          <>
            <Button variant="secondary" onClick={() => pushToast('Exported report as PDF (demo).')}>Export PDF</Button>
            <Button variant="secondary" onClick={() => pushToast('Exported report as Excel (demo).')}>Export Excel</Button>
          </>
        }
      />

      <div className="rep-stat-row">
        <Card className="rep-stat"><span>Overall Conversion</span><strong className="mono">{overallConversion}%</strong></Card>
        <Card className="rep-stat"><span>Total Proposals YTD</span><strong className="mono">{proposals.length}</strong></Card>
        <Card className="rep-stat"><span>Pipeline Value</span><strong className="mono">{fmtMoney(proposals.reduce((s, p) => s + computeTotals(p).total, 0))}</strong></Card>
      </div>

      <div className="rep-grid">
        <Card className="rep-chart-card">
          <div className="dash-card-header"><h3>Monthly proposal value</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#EDEBE3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A8F98' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8A8F98' }} axisLine={false} tickLine={false} width={50} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip
                formatter={v => fmtMoney(v)}
                contentStyle={{ borderRadius: 6, border: '1px solid #DEDAD0', fontSize: 12, fontFamily: 'Inter' }}
              />
              <Bar dataKey="value" fill="#0B0D12" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rep-chart-card">
          <div className="dash-card-header"><h3>Value by service</h3></div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byService} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {byService.map((entry, i) => (
                  <Cell key={i} fill={SERVICE_COLORS[entry.name] || '#8A8F98'} />
                ))}
              </Pie>
              <Tooltip formatter={v => fmtMoney(v)} contentStyle={{ borderRadius: 6, border: '1px solid #DEDAD0', fontSize: 12, fontFamily: 'Inter' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="rep-pie-legend">
            {byService.map(s => (
              <span key={s.name}><i style={{ background: SERVICE_COLORS[s.name] }} />{s.name}</span>
            ))}
          </div>
        </Card>
      </div>

      <Card className="rep-section">
        <div className="dash-card-header"><h3>Sales performance</h3></div>
        <table className="ui-table">
          <thead>
            <tr><th>Sales Executive</th><th>Proposals</th><th>Accepted</th><th>Conversion</th><th>Value Closed/In-flight</th></tr>
          </thead>
          <tbody>
            {salesPerf.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td className="mono">{u.owned}</td>
                <td className="mono">{u.accepted}</td>
                <td>
                  <div className="rep-bar-cell">
                    <div className="rep-bar-track"><div className="rep-bar-fill" style={{ width: `${u.rate * 100}%` }} /></div>
                    <span className="mono">{Math.round(u.rate * 100)}%</span>
                  </div>
                </td>
                <td className="mono">{fmtMoney(u.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

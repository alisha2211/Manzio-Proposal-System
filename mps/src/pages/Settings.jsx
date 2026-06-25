import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Card, PageHeader, Button, Avatar } from '../components/ui.jsx';
import './Settings.css';

const TABS = ['Company', 'Proposal Numbering', 'Users & Roles', 'Notifications', 'Activity Log'];

export default function Settings() {
  const { users, pushToast } = useApp();
  const [tab, setTab] = useState('Company');

  return (
    <div>
      <PageHeader eyebrow="Admin" title="System Settings" description="Company information, numbering, notifications, and access control." />

      <div className="settings-tabs">
        {TABS.map(t => (
          <button key={t} className={`settings-tab ${tab === t ? 'is-active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Company' && (
        <Card className="settings-card">
          <h3>Company information</h3>
          <div className="settings-field-grid">
            <div className="ui-field"><label>Company name</label><input defaultValue="Manzio Studio" /></div>
            <div className="ui-field"><label>Support email</label><input defaultValue="hello@manzio.studio" /></div>
            <div className="ui-field"><label>Currency</label>
              <select defaultValue="INR">
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="ui-field"><label>Default tax (%)</label><input type="number" defaultValue={18} /></div>
            <div className="ui-field settings-span-2"><label>Address</label><input defaultValue="Kochi, Kerala, India" /></div>
          </div>
          <div className="settings-logo-row">
            <div className="settings-logo-preview">M</div>
            <div>
              <Button variant="secondary" size="sm" onClick={() => pushToast('Logo upload coming soon.')}>Upload new logo</Button>
              <p className="settings-hint">PNG or SVG, transparent background, min 256×256px.</p>
            </div>
          </div>
          <Button variant="accent" onClick={() => pushToast('Settings saved.', 'success')}>Save Changes</Button>
        </Card>
      )}

      {tab === 'Proposal Numbering' && (
        <Card className="settings-card">
          <h3>Proposal numbering format</h3>
          <div className="settings-field-grid">
            <div className="ui-field"><label>Prefix</label><input defaultValue="MZ" /></div>
            <div className="ui-field"><label>Format</label><input defaultValue="{PREFIX}-{YYYY}-{####}" className="mono" /></div>
            <div className="ui-field"><label>Next number</label><input defaultValue="0122" className="mono" /></div>
            <div className="ui-field"><label>Default validity (days)</label><input type="number" defaultValue={30} /></div>
          </div>
          <p className="settings-preview">Preview: <span className="mono">MZ-2026-0122</span></p>
          <Button variant="accent" onClick={() => pushToast('Numbering format updated.', 'success')}>Save Changes</Button>
        </Card>
      )}

      {tab === 'Users & Roles' && (
        <Card className="settings-card settings-card--table">
          <div className="settings-card-header">
            <h3>Users &amp; roles</h3>
            <Button variant="accent" size="sm" onClick={() => pushToast('Invite sent (demo).')}>+ Invite User</Button>
          </div>
          <table className="ui-table">
            <thead><tr><th>User</th><th>Role</th><th>Email</th><th>Proposals</th><th></th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar user={u} size={28} />{u.name}</div></td>
                  <td><span className="settings-role-tag">{u.role}</span></td>
                  <td>{u.email}</td>
                  <td className="mono">{u.proposalsSent}</td>
                  <td><button className="settings-row-action" onClick={() => pushToast('User editing coming soon.')}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'Notifications' && (
        <Card className="settings-card">
          <h3>Notification preferences</h3>
          <div className="settings-toggle-list">
            {[
              ['Proposal created', 'Notify Management when a new proposal is created'],
              ['Approvals', 'Notify Sales Executive when their proposal is approved or rejected'],
              ['Client viewed', 'Notify Sales Executive when a client opens a proposal'],
              ['Expiry reminders', 'Remind Sales Executive 3 days before a proposal expires'],
            ].map(([title, desc]) => (
              <div className="settings-toggle-row" key={title}>
                <div><strong>{title}</strong><p>{desc}</p></div>
                <label className="settings-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="settings-switch-slider" />
                </label>
              </div>
            ))}
          </div>
          <Button variant="accent" onClick={() => pushToast('Notification preferences saved.', 'success')}>Save Changes</Button>
        </Card>
      )}

      {tab === 'Activity Log' && (
        <Card className="settings-card settings-card--table">
          <h3>Activity log</h3>
          <table className="ui-table">
            <thead><tr><th>Time</th><th>User</th><th>Action</th></tr></thead>
            <tbody>
              {[
                ['2026-06-19 09:14', 'Aisha Verghese', 'Logged in'],
                ['2026-06-19 09:20', 'Aisha Verghese', 'Created proposal MZ-2026-0120'],
                ['2026-06-18 17:02', 'David Pinto', 'Approved proposal MZ-2026-0121'],
                ['2026-06-18 11:45', 'Naomi Sequeira', 'Updated tax settings'],
                ['2026-06-17 15:30', 'Lena Cherian', 'Sent proposal MZ-2026-0117'],
              ].map((row, i) => (
                <tr key={i}><td className="mono">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

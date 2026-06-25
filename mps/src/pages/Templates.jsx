import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TEMPLATES } from '../data/mockData.js';
import { Card, PageHeader, Button } from '../components/ui.jsx';
import { useApp } from '../context/AppContext.jsx';
import './Templates.css';

export default function Templates() {
  const { pushToast, role } = useApp();
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <PageHeader
        eyebrow="Reusable scope"
        title="Proposal Templates"
        description="Pre-built scopes with branding, terms, and layout — start a new proposal from one of these instead of from scratch."
        actions={role === 'admin' && <Button variant="accent" onClick={() => setShowNew(true)}>+ New Template</Button>}
      />

      <div className="tpl-grid">
        {TEMPLATES.map(t => (
          <Card className="tpl-card" key={t.id}>
            <div className="tpl-card-top">
              <span className="tpl-service-tag">{t.service}</span>
              {role === 'admin' && <button className="tpl-edit-btn" onClick={() => pushToast('Template editing coming soon.')}>Edit</button>}
            </div>
            <h3>{t.name}</h3>
            <div className="tpl-card-footer">
              <span>{t.uses} uses</span>
              <span>Updated {t.updatedAt}</span>
            </div>
            <Link to="/proposals/new">
              <Button variant="secondary" size="sm" style={{ width: '100%', marginTop: 14 }}>Use this template</Button>
            </Link>
          </Card>
        ))}
      </div>

      {showNew && (
        <div className="ui-modal-overlay" onClick={() => setShowNew(false)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <h2 className="pd-modal-title">Create a new template</h2>
            <p className="pd-modal-desc">Define reusable scope, branding, and terms that Sales Executives can apply when building proposals.</p>
            <div className="ui-field" style={{ marginBottom: 12 }}>
              <label>Template name</label>
              <input placeholder="e.g. Marketing Retainer — Monthly" />
            </div>
            <div className="ui-field" style={{ marginBottom: 16 }}>
              <label>Service category</label>
              <select>
                <option>UI/UX Design</option>
                <option>Web Design</option>
                <option>Software Development</option>
                <option>Marketing</option>
                <option>CRM Implementation</option>
              </select>
            </div>
            <div className="pd-modal-actions">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button variant="accent" onClick={() => { setShowNew(false); pushToast('Template created.', 'success'); }}>Create Template</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

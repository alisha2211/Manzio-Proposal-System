import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Button } from '../components/ui.jsx';
import { useApp } from '../context/AppContext.jsx';
import { Trash2, Eye, FileText, Pen } from 'lucide-react';
import './Templates.css';

// Visual mini-document preview thumbnail rendered as pure CSS/HTML
function TemplateThumbnail({ template, index }) {
  const palettes = [
    { bg: '#2D6A5A', accent: '#4FAD8E', text: '#fff', docBg: '#F5F2EB' }, // Teal / Green Cover split-panel
    { bg: '#1E3A5F', accent: '#4A7FC1', text: '#fff', docBg: '#F0F4FA' }, // Blue / Navy Web Design
  ];
  const p = palettes[index % palettes.length];

  return (
    <div className="tpl-thumb" style={{ '--tpl-bg': p.bg, '--tpl-accent': p.accent, '--tpl-doc': p.docBg }}>
      {/* Mini A4 doc simulation */}
      <div className="tpl-thumb-doc">
        {/* Left dark panel */}
        <div className="tpl-thumb-left">
          <div className="tpl-thumb-logo" />
          <div className="tpl-thumb-title-lines">
            <div className="tpl-thumb-line tpl-thumb-line--lg" />
            <div className="tpl-thumb-line tpl-thumb-line--lg" />
            <div className="tpl-thumb-line tpl-thumb-line--sm" />
          </div>
          <div className="tpl-thumb-party">
            <div className="tpl-thumb-line tpl-thumb-line--xs" />
            <div className="tpl-thumb-line tpl-thumb-line--sm" />
          </div>
        </div>
        {/* Right cream panel */}
        <div className="tpl-thumb-right">
          <div className="tpl-thumb-accent-bar" />
          {[1,2,3,4,5].map(i => (
            <div key={i} className="tpl-thumb-row">
              <div className="tpl-thumb-row-label" />
              <div className="tpl-thumb-row-val" />
            </div>
          ))}
          <div className="tpl-thumb-divider" />
          {[1,2,3].map(i => (
            <div key={i} className="tpl-thumb-row">
              <div className="tpl-thumb-row-label" />
              <div className="tpl-thumb-row-val" />
            </div>
          ))}
        </div>
      </div>
      {/* Second page preview strip */}
      <div className="tpl-thumb-page2">
        <div className="tpl-thumb-header-strip" />
        <div className="tpl-thumb-content-lines">
          {[1,2,3].map(i => (
            <div key={i} className="tpl-thumb-content-row">
              <div className="tpl-thumb-section-label" />
              <div className="tpl-thumb-section-body">
                <div className="tpl-thumb-body-line" style={{ width: '90%' }} />
                <div className="tpl-thumb-body-line" style={{ width: '75%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Templates() {
  const { pushToast, role, templates, addTemplate, updateTemplate, removeTemplate, activateTemplate } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState('');
  const [service, setService] = useState('UI/UX Design');
  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editService, setEditService] = useState('UI/UX Design');

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) { pushToast('Template name is required', 'danger'); return; }
    const res = await addTemplate({ name: name.trim(), service });
    if (res) { setShowNew(false); setName(''); }
  }

  function openEdit(tpl) {
    setEditingId(tpl.id);
    setEditName(tpl.name || '');
    setEditService(tpl.service || 'UI/UX Design');
    setShowEdit(true);
  }

  async function handleEdit(e) {
    e.preventDefault();
    if (!editName.trim()) { pushToast('Template name is required', 'danger'); return; }
    const res = await updateTemplate(editingId, { name: editName.trim(), service: editService });
    if (res) { setShowEdit(false); setEditingId(null); setEditName(''); }
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await removeTemplate(id);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Reusable scope"
        title="Proposal Templates"
        description="Pre-built proposal designs — pick a style and start building with the right visual language."
        actions={(role === 'admin' || role === 'management') && <Button variant="accent" onClick={() => setShowNew(true)}>+ New Template</Button>}
      />

      <div className="tpl-visual-grid">
        {templates.map((t, index) => (
          <div className="tpl-visual-card" key={t.id}>
            {/* Thumbnail */}
            <div className="tpl-visual-thumb-wrap">
              <TemplateThumbnail template={t} index={index} />

              {/* Hover overlay */}
              <div className="tpl-visual-overlay">
                <Link to="/proposals/new" className="tpl-visual-use-btn">
                  <Eye size={14} />
                  Use Template
                </Link>
              </div>

              {/* Status badge */}
              <div className={`tpl-visual-status-badge ${t.status === 'active' ? 'is-active' : 'is-inactive'}`}>
                {t.status === 'active' ? 'Active' : 'Inactive'}
              </div>
            </div>

            {/* Info bar below thumbnail */}
            <div className="tpl-visual-info">
              <div className="tpl-visual-info-left">
                <h3 className="tpl-visual-name" style={{ marginTop: 2 }}>{t.name}</h3>
                <p className="tpl-visual-meta">{t.uses || 0} uses</p>
              </div>

              {(role === 'admin' || role === 'management') && (
                <div className="tpl-visual-actions">
                  <button
                    className="tpl-icon-btn"
                    title="Edit template"
                    onClick={() => openEdit(t)}
                  >
                    <Pen size={13} />
                  </button>
                  <button
                    className="tpl-icon-btn tpl-icon-btn--danger"
                    title="Delete template"
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {templates.length === 0 && (
          <div className="tpl-empty">
            <FileText size={40} strokeWidth={1.2} />
            <p>No templates yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showNew && (
        <div className="ui-modal-overlay" onClick={() => setShowNew(false)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleCreate}>
              <h2 className="pd-modal-title">Create a new template</h2>
              <p className="pd-modal-desc">Define reusable scope, branding, and terms that Sales Executives can apply when building proposals.</p>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Template name</label>
                <input required placeholder="e.g. Marketing Retainer — Monthly" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="ui-field" style={{ marginBottom: 16 }}>
                <label>Service category</label>
                <select value={service} onChange={e => setService(e.target.value)}>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="CRM Implementation">CRM Implementation</option>
                </select>
              </div>
              <div className="pd-modal-actions">
                <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
                <Button type="submit" variant="accent">Create Template</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEdit && (
        <div className="ui-modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleEdit}>
              <h2 className="pd-modal-title">Edit template</h2>
              <p className="pd-modal-desc">Modify the category and name details for this reusable template.</p>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Template name</label>
                <input required value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div className="ui-field" style={{ marginBottom: 16 }}>
                <label>Service category</label>
                <select value={editService} onChange={e => setEditService(e.target.value)}>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="CRM Implementation">CRM Implementation</option>
                </select>
              </div>
              <div className="pd-modal-actions">
                <Button type="button" variant="ghost" onClick={() => setShowEdit(false)}>Cancel</Button>
                <Button type="submit" variant="accent">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

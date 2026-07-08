import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { computeTotals, fmtMoney } from '../utils/helpers.js';
import { Card, Button, PageHeader } from '../components/ui.jsx';
import ProposalPdfPreview from '../components/ProposalPdfPreview.jsx';
import './ProposalBuilder.css';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import ProposalPDF from "./pdf/ProposalV2";

const SERVICES = ['UI/UX Design', 'Web Design', 'Software Development', 'Marketing', 'CRM Implementation'];

let idCounter = 100;
function newId() { return `it-${idCounter++}`; }

// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_SCOPE = [
  { id: 's1', label: 'UI Design', checked: true },
  { id: 's2', label: 'Frontend Development', checked: true },
  { id: 's3', label: 'Backend Development', checked: true },
  { id: 's4', label: 'Database', checked: true },
  { id: 's5', label: 'Testing', checked: true },
  { id: 's6', label: 'Deployment', checked: true },
];

const DEFAULT_PAGES = [
  { id: newId(), name: 'Home', description: 'Landing Page' },
  { id: newId(), name: 'About', description: 'Company' },
  { id: newId(), name: 'Services', description: 'Services Offered' },
  { id: newId(), name: 'Contact', description: 'Contact Form' },
];

const DEFAULT_FEATURES = ['SEO', 'Responsive', 'CMS', 'Admin Panel'];

const DEFAULT_TIMELINE = [
  { id: newId(), week: 'Week 1', task: 'Research' },
  { id: newId(), week: 'Week 2', task: 'UI Design' },
  { id: newId(), week: 'Week 3', task: 'Development' },
  { id: newId(), week: 'Week 4', task: 'Testing' },
  { id: newId(), week: 'Week 5', task: 'Deployment' },
];

const DEFAULT_PAYMENT = [
  { id: newId(), percent: 50, label: 'Advance Payment' },
  { id: newId(), percent: 30, label: 'Development' },
  { id: newId(), percent: 20, label: 'Before Delivery' },
];

const DEFAULT_TERMS = `Project starts after advance payment.
Delivery within 30 days.
Support for one month.
Hosting excluded.`;

export default function ProposalBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, addProposal, updateProposal, currentUser, pushToast, clients, templates, settings } = useApp();
  const editing = id ? proposals.find(p => p.id === id) : null;
  const logoInputRef = useRef(null);

  // ─── Core fields ──────────────────────────────────────────────────────────
  const [clientId, setClientId] = useState(editing?.client || '');
  
  useEffect(() => {
    if (!clientId && clients) {
      if (clients.length > 0) {
        setClientId(clients[0].id);
      } else {
        setClientId('custom');
      }
    }
  }, [clients, clientId]);

  // Custom client (when clientId === 'custom')
  const [customClient, setCustomClient] = useState(editing?.customClient || {
    name: '', contact: '', email: '', phone: '', address: '',
  });
  function updateCustomClient(field, val) {
    setCustomClient(prev => ({ ...prev, [field]: val }));
  }
  const [title, setTitle] = useState(editing?.title || '');
  const [service, setService] = useState(editing?.service || SERVICES[0]);
  const [currency, setCurrency] = useState(editing?.currency || settings.currency || 'INR');
  const [discount, setDiscount] = useState(editing?.discount ? editing.discount * 100 : 0);
  const [tax, setTax] = useState(editing?.tax ? editing.tax * 100 : settings.taxPercentage || 18);
  const [items, setItems] = useState(
    editing?.items?.map(it => ({ ...it, id: newId() })) ||
    [{ id: newId(), desc: 'UI Design', qty: 1, rate: 0 },
     { id: newId(), desc: 'Frontend Development', qty: 1, rate: 0 },
     { id: newId(), desc: 'Backend Development', qty: 1, rate: 0 },
     { id: newId(), desc: 'Hosting', qty: 1, rate: 0 }]
  );
  const [templateApplied, setTemplateApplied] = useState(null);

  // ─── New sections ─────────────────────────────────────────────────────────
  const [projectOverview, setProjectOverview] = useState(editing?.projectOverview || 'This proposal explains the scope of work, timeline, and pricing for building your website.');
  const [proposedSolution, setProposedSolution] = useState(editing?.proposedSolution || 'We will build a modern, responsive website using industry best practices.');
  const [scopeItems, setScopeItems] = useState(editing?.scopeItems || DEFAULT_SCOPE);
  const [pages, setPages] = useState(editing?.pages?.map(p => ({ ...p, id: p.id || newId() })) || DEFAULT_PAGES);
  const [features, setFeatures] = useState(editing?.features || DEFAULT_FEATURES);
  const [newFeature, setNewFeature] = useState('');
  const [frontend, setFrontend] = useState(editing?.techStack?.frontend || 'React');
  const [backend, setBackend] = useState(editing?.techStack?.backend || 'Node.js');
  const [database, setDatabase] = useState(editing?.techStack?.database || 'MongoDB');
  const [hosting, setHosting] = useState(editing?.techStack?.hosting || 'Vercel');
  
  // Custom values selectable/added to lists
  const [frontendOptions, setFrontendOptions] = useState(['React', 'Next.js', 'Vue.js', 'Angular', 'HTML/CSS/JS']);
  const [backendOptions, setBackendOptions] = useState(['Node.js', 'Express', 'Django', 'Laravel', 'Spring Boot', 'None']);
  const [databaseOptions, setDatabaseOptions] = useState(['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase', 'None']);
  const [hostingOptions, setHostingOptions] = useState(['Vercel', 'Netlify', 'AWS', 'GCP', 'Azure', 'DigitalOcean', 'Client Managed']);

  const [newTechVal, setNewTechVal] = useState('');
  const [newTechType, setNewTechType] = useState('frontend');

  const [timeline, setTimeline] = useState(editing?.timeline?.map(t => ({ ...t, id: t.id || newId() })) || DEFAULT_TIMELINE);
  const [paymentSchedule, setPaymentSchedule] = useState(editing?.paymentSchedule?.map(p => ({ ...p, id: p.id || newId() })) || DEFAULT_PAYMENT);
  const [terms, setTerms] = useState(editing?.terms || DEFAULT_TERMS);
  const [sigPreparedBy, setSigPreparedBy] = useState(editing?.signature?.preparedBy || settings.companyName || 'Manzio Creative Studio');
  const [enableDigitalSig, setEnableDigitalSig] = useState(editing?.signature?.enableDigitalSig !== false);
  const [clientSigRequired, setClientSigRequired] = useState(editing?.signature?.clientSigRequired !== false);
  const [companySeal, setCompanySeal] = useState(editing?.signature?.companySeal || false);
  const [pdfTemplate, setPdfTemplate] = useState(editing?.signature?.pdfTemplate || 'template1');
  const [companyLogo, setCompanyLogo] = useState(editing?.companyLogo || settings.companyLogo || null); // base64 string

  const client = clientId === 'custom'
    ? { ...customClient, id: 'custom' }
    : clients.find(c => String(c.id) === String(clientId)) || null;

  const draftProposal = useMemo(() => ({
    number: editing?.number || `MZ-2026-DRAFT`,
    title: title || 'Untitled Proposal',
    items: items.filter(it => it.desc.trim()).length
      ? items
      : [{ desc: 'New line item', qty: 1, rate: 0 }],
    discount: discount / 100,
    tax: tax / 100,
    currency,
    createdAt: editing?.createdAt || new Date().toISOString().slice(0, 10),
    expiresAt: editing?.expiresAt || '—',
    projectOverview,
    proposedSolution,
    scopeItems,
    pages,
    features,
    techStack: { frontend, backend, database, hosting },
    timeline,
    paymentSchedule,
    terms,
    signature: { preparedBy: sigPreparedBy, enableDigitalSig, clientSigRequired, companySeal, pdfTemplate },
    companyLogo,
  }), [
    title, items, discount, tax, currency, editing,
    projectOverview, proposedSolution, scopeItems, pages, features,
    frontend, backend, database, hosting, timeline, paymentSchedule,
    terms, sigPreparedBy, enableDigitalSig, clientSigRequired, companySeal, companyLogo, pdfTemplate,
  ]);

  const totals = computeTotals(draftProposal);

  // ─── Pricing helpers ──────────────────────────────────────────────────────
  function updateItem(itemId, field, value) {
    setItems(prev => prev.map(it => it.id === itemId
      ? { ...it, [field]: field === 'desc' ? value : Number(value) }
      : it));
  }
  function addItem() { setItems(prev => [...prev, { id: newId(), desc: '', qty: 1, rate: 0 }]); }
  function removeItem(itemId) { setItems(prev => prev.length > 1 ? prev.filter(it => it.id !== itemId) : prev); }

  // ─── Template ─────────────────────────────────────────────────────────────
  function applyTemplate(templateId) {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return;
    setService(tpl.service);
    setTemplateApplied(tpl.name);
    pushToast(`Applied template "${tpl.name}"`);
  }

  // ─── Scope helpers ────────────────────────────────────────────────────────
  const [newScopeItem, setNewScopeItem] = useState('');
  function toggleScope(scopeId) {
    setScopeItems(prev => prev.map(s => s.id === scopeId ? { ...s, checked: !s.checked } : s));
  }
  function addScopeItem() {
    const label = newScopeItem.trim();
    if (!label) return;
    if (scopeItems.some(s => s.label.toLowerCase() === label.toLowerCase())) {
      setNewScopeItem(''); return;
    }
    setScopeItems(prev => [...prev, { id: newId(), label, checked: true }]);
    setNewScopeItem('');
  }
  function removeScope(scopeId) {
    setScopeItems(prev => prev.filter(s => s.id !== scopeId));
  }

  // ─── Pages helpers ────────────────────────────────────────────────────────
  function addPage() { setPages(prev => [...prev, { id: newId(), name: '', description: '' }]); }
  function updatePage(pid, field, val) { setPages(prev => prev.map(p => p.id === pid ? { ...p, [field]: val } : p)); }
  function removePage(pid) { setPages(prev => prev.filter(p => p.id !== pid)); }

  // ─── Features helpers ─────────────────────────────────────────────────────
  function addFeature() {
    const f = newFeature.trim();
    if (f && !features.includes(f)) { setFeatures(prev => [...prev, f]); }
    setNewFeature('');
  }
  function removeFeature(f) { setFeatures(prev => prev.filter(x => x !== f)); }

  // ─── Timeline helpers ─────────────────────────────────────────────────────
  function addStage() { setTimeline(prev => [...prev, { id: newId(), week: `Week ${prev.length + 1}`, task: '' }]); }
  function updateStage(sid, field, val) { setTimeline(prev => prev.map(s => s.id === sid ? { ...s, [field]: val } : s)); }
  function removeStage(sid) { setTimeline(prev => prev.filter(s => s.id !== sid)); }

  // ─── Payment schedule helpers ─────────────────────────────────────────────
  function updatePayment(pid, field, val) {
    setPaymentSchedule(prev => prev.map(p => p.id === pid ? { ...p, [field]: field === 'percent' ? Number(val) : val } : p));
  }
  function addPaymentMilestone() {
    setPaymentSchedule(prev => [...prev, { id: newId(), percent: 0, label: 'Milestone Stage' }]);
  }
  function removePaymentMilestone(pid) {
    setPaymentSchedule(prev => prev.filter(p => p.id !== pid));
  }

  // ─── Technology Stack helpers ─────────────────────────────────────────────
  function addCustomTech() {
    const val = newTechVal.trim();
    if (!val) return;
    if (newTechType === 'frontend') {
      if (!frontendOptions.includes(val)) setFrontendOptions(prev => [...prev, val]);
      setFrontend(val);
    } else if (newTechType === 'backend') {
      if (!backendOptions.includes(val)) setBackendOptions(prev => [...prev, val]);
      setBackend(val);
    } else if (newTechType === 'database') {
      if (!databaseOptions.includes(val)) setDatabaseOptions(prev => [...prev, val]);
      setDatabase(val);
    } else if (newTechType === 'hosting') {
      if (!hostingOptions.includes(val)) setHostingOptions(prev => [...prev, val]);
      setHosting(val);
    }
    setNewTechVal('');
  }

  // ─── Logo upload ──────────────────────────────────────────────────────────
  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCompanyLogo(ev.target.result);
    reader.readAsDataURL(file);
  }

  // ─── Save ─────────────────────────────────────────────────────────────────
  async function handleSave(asStatus) {
    if (!title.trim()) { pushToast('Give the proposal a title before saving.', 'danger'); return; }
    if (clientId === 'custom' && !customClient.name.trim()) {
      pushToast('Enter a client name to continue.', 'danger'); return;
    }
    const cleanItems = items.filter(it => it.desc.trim());
    if (cleanItems.length === 0) { pushToast('Add at least one line item.', 'danger'); return; }
    const stamp = new Date().toISOString().slice(0, 10);
    const expiry = new Date(); expiry.setDate(expiry.getDate() + 30);

    const prefixSetting = localStorage.getItem('manzio_number_prefix') || 'MZ';
    const nextNumSetting = localStorage.getItem('manzio_number_next') || '0122';
    const generatedNumber = editing?.number || `${prefixSetting}-2026-${nextNumSetting}`;

    if (!editing) {
      const nextVal = parseInt(nextNumSetting, 10);
      if (!isNaN(nextVal)) {
        localStorage.setItem('manzio_number_next', String(nextVal + 1).padStart(4, '0'));
      }
    }

    const proposal = {
      id: editing?.id || `p-${Date.now()}`,
      number: generatedNumber,
      client: clientId,
      customClient: clientId === 'custom' ? customClient : null,
      owner: editing?.owner || currentUser.id,
      status: asStatus,
      title: title.trim(),
      service,
      createdAt: editing?.createdAt || stamp,
      updatedAt: stamp,
      expiresAt: editing?.expiresAt || expiry.toISOString().slice(0, 10),
      value: totals.total,
      currency,
      items: cleanItems.map(({ id: _drop, ...rest }) => rest),
      discount: discount / 100,
      tax: tax / 100,
      views: editing?.views || 0,
      lastViewed: editing?.lastViewed || null,
      activity: editing?.activity || [
        { at: stamp, label: 'Proposal created', by: currentUser.name },
        ...(asStatus === 'pending' ? [{ at: stamp, label: 'Submitted for approval', by: currentUser.name }] : []),
      ],
      projectOverview,
      proposedSolution,
      scopeItems,
      pages,
      features,
      techStack: { frontend, backend, database, hosting },
      timeline,
      paymentSchedule,
      terms,
      signature: { preparedBy: sigPreparedBy, enableDigitalSig, clientSigRequired, companySeal, pdfTemplate },
      companyLogo,
    };

    if (!editing) {
      const saved = await addProposal(proposal);
      // Navigate to the real DB ID returned from backend
      if (saved) navigate(`/proposals/${saved.id}`);
    } else {
      await updateProposal(editing.id, proposal);
      navigate(`/proposals/${editing.id}`);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={editing ? 'Editing' : 'New Proposal'}
        title={editing ? 'Edit Proposal' : 'Build a Proposal'}
        description="Fill in all sections on the left — the client-facing document updates live on the right."
        actions={
          <>
            <Button variant="secondary" onClick={() => handleSave('draft')}>Save Draft</Button>
            <Button variant="accent" onClick={() => handleSave('pending')}>Submit for Approval</Button>
          </>
        }
      />

      <div className="pb-grid">
        {/* ═══════════════════ FORM COLUMN ═══════════════════ */}
        <div className="pb-form">

          {/* Template chips */}
          <Card className="pb-section">
            <h3>Start from a template <span className="pb-optional">(optional)</span></h3>
            <div className="pb-template-row">
              {templates.map(t => (
                <button
                  key={t.id}
                  className={`pb-template-chip ${templateApplied === t.name ? 'is-active' : ''}`}
                  onClick={() => applyTemplate(t.id)}
                  type="button"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </Card>

          {/* ① Proposal Details */}
          <Card className="pb-section">
            <h3><span className="pb-section-num">1</span> Proposal Details</h3>
            <div className="pb-field-grid">
              <div className="ui-field pb-span-2">
                <label>Proposal title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Website Development Proposal for [Client Name]"
                />
              </div>
              <div className="ui-field pb-span-2">
                <label>Client</label>
                <select value={clientId} onChange={e => setClientId(e.target.value)}>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  <option value="custom">➕ Enter New Client Manually</option>
                </select>
              </div>

              {/* Manual client fields — shown only when custom is selected */}
              {clientId === 'custom' && (
                <>
                  <div className="ui-field">
                    <label>Client / Company Name <span className="pb-required">*</span></label>
                    <input
                      placeholder="e.g. Acme Corp"
                      value={customClient.name}
                      onChange={e => updateCustomClient('name', e.target.value)}
                    />
                  </div>
                  <div className="ui-field">
                    <label>Contact Person</label>
                    <input
                      placeholder="e.g. John Doe"
                      value={customClient.contact}
                      onChange={e => updateCustomClient('contact', e.target.value)}
                    />
                  </div>
                  <div className="ui-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="e.g. john@company.com"
                      value={customClient.email}
                      onChange={e => updateCustomClient('email', e.target.value)}
                    />
                  </div>
                  <div className="ui-field">
                    <label>Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={customClient.phone}
                      onChange={e => updateCustomClient('phone', e.target.value)}
                    />
                  </div>
                  <div className="ui-field pb-span-2">
                    <label>Address / City</label>
                    <input
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={customClient.address}
                      onChange={e => updateCustomClient('address', e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="ui-field">
                <label>Service</label>
                <select value={service} onChange={e => setService(e.target.value)}>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="ui-field">
                <label>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="ui-field">
                <label>Tax (%)</label>
                <input type="number" min="0" max="100" value={tax} onChange={e => setTax(Number(e.target.value))} />
              </div>

              {/* Logo upload */}
              <div className="ui-field pb-span-2">
                <label>Company Logo</label>
                <div className="pb-logo-upload-row">
                  {companyLogo && (
                    <img src={companyLogo} alt="Company logo" className="pb-logo-preview" />
                  )}
                  <button
                    type="button"
                    className="pb-upload-btn"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {companyLogo ? '🔄 Change Logo' : '📁 Upload Logo'}
                  </button>
                  {companyLogo && (
                    <button type="button" className="pb-remove-logo" onClick={() => setCompanyLogo(null)}>
                      Remove
                    </button>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleLogoUpload}
                  />
                  <span className="pb-logo-hint">PNG, JPG, SVG — shown on the proposal cover</span>
                </div>
              </div>
            </div>
          </Card>

          {/* ② Project Overview */}
          <Card className="pb-section">
            <h3><span className="pb-section-num">2</span> Project Overview</h3>
            <div className="ui-field">
              <label>Overview</label>
              <textarea
                className="pb-textarea"
                rows={4}
                placeholder="This proposal explains..."
                value={projectOverview}
                onChange={e => setProjectOverview(e.target.value)}
              />
            </div>
          </Card>

          {/* ③ Proposed Solution */}
          <Card className="pb-section">
            <h3><span className="pb-section-num">3</span> Proposed Solution</h3>
            <div className="ui-field">
              <label>Solution description</label>
              <textarea
                className="pb-textarea"
                rows={4}
                placeholder="Explain what website / software you will build..."
                value={proposedSolution}
                onChange={e => setProposedSolution(e.target.value)}
              />
            </div>
          </Card>

          {/* ④ Scope of Work */}
          <Card className="pb-section">
            <div className="pb-section-header">
              <h3><span className="pb-section-num">4</span> Scope of Work</h3>
            </div>
            <p className="pb-helper">Check what you will deliver. Type below to add a custom item.</p>
            <div className="pb-scope-grid">
              {scopeItems.map(s => (
                <label key={s.id} className="pb-scope-item">
                  <input
                    type="checkbox"
                    checked={s.checked}
                    onChange={() => toggleScope(s.id)}
                  />
                  <span>{s.label}</span>
                  <button
                    type="button"
                    className="pb-scope-remove"
                    onClick={e => { e.preventDefault(); removeScope(s.id); }}
                    title="Remove"
                  >×</button>
                </label>
              ))}
            </div>
            <div className="pb-add-feature-row" style={{ marginTop: 12 }}>
              <input
                placeholder="e.g. API Integration, SEO Setup, Logo Design…"
                value={newScopeItem}
                onChange={e => setNewScopeItem(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addScopeItem(); } }}
              />
              <Button variant="secondary" size="sm" onClick={addScopeItem}>+ Add</Button>
            </div>
          </Card>

          {/* ⑤ Website Pages */}
          <Card className="pb-section">
            <div className="pb-section-header">
              <h3><span className="pb-section-num">5</span> Website Pages / Sitemap</h3>
              <Button variant="secondary" size="sm" onClick={addPage}>+ Add Page</Button>
            </div>
            <div className="pb-pages-table">
              <div className="pb-pages-header">
                <span>Page Name</span>
                <span>Description</span>
                <span />
              </div>
              {pages.map(p => (
                <div className="pb-pages-row" key={p.id}>
                  <input
                    placeholder="Home"
                    value={p.name}
                    onChange={e => updatePage(p.id, 'name', e.target.value)}
                  />
                  <input
                    placeholder="Landing Page"
                    value={p.description}
                    onChange={e => updatePage(p.id, 'description', e.target.value)}
                  />
                  <button className="pb-item-remove" onClick={() => removePage(p.id)} type="button">×</button>
                </div>
              ))}
            </div>
          </Card>

          {/* ⑥ Features Included */}
          <Card className="pb-section">
            <h3><span className="pb-section-num">6</span> Features Included</h3>
            <div className="pb-chips-wrap">
              {features.map(f => (
                <span key={f} className="pb-chip">
                  {f}
                  <button type="button" className="pb-chip-remove" onClick={() => removeFeature(f)}>×</button>
                </span>
              ))}
            </div>
            <div className="pb-add-feature-row">
              <input
                placeholder="Add feature (e.g. Blog, Payment Gateway)"
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
              />
              <Button variant="secondary" size="sm" onClick={addFeature}>+ Add</Button>
            </div>
          </Card>

          {/* ⑦ Technology Stack */}
          <Card className="pb-section">
            <h3><span className="pb-section-num">7</span> Technology Stack</h3>
            <div className="pb-field-grid">
              <div className="ui-field">
                <label>Frontend</label>
                <select value={frontend} onChange={e => setFrontend(e.target.value)}>
                  {frontendOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="ui-field">
                <label>Backend</label>
                <select value={backend} onChange={e => setBackend(e.target.value)}>
                  {backendOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="ui-field">
                <label>Database</label>
                <select value={database} onChange={e => setDatabase(e.target.value)}>
                  {databaseOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="ui-field">
                <label>Hosting</label>
                <select value={hosting} onChange={e => setHosting(e.target.value)}>
                  {hostingOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="pb-add-feature-row" style={{ marginTop: 16 }}>
              <select 
                value={newTechType} 
                onChange={e => setNewTechType(e.target.value)}
                style={{ maxWidth: 120, padding: '7px 10px', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', fontSize: 'var(--text-sm)' }}
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="hosting">Hosting</option>
              </select>
              <input
                placeholder="Type custom tech name & click + Add"
                value={newTechVal}
                onChange={e => setNewTechVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTech(); } }}
              />
              <Button variant="secondary" size="sm" onClick={addCustomTech}>+ Add</Button>
            </div>
          </Card>

          {/* ⑧ Timeline */}
          <Card className="pb-section">
            <div className="pb-section-header">
              <h3><span className="pb-section-num">8</span> Project Timeline</h3>
              <Button variant="secondary" size="sm" onClick={addStage}>+ Add Stage</Button>
            </div>
            <div className="pb-timeline-list">
              {timeline.map((s, i) => (
                <div className="pb-timeline-row" key={s.id}>
                  <div className="pb-timeline-dot">{i + 1}</div>
                  <input
                    className="pb-timeline-week"
                    placeholder="Week 1"
                    value={s.week}
                    onChange={e => updateStage(s.id, 'week', e.target.value)}
                  />
                  <input
                    className="pb-timeline-task"
                    placeholder="Task description"
                    value={s.task}
                    onChange={e => updateStage(s.id, 'task', e.target.value)}
                  />
                  <button className="pb-item-remove" onClick={() => removeStage(s.id)} type="button">×</button>
                </div>
              ))}
            </div>
          </Card>

          {/* ⑨ Pricing */}
          <Card className="pb-section">
            <div className="pb-section-header">
              <h3><span className="pb-section-num">9</span> Pricing</h3>
              <Button variant="secondary" size="sm" onClick={addItem}>+ Add line</Button>
            </div>
            <div className="pb-items">
              <div className="pb-item-row pb-item-row--header">
                <span>Service</span><span>Qty</span><span>Rate</span><span>Amount</span><span />
              </div>
              {items.map(it => (
                <div className="pb-item-row" key={it.id}>
                  <input
                    className="pb-item-desc"
                    placeholder="Item description"
                    value={it.desc}
                    onChange={e => updateItem(it.id, 'desc', e.target.value)}
                  />
                  <input
                    className="pb-item-qty mono"
                    type="number" min="0"
                    value={it.qty}
                    onChange={e => updateItem(it.id, 'qty', e.target.value)}
                  />
                  <input
                    className="pb-item-rate mono"
                    type="number" min="0"
                    value={it.rate}
                    onChange={e => updateItem(it.id, 'rate', e.target.value)}
                  />
                  <span className="pb-item-amount mono">{fmtMoney(it.qty * it.rate, currency)}</span>
                  <button className="pb-item-remove" onClick={() => removeItem(it.id)} aria-label="Remove line item" type="button">×</button>
                </div>
              ))}
            </div>

            <div className="pb-discount-row">
              <div className="ui-field">
                <label>Discount (%)</label>
                <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(Number(e.target.value))} style={{ width: 100 }} />
              </div>
              <div className="pb-totals-summary">
                <div><span>Subtotal</span><span className="mono">{fmtMoney(totals.subtotal, currency)}</span></div>
                <div><span>Discount</span><span className="mono">−{fmtMoney(totals.discountAmt, currency)}</span></div>
                <div><span>Tax ({tax}%)</span><span className="mono">{fmtMoney(totals.taxAmt, currency)}</span></div>
                <div className="pb-total-final"><span>Total</span><span className="mono">{fmtMoney(totals.total, currency)}</span></div>
              </div>
            </div>
          </Card>

          {/* ⑩ Payment Schedule */}
          <Card className="pb-section">
            <div className="pb-section-header">
              <h3><span className="pb-section-num">10</span> Payment Schedule</h3>
              <Button variant="secondary" size="sm" onClick={addPaymentMilestone}>+ Add Stage</Button>
            </div>
            <p className="pb-helper">Configure milestone percentages (must sum up to 100% ideally).</p>
            <div className="pb-payment-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {paymentSchedule.map(p => (
                <div className="pb-payment-card" key={p.id} style={{ position: 'relative' }}>
                  {paymentSchedule.length > 1 && (
                    <button 
                      type="button"
                      style={{ position: 'absolute', top: 6, right: 8, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'var(--slate-dim)' }}
                      onClick={() => removePaymentMilestone(p.id)}
                    >
                      ×
                    </button>
                  )}
                  <div className="pb-payment-percent">
                    <input
                      type="number" min="0" max="100"
                      value={p.percent}
                      onChange={e => updatePayment(p.id, 'percent', e.target.value)}
                    />
                    <span>%</span>
                  </div>
                  <input
                    className="pb-payment-label"
                    placeholder="Payment label"
                    value={p.label}
                    onChange={e => updatePayment(p.id, 'label', e.target.value)}
                  />
                  <div className="pb-payment-amount mono">
                    {fmtMoney((totals.total * p.percent) / 100, currency)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ⑪ Terms & Conditions */}
          <Card className="pb-section">
            <h3><span className="pb-section-num">11</span> Terms &amp; Conditions</h3>
            <div className="ui-field">
              <textarea
                className="pb-textarea"
                rows={5}
                value={terms}
                onChange={e => setTerms(e.target.value)}
                placeholder="Enter your terms and conditions..."
              />
            </div>
          </Card>

          {/* ⑫ PDF Layout Design */}
          <Card className="pb-section">
            <h3><span className="pb-section-num">12</span> PDF Layout Design</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              Choose how your proposal looks when exported as PDF.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Template 1 */}
              <button
                type="button"
                onClick={() => setPdfTemplate('template1')}
                style={{
                  border: `2px solid ${pdfTemplate === 'template1' ? '#7C3AED' : 'var(--border)'}`,
                  borderRadius: 12,
                  padding: '14px 10px',
                  background: pdfTemplate === 'template1' ? 'rgba(124,58,237,0.05)' : 'var(--bg-inset)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                {/* Mini preview */}
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, overflow: 'hidden', marginBottom: 10, height: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <div style={{ width: 32, height: 3, background: '#7C3AED', borderRadius: 2 }} />
                  <div style={{ width: 48, height: 6, background: '#1A1A1A', borderRadius: 2 }} />
                  <div style={{ width: 36, height: 2, background: '#E5E7EB', borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 2 }}>Template 1</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Centered Purple</div>
                {pdfTemplate === 'template1' && (
                  <div style={{ marginTop: 6, fontSize: 10, fontWeight: 700, color: '#7C3AED' }}>✓ Active</div>
                )}
              </button>

              {/* Template 2 */}
              <button
                type="button"
                onClick={() => setPdfTemplate('template2')}
                style={{
                  border: `2px solid ${pdfTemplate === 'template2' ? '#0F766E' : 'var(--border)'}`,
                  borderRadius: 12,
                  padding: '14px 10px',
                  background: pdfTemplate === 'template2' ? 'rgba(15,118,110,0.05)' : 'var(--bg-inset)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                {/* Mini preview */}
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, overflow: 'hidden', marginBottom: 10, height: 60, display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: 22, background: '#1E293B', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8px', gap: 4 }}>
                    <div style={{ width: 28, height: 2, background: '#0F766E', borderRadius: 2 }} />
                    <div style={{ width: 42, height: 5, background: '#0F172A', borderRadius: 2 }} />
                    <div style={{ width: 22, height: 2, background: '#0F766E', borderRadius: 2 }} />
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dark)', marginBottom: 2 }}>Template 2</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Split Corporate Teal</div>
                {pdfTemplate === 'template2' && (
                  <div style={{ marginTop: 6, fontSize: 10, fontWeight: 700, color: '#0F766E' }}>✓ Active</div>
                )}
              </button>
            </div>
          </Card>

          {/* ⑬ Signature */}
          <Card className="pb-section">
            <h3><span className="pb-section-num">13</span> Signature</h3>
            <div className="ui-field" style={{ marginBottom: 16 }}>
              <label>Prepared By</label>
              <input
                value={sigPreparedBy}
                onChange={e => setSigPreparedBy(e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div className="pb-sig-options">
              <label className="pb-scope-item">
                <input type="checkbox" checked={enableDigitalSig} onChange={e => setEnableDigitalSig(e.target.checked)} />
                <span>Enable Digital Signature</span>
              </label>
              <label className="pb-scope-item">
                <input type="checkbox" checked={clientSigRequired} onChange={e => setClientSigRequired(e.target.checked)} />
                <span>Client Signature Required</span>
              </label>
              <label className="pb-scope-item">
                <input type="checkbox" checked={companySeal} onChange={e => setCompanySeal(e.target.checked)} />
                <span>Company Seal</span>
              </label>
            </div>
          </Card>

        </div>{/* end pb-form */}

        {/* ═══════════════════ PREVIEW COLUMN ═══════════════════ */}
        
<div className="pb-preview">
  <div className="pb-preview-sticky">

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        marginBottom: "15px",
      }}
    >


      <BlobProvider
        document={
          <ProposalPDF
            proposal={draftProposal}
            client={client}
            totals={totals}
            settings={settings}
          />
        }
      >
        {({ blob, url, loading }) => {
          const pdfName = `Manzio-${(title || 'Proposal').replace(/[^a-z0-9]/gi, '_')}.pdf`;

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
                variant="accent"
                disabled={loading}
                onClick={handleView}
              >
                {loading ? 'Generating...' : '👁 View PDF'}
              </Button>
              <Button
                variant="secondary"
                disabled={loading}
                onClick={handleDownload}
              >
                {loading ? '...' : '⬇ Download PDF'}
              </Button>
            </>
          );
        }}
      </BlobProvider>
    </div>

    <div className="pd-preview-label">
      Live Preview
    </div>

    <ProposalPdfPreview
      proposal={draftProposal}
      client={client}
      totals={totals}
      settings={settings}
    />

  </div>
</div>

      </div>
    </div>
  );
}
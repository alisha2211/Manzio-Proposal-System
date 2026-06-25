import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { CLIENTS, SERVICES, TEMPLATES, computeTotals, fmtMoney } from '../data/mockData.js';
import { Card, Button, PageHeader } from '../components/ui.jsx';
import ProposalPdfPreview from '../components/ProposalPdfPreview.jsx';
import './ProposalBuilder.css';

let idCounter = 100;
function newItemId() { return `it-${idCounter++}`; }

export default function ProposalBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { proposals, addProposal, currentUser, pushToast } = useApp();
  const editing = id ? proposals.find(p => p.id === id) : null;

  const [clientId, setClientId] = useState(editing?.client || CLIENTS[0].id);
  const [title, setTitle] = useState(editing?.title || '');
  const [service, setService] = useState(editing?.service || SERVICES[0]);
  const [currency, setCurrency] = useState(editing?.currency || 'INR');
  const [discount, setDiscount] = useState(editing?.discount ? editing.discount * 100 : 0);
  const [tax, setTax] = useState(editing?.tax ? editing.tax * 100 : 18);
  const [items, setItems] = useState(
    editing?.items?.map(it => ({ ...it, id: newItemId() })) ||
    [{ id: newItemId(), desc: '', qty: 1, rate: 0 }]
  );
  const [templateApplied, setTemplateApplied] = useState(null);

  const client = CLIENTS.find(c => c.id === clientId);

  const draftProposal = useMemo(() => ({
    number: editing?.number || `MZ-2026-DRAFT`,
    title: title || 'Untitled proposal',
    items: items.filter(it => it.desc.trim()).length ? items : [{ desc: 'New line item', qty: 1, rate: 0 }],
    discount: discount / 100,
    tax: tax / 100,
    currency,
    createdAt: editing?.createdAt || new Date().toISOString().slice(0, 10),
    expiresAt: editing?.expiresAt || '—',
  }), [title, items, discount, tax, currency, editing]);

  const totals = computeTotals(draftProposal);

  function updateItem(itemId, field, value) {
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, [field]: field === 'desc' ? value : Number(value) } : it));
  }
  function addItem() {
    setItems(prev => [...prev, { id: newItemId(), desc: '', qty: 1, rate: 0 }]);
  }
  function removeItem(itemId) {
    setItems(prev => prev.length > 1 ? prev.filter(it => it.id !== itemId) : prev);
  }

  function applyTemplate(templateId) {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    setService(tpl.service);
    setTemplateApplied(tpl.name);
    pushToast(`Applied template "${tpl.name}"`);
  }

  function handleSave(asStatus) {
    if (!title.trim()) {
      pushToast('Give the proposal a title before saving.', 'danger');
      return;
    }
    const cleanItems = items.filter(it => it.desc.trim());
    if (cleanItems.length === 0) {
      pushToast('Add at least one line item.', 'danger');
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const proposal = {
      id: editing?.id || `p-${Date.now()}`,
      number: editing?.number || `MZ-2026-${String(120 + Math.floor(Math.random() * 90)).padStart(4, '0')}`,
      client: clientId,
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
    };

    if (!editing) addProposal(proposal);
    pushToast(asStatus === 'pending' ? 'Submitted for approval.' : 'Draft saved.', 'success');
    navigate(`/proposals/${proposal.id}`);
  }

  return (
    <div>
      <PageHeader
        eyebrow={editing ? 'Editing' : 'New Proposal'}
        title={editing ? 'Edit Proposal' : 'Build a Proposal'}
        description="Line items on the left, the client-facing document updates live on the right."
        actions={
          <>
            <Button variant="secondary" onClick={() => handleSave('draft')}>Save Draft</Button>
            <Button variant="accent" onClick={() => handleSave('pending')}>Submit for Approval</Button>
          </>
        }
      />

      <div className="pb-grid">
        <div className="pb-form">
          <Card className="pb-section">
            <h3>Start from a template <span className="pb-optional">(optional)</span></h3>
            <div className="pb-template-row">
              {TEMPLATES.map(t => (
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

          <Card className="pb-section">
            <h3>Proposal details</h3>
            <div className="pb-field-grid">
              <div className="ui-field pb-span-2">
                <label>Proposal title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. D2C Storefront Relaunch + CRM Integration" />
              </div>
              <div className="ui-field">
                <label>Client</label>
                <select value={clientId} onChange={e => setClientId(e.target.value)}>
                  {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
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
            </div>
          </Card>

          <Card className="pb-section">
            <div className="pb-section-header">
              <h3>Pricing line items</h3>
              <Button variant="secondary" size="sm" onClick={addItem}>+ Add line</Button>
            </div>
            <div className="pb-items">
              {items.map((it, i) => (
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
              <div className="pb-item-row pb-item-row--header">
                <span>Description</span><span>Qty</span><span>Rate</span><span>Amount</span><span />
              </div>
            </div>

            <div className="pb-discount-row">
              <div className="ui-field">
                <label>Discount (%)</label>
                <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(Number(e.target.value))} style={{ width: 100 }} />
              </div>
              <div className="pb-totals-summary">
                <div><span>Subtotal</span><span className="mono">{fmtMoney(totals.subtotal, currency)}</span></div>
                <div><span>Discount</span><span className="mono">−{fmtMoney(totals.discountAmt, currency)}</span></div>
                <div><span>Tax</span><span className="mono">{fmtMoney(totals.taxAmt, currency)}</span></div>
                <div className="pb-total-final"><span>Total</span><span className="mono">{fmtMoney(totals.total, currency)}</span></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="pb-preview">
          <div className="pb-preview-sticky">
            <div className="pd-preview-label">Live preview</div>
            <ProposalPdfPreview proposal={draftProposal} client={client} totals={totals} />
          </div>
        </div>
      </div>
    </div>
  );
}

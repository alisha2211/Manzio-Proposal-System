import { fmtMoney } from '../utils/helpers.js';
import './ProposalPdfPreview.css';

/* ─── Section block matching single-column full-width layout ───────── */
function Section({ title, children }) {
  return (
    <div className="pp-section">
      <div className="pp-accent-bar" />
      <h2 className="pp-section-heading">{title}</h2>
      <div className="pp-section-right">
        {children}
      </div>
    </div>
  );
}

const PHASE_COLORS = ['#7C3AED', '#6366F1', '#A78BFA', '#E8873A', '#C4963A'];

export default function ProposalPdfPreview({ proposal, client, totals, settings }) {
  const {
    projectOverview, proposedSolution, scopeItems, pages, features,
    techStack, timeline, paymentSchedule, terms, signature,
  } = proposal;

  const totalAmt = totals?.total || 0;
  const subtotalVal = totals?.subtotal || 0;
  const discountVal = totals?.discountAmt || 0;
  const taxVal = totals?.taxAmt || 0;

  const senderName = signature?.preparedBy || "Manzio Creative Studio";
  const senderEmail = "hello@manzio.studio";
  const avatarInitials = senderName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "M";
  const displayStatus = proposal.status ? proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1) : "Draft";

  const companyPhone = settings?.phone || "+91 9495929458";
  const companyWebsite = settings?.website || "www.manziostudio.com";
  const companyEmail = settings?.email || "info@manziostudio.com";

  const hasScope    = scopeItems?.some(s => s.checked);
  const hasPages    = pages?.length > 0;
  const hasFeatures = features?.length > 0;
  const hasTech     = !!techStack && (techStack.frontend || techStack.backend || techStack.database || techStack.hosting);
  const hasTimeline = timeline?.length > 0;
  const hasPaySched = paymentSchedule?.length > 0;
  const hasTerms    = !!terms;

  return (
    <div className="pp-doc">

      {/* ══════════ COVER PAGE ══════════ */}
      {signature?.pdfTemplate === 'template2' ? (
        <div className="pp-cover-t2">
          {/* Left Column (Dark Slate Sidebar) */}
          <div className="pp-cover-t2-sidebar">
            <div className="pp-cover-t2-info-block">
              {/* Prepared For */}
              <div className="pp-cover-t2-info-col">
                <span className="pp-cover-t2-info-label">PREPARED FOR</span>
                <p className="pp-cover-t2-info-val">{client?.name || 'Client Name'}</p>
              </div>

              {/* Prepared By */}
              <div className="pp-cover-t2-info-col">
                <span className="pp-cover-t2-info-label">PREPARED BY</span>
                <p className="pp-cover-t2-info-val">{senderName}</p>
              </div>

              {/* Date */}
              <div className="pp-cover-t2-info-col">
                <span className="pp-cover-t2-info-label">DATE</span>
                <p className="pp-cover-t2-info-val">
                  {proposal.createdAt
                    ? new Date(proposal.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="pp-cover-t2-bottom-brand">MANZIO</div>
          </div>

          {/* Right Column (Minimalist Corporate Content) */}
          <div className="pp-cover-t2-content">
            <div>
              <div className="pp-cover-t2-label">BUSINESS PROPOSAL</div>
              <h1 className="pp-cover-t2-title">{proposal.title || 'Project Proposal'}</h1>
              {proposal.service && <p className="pp-cover-t2-subtitle">{proposal.service}</p>}
              <div className="pp-cover-t2-accent-bar" />
            </div>
            <p className="pp-cover-t2-desc">
              {proposal.projectOverview || "This proposal explains the scope of work, timeline, and pricing for building your website."}
            </p>
          </div>
        </div>
      ) : (
        <div className="pp-cover">
          {/* Background decorative elements */}
          <div className="pp-cover-bg-circle-tr" />
          <div className="pp-cover-bg-circle-bl" />
          <div className="pp-cover-bg-curve-1" />
          <div className="pp-cover-bg-curve-2" />

          <div className="pp-cover-top">
            {/* Company logo always visible */}
            <img src="/src/pages/pdf/assets/manziologo.png" alt="Manzio" className="pp-cover-logo" />
            {/* Decorative brand strip */}
            <img src="/src/pages/pdf/assets/brand-strip.png" alt="Brand Strip" className="pp-cover-band" />
          </div>

          <div className="pp-cover-center">
            <div className="pp-cover-label">P R O P O S A L</div>
            <div className="pp-cover-label-bar" />
            <h1 className="pp-cover-title">{proposal.title || 'Project Proposal'}</h1>
            {proposal.service && <p className="pp-cover-subtitle">{proposal.service}</p>}
            <div className="pp-cover-sub-bar" />
            <p className="pp-cover-desc">
              {proposal.projectOverview || "This proposal explains the scope of work, timeline, and pricing for building your website."}
            </p>
          </div>

          <div className="pp-cover-bottom-card-unified">
            {/* Column 1: Prepared For */}
            <div className="pp-cover-info-col">
              <div className="pp-cover-info-icon-wrap">
                <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#7C3AED', marginBottom: 1 }} />
                <div style={{ width: 14, height: 6, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: '#7C3AED' }} />
              </div>
              <span className="pp-cover-info-label">PREPARED FOR</span>
              <div className="pp-cover-info-divider" />
              <p className="pp-cover-info-val">{client?.name || 'Client Name'}</p>
            </div>

            {/* Column 2: Prepared By */}
            <div className="pp-cover-info-col">
              <div className="pp-cover-info-icon-wrap">
                <div style={{ width: 14, height: 16, borderWidth: 1.5, borderColor: '#7C3AED', borderRadius: 2, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: 3, height: 2, backgroundColor: '#7C3AED' }} />
                    <div style={{ width: 3, height: 2, backgroundColor: '#7C3AED' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: 3, height: 2, backgroundColor: '#7C3AED' }} />
                    <div style={{ width: 3, height: 2, backgroundColor: '#7C3AED' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: 3, height: 2, backgroundColor: '#7C3AED' }} />
                    <div style={{ width: 3, height: 2, backgroundColor: '#7C3AED' }} />
                  </div>
                </div>
              </div>
              <span className="pp-cover-info-label">PREPARED BY</span>
              <div className="pp-cover-info-divider" />
              <p className="pp-cover-info-val">{senderName}</p>
            </div>

            {/* Column 3: Date */}
            <div className="pp-cover-info-col">
              <div className="pp-cover-info-icon-wrap">
                <div style={{ width: 14, height: 14, borderWidth: 1.5, borderColor: '#7C3AED', borderRadius: 2, paddingTop: 4, paddingLeft: 1.5, paddingRight: 1.5, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -2.5, left: 3, width: 1.5, height: 3.5, backgroundColor: '#7C3AED' }} />
                  <div style={{ position: 'absolute', top: -2.5, right: 3, width: 1.5, height: 3.5, backgroundColor: '#7C3AED' }} />
                  <div style={{ height: 1.5, backgroundColor: '#7C3AED', marginBottom: 2 }} />
                  <div style={{ display: 'flex', gap: 1.5 }}>
                    <div style={{ width: 2, height: 1.5, backgroundColor: '#7C3AED' }} />
                    <div style={{ width: 2, height: 1.5, backgroundColor: '#7C3AED' }} />
                  </div>
                </div>
              </div>
              <span className="pp-cover-info-label">DATE</span>
              <div className="pp-cover-info-divider" />
              <p className="pp-cover-info-val">
                {proposal.createdAt
                  ? new Date(proposal.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Page Header: Logo on left, band strip on right (Letterhead style) ─── */}
      <div className="pp-header">
        <img src="/src/pages/pdf/assets/manziologo.png" alt="Manzio Logo" className="pp-header-logo" />
        <img src="/src/pages/pdf/assets/brand-strip.png" alt="Brand Strip" className="pp-header-band-strip" />
      </div>

      {/* ══════════ BODY SECTIONS ══════════ */}
      <div className="pp-body">

        {/* Sender Profile Card (Reference-inspired) */}
        <div className="pp-profile-card">
          <div className="pp-profile-left">
            <div className="pp-profile-avatar">{avatarInitials}</div>
            <div className="pp-profile-details">
              <span className="pp-profile-name">{senderName}</span>
              <span className="pp-profile-sub">
                {proposal.createdAt || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {senderEmail}
              </span>
            </div>
          </div>
          <div className="pp-profile-badge">{displayStatus} Proposal</div>
        </div>

        {/* Project Overview (Introduction) */}
        {projectOverview && (
          <Section title="Introduction">
            <p className="pp-text">{projectOverview}</p>
          </Section>
        )}

        {/* Proposed Solution (About Us) */}
        {proposedSolution && (
          <Section title="About Us">
            <p className="pp-text">{proposedSolution}</p>
          </Section>
        )}

        {/* Objectives */}
        <Section title="Objectives">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            {[
              "Build a professional, modern website",
              "Improve online visibility & SEO ranking",
              "Increase customer engagement and conversions",
              "Mobile-responsive design across all devices",
              "Fast loading performance & optimised UX",
              "Easy content management for the client",
            ].map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <span className="pp-bullet-dot" />
                <span style={{ fontSize: '10px', color: '#374151' }}>{o}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Scope of Work */}
        {hasScope && (
          <Section title="Scope of Work">
            <div className="pp-scope-grid">
              {scopeItems.filter(s => s.checked).map(s => (
                <div key={s.id} className="pp-scope-item">
                  <span className="pp-check">✓</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Website Pages */}
        {hasPages && (
          <Section title="Pages">
            <table className="pp-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Page</th>
                  <th style={{ width: '65%' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {pages.filter(p => p.name).map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 'bold' }}>{p.name}</td>
                    <td className="pp-dim">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {/* Features */}
        {hasFeatures && (
          <Section title="Features">
            <div className="pp-chips">
              {features.map(f => (
                <span key={f} className="pp-chip">{f}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Tech Stack */}
        {hasTech && (
          <Section title="Technology Stack">
            <div className="pp-tech-grid" style={{ width: '100%' }}>
              {[
                { label: 'Frontend', value: techStack.frontend },
                { label: 'Backend',  value: techStack.backend  },
                { label: 'Database', value: techStack.database },
                { label: 'Hosting',  value: techStack.hosting  },
              ].filter(t => t.value).map(t => (
                <div key={t.label} className="pp-tech-item">
                  <span className="pp-col-label">{t.label}</span>
                  <span className="pp-col-name">{t.value}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Timeline (Proposal for Production Phase Cards) */}
        {hasTimeline && (
          <Section title="Proposal for Production">
            <p className="pp-text" style={{ marginBottom: '12px' }}>
              During the pre-production phase, our team will work closely with you to
              conceptualize and develop a solution that effectively communicates your
              message. We will be brainstorming ideas, outline the strategy, and
              create a compelling plan that highlights the key features.
            </p>
            <div className="pp-phase-container" style={{ width: '100%' }}>
              {timeline.map((s, i) => {
                const color = PHASE_COLORS[i % PHASE_COLORS.length];
                return (
                  <div key={s.id} className="pp-phase-card">
                    <div className="pp-phase-accent" style={{ backgroundColor: color }} />
                    <div className="pp-phase-content">
                      <div className="pp-phase-header">
                        <span className="pp-phase-number" style={{ color: color }}>
                          Phase {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="pp-phase-name">{s.week}</span>
                      </div>
                      <p className="pp-phase-desc">{s.task}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Detailed Budget (Pricing) */}
        <Section title="Detailed Budget">
          <p className="pp-text pp-dim" style={{ marginBottom: 12 }}>
            The price breakdown of the total project cost:
          </p>
          <table className="pp-table pp-pricing-table">
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Item</th>
                <th style={{ width: '25%', textAlign: 'center' }}>Cost</th>
                <th style={{ width: '25%', textAlign: 'right' }}>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {proposal.items.map((it, i) => {
                const lineTotal = it.qty * it.rate;
                const pct = totalAmt > 0 ? ((lineTotal / totalAmt) * 100).toFixed(0) : '—';
                return (
                  <tr key={i}>
                    <td>{it.desc}</td>
                    <td className="mono" style={{ textAlign: 'center' }}>{fmtMoney(lineTotal, proposal.currency)}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{pct}%</td>
                  </tr>
                );
              })}
              {/* Total Investment Row */}
              <tr className="pp-total-investment-row">
                <td style={{ fontWeight: 'bold' }}>Total Investment</td>
                <td className="mono" style={{ textAlign: 'center', fontWeight: 'bold' }}>{fmtMoney(totalAmt, proposal.currency)}</td>
                <td className="mono" style={{ textAlign: 'right', fontWeight: 'bold' }}>100%</td>
              </tr>
            </tbody>
          </table>

          {/* Visual Equation Summary (Reference-inspired) */}
          <div className="pp-eq-row">
            <div className="pp-eq-box">
              <span className="pp-eq-label">Proposed Subtotal</span>
              <span className="pp-eq-val">{fmtMoney(subtotalVal, proposal.currency)}</span>
            </div>
            <span className="pp-eq-operator">-</span>
            <div className="pp-eq-box">
              <span className="pp-eq-label">Discount</span>
              <span className="pp-eq-val">{fmtMoney(discountVal, proposal.currency)}</span>
            </div>
            <span className="pp-eq-operator">+</span>
            <div className="pp-eq-box">
              <span className="pp-eq-label">Taxes</span>
              <span className="pp-eq-val">{fmtMoney(taxVal, proposal.currency)}</span>
            </div>
            <span className="pp-eq-operator">=</span>
            <div className="pp-eq-final-box">
              <span className="pp-eq-final-label">Total Investment</span>
              <span className="pp-eq-final-val">{fmtMoney(totalAmt, proposal.currency)}</span>
            </div>
          </div>
        </Section>

        {/* Financial Targets */}
        <Section title="Financial Targets">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', marginBottom: '12px' }}>
            {proposal.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <span className="pp-bullet-dot" />
                <span style={{ fontSize: '10px', color: '#374151' }}>
                  {it.desc}: {fmtMoney(it.qty * it.rate, proposal.currency)}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="pp-bullet-dot" />
              <span style={{ fontSize: '10px', color: '#374151', fontWeight: 'bold' }}>
                Total Budget: {fmtMoney(totalAmt, proposal.currency)}
              </span>
            </div>
          </div>
          <p className="pp-text">
            We believe this investment will deliver outstanding value and results,
            helping you launch your product with impact and drive meaningful
            engagement with your audience.
          </p>
        </Section>

        {/* Payment Schedule */}
        {hasPaySched && (
          <Section title="Payment Schedule">
            <div className="pp-payment-row" style={{ width: '100%' }}>
              {paymentSchedule.map(p => (
                <div key={p.id} className="pp-payment-card">
                  <div className="pp-payment-pct">{p.percent}%</div>
                  <div className="pp-col-label" style={{ marginTop: 4 }}>{p.label}</div>
                  <div className="pp-col-name mono" style={{ marginTop: 4 }}>
                    {fmtMoney((totalAmt * p.percent) / 100, proposal.currency)}
                  </div>
                </div>
              ))}
            </div>
            {/* Notes box */}
            <div className="pp-tech-item" style={{ width: '100%', borderLeft: '3px solid #4FAD8E', background: '#F9FAFB', marginTop: '12px', boxSizing: 'border-box' }}>
              <span className="pp-col-label" style={{ color: '#1A1A1A' }}>Pricing Notes</span>
              <p className="pp-text pp-dim" style={{ margin: '4px 0 0', lineHeight: 1.4 }}>• Prices are exclusive of any additional third-party licensing unless specified.</p>
              <p className="pp-text pp-dim" style={{ margin: '2px 0 0', lineHeight: 1.4 }}>• Additional features requested after approval will be quoted separately.</p>
              <p className="pp-text pp-dim" style={{ margin: '2px 0 0', lineHeight: 1.4 }}>• Hosting, domain renewal, and maintenance are billed separately unless included.</p>
            </div>
          </Section>
        )}

        {/* Terms */}
        {hasTerms && (
          <Section title="Terms & Conditions">
            <div className="pp-terms" style={{ width: '100%' }}>
              {terms.split('\n').filter(Boolean).map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 2 }}>
                  <span className="pp-bullet-dot" />
                  <span style={{ fontSize: '10px', color: '#374151' }}>{line}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Confidentiality */}
        <Section title="Confidentiality">
          <p className="pp-text">
            This proposal and all related information are confidential and
            intended solely for the client. It may not be copied, shared, or
            distributed without prior written consent from {signature?.preparedBy || 'Manzio Creative Studio'}.
          </p>
        </Section>

        {/* Signature */}
        <Section title="Signature">
          <p className="pp-text" style={{ marginBottom: '14px' }}>
            Thank you for considering Manzio Creative Studio for your upcoming
            project needs. We are confident that our expertise and creativity
            will bring your vision to life and make a lasting impression on
            your audience.
          </p>
          <div className="pp-sig-row">
            <div className="pp-sig-block">
              <div className="pp-sig-line" />
              <span className="pp-col-label">{signature?.preparedBy || 'Authorized Signature'}</span>
              <span className="pp-dim" style={{ fontSize: 9 }}>Manzio Creative Studio</span>
            </div>
            {signature?.clientSigRequired && (
              <div className="pp-sig-block">
                <div className="pp-sig-line" />
                <span className="pp-col-label">Client Signature</span>
                <span className="pp-dim" style={{ fontSize: 9 }}>{client?.name}</span>
              </div>
            )}
          </div>
          {signature?.companySeal && (
            <p className="pp-dim" style={{ marginTop: 12, fontSize: 9 }}>🔏 Company Seal Attached</p>
          )}
        </Section>

      </div>

      {/* ─── Contact Footer on preview ─── */}
      <div className="pp-footer">
        <div className="pp-footer-item">
          <span className="pp-footer-icon">☎</span>
          <span>{companyPhone}</span>
        </div>
        <div className="pp-footer-item">
          <span className="pp-footer-icon">◉</span>
          <span>{companyWebsite}</span>
        </div>
        <div className="pp-footer-item">
          <span className="pp-footer-icon">✉</span>
          <span>{companyEmail}</span>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { fmtMoney } from '../data/mockData.js';
import './ProposalPdfPreview.css';

export default function ProposalPdfPreview({ proposal, client, totals }) {
  return (
    <div className="pdf-sheet">
      <div className="pdf-sheet-inner">
        <header className="pdf-header">
          <div className="pdf-logo-block">
            <div className="pdf-logo">M</div>
            <div>
              <div className="pdf-brand">MANZIO</div>
              <div className="pdf-brand-sub">UI/UX · Web · Software · Marketing</div>
            </div>
          </div>
          <div className="pdf-meta">
            <div className="mono">{proposal.number}</div>
            <div>{proposal.createdAt}</div>
          </div>
        </header>

        <div className="pdf-title-block">
          <span className="pdf-eyebrow">Proposal</span>
          <h2>{proposal.title}</h2>
        </div>

        <div className="pdf-parties">
          <div>
            <span className="pdf-label">Prepared for</span>
            <p>{client?.name}</p>
            <p className="pdf-dim">{client?.contact} · {client?.email}</p>
            <p className="pdf-dim">{client?.address}</p>
          </div>
          <div>
            <span className="pdf-label">Prepared by</span>
            <p>Manzio Studio</p>
            <p className="pdf-dim">hello@manzio.studio</p>
            <p className="pdf-dim">Kochi, Kerala, India</p>
          </div>
        </div>

        <table className="pdf-items">
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {proposal.items.slice(0, 5).map((it, i) => (
              <tr key={i}>
                <td>{it.desc}</td>
                <td className="mono">{it.qty}</td>
                <td className="mono">{fmtMoney(it.qty * it.rate, proposal.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pdf-totals">
          <div><span>Subtotal</span><span className="mono">{fmtMoney(totals.subtotal, proposal.currency)}</span></div>
          {proposal.discount > 0 && <div><span>Discount</span><span className="mono">−{fmtMoney(totals.discountAmt, proposal.currency)}</span></div>}
          {proposal.tax > 0 && <div><span>Tax</span><span className="mono">{fmtMoney(totals.taxAmt, proposal.currency)}</span></div>}
          <div className="pdf-total-final"><span>Total</span><span className="mono">{fmtMoney(totals.total, proposal.currency)}</span></div>
        </div>

        <div className="pdf-terms">
          <span className="pdf-label">Terms</span>
          <p>Valid until {proposal.expiresAt}. 50% advance, balance on delivery. Scope changes billed separately.</p>
        </div>

        <footer className="pdf-footer">
          <div className="pdf-signature">
            <div className="pdf-sig-line" />
            <span>Authorized signature</span>
          </div>
          <div className="pdf-qr" aria-hidden="true">
            <QrGlyph />
            <span>Verify online</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function QrGlyph() {
  // Decorative QR-like glyph, not a functional code
  const cells = [
    1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,1,1,0,1,1,1, 0,0,0,1,0,0,0,
    1,1,0,1,0,1,1, 0,1,1,0,1,1,0, 1,0,1,1,1,0,1,
  ];
  return (
    <svg width="44" height="44" viewBox="0 0 7 7" shapeRendering="crispEdges">
      {cells.map((c, i) => c ? <rect key={i} x={i % 7} y={Math.floor(i / 7)} width="1" height="1" fill="var(--ink)" /> : null)}
    </svg>
  );
}

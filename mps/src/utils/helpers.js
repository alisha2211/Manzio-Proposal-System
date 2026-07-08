export const STAGES = [
  { key: 'draft',     label: 'Draft' },
  { key: 'pending',   label: 'Pending Approval' },
  { key: 'approved',  label: 'Approved' },
  { key: 'sent',      label: 'Sent' },
  { key: 'accepted',  label: 'Accepted' },
];

export const OFF_PATH_STAGES = ['rejected', 'expired', 'cancelled'];

export const STATUS_META = {
  draft:     { label: 'Draft',             color: 'var(--gray-500)',   bg: 'var(--gray-100)' },
  pending:   { label: 'Pending Approval',  color: 'var(--warning)',    bg: 'var(--warning-10)' },
  approved:  { label: 'Approved',          color: 'var(--primary)',    bg: 'var(--primary-10)' },
  sent:      { label: 'Sent',              color: 'var(--info)',       bg: 'var(--info-10)' },
  accepted:  { label: 'Accepted',          color: 'var(--success)',    bg: 'var(--success-10)' },
  rejected:  { label: 'Rejected',          color: 'var(--danger)',     bg: 'var(--danger-10)' },
  expired:   { label: 'Expired',           color: 'var(--gray-400)',   bg: 'var(--gray-100)' },
  cancelled: { label: 'Cancelled',         color: 'var(--gray-400)',   bg: 'var(--gray-100)' },
};

export function fmtMoney(value, currency = 'INR') {
  const symbols = { INR: '₹', GBP: '£', USD: '$', EUR: '€' };
  const sym = symbols[currency] || currency + ' ';
  return sym + Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function computeTotals(proposal) {
  const items = proposal.items || [];
  const subtotal = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
  const discountAmt = subtotal * (Number(proposal.discount) || 0);
  const afterDiscount = subtotal - discountAmt;
  const taxAmt = afterDiscount * (Number(proposal.tax) || 0);
  const total = afterDiscount + taxAmt;
  return { subtotal, discountAmt, afterDiscount, taxAmt, total };
}

export function monthlySeries(proposals) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const map = {};
  const order = [];

  // Initialize the last 6 calendar months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = months[d.getMonth()];
    const year = d.getFullYear();
    const key = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map[key] = { month: mName, sent: 0, accepted: 0, value: 0 };
    order.push(key);
  }

  (proposals || []).forEach(p => {
    if (!p.createdAt) return;
    const dateStr = p.createdAt.substring(0, 10);
    const parts = dateStr.split('-');
    if (parts.length < 2) return;
    const key = `${parts[0]}-${parts[1]}`;

    if (map[key]) {
      if (['sent', 'accepted', 'rejected', 'expired'].includes(p.status)) {
        map[key].sent += 1;
      }
      if (p.status === 'accepted') {
        map[key].accepted += 1;
        const total = computeTotals(p).total;
        map[key].value += total;
      }
    }
  });

  return order.map(k => map[k]);
}

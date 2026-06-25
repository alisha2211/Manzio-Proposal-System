// =========================================================
// MANZIO PROPOSAL SYSTEM — MOCK DATA LAYER
// In a real build this is replaced by API calls. Shapes are
// kept deliberately close to what a REST/GraphQL backend
// would return so swapping is mechanical.
// =========================================================

export const STAGES = [
  { key: 'draft',     label: 'Draft' },
  { key: 'pending',   label: 'Pending Approval' },
  { key: 'approved',  label: 'Approved' },
  { key: 'sent',      label: 'Sent' },
  { key: 'accepted',  label: 'Accepted' },
];

export const OFF_PATH_STAGES = ['rejected', 'expired', 'cancelled'];

export const STATUS_META = {
  draft:     { label: 'Draft',             color: 'var(--slate)',      bg: 'rgba(138,143,152,0.12)' },
  pending:   { label: 'Pending Approval',  color: 'var(--amber)',      bg: 'var(--amber-10)' },
  approved:  { label: 'Approved',          color: 'var(--blue)',       bg: 'var(--blue-10)' },
  sent:      { label: 'Sent',              color: 'var(--blue)',       bg: 'var(--blue-10)' },
  accepted:  { label: 'Accepted',          color: 'var(--green)',      bg: 'var(--green-10)' },
  rejected:  { label: 'Rejected',          color: 'var(--red)',        bg: 'var(--red-10)' },
  expired:   { label: 'Expired',           color: 'var(--slate-dim)',  bg: 'rgba(92,97,107,0.12)' },
  cancelled: { label: 'Cancelled',         color: 'var(--slate-dim)',  bg: 'rgba(92,97,107,0.12)' },
};

export const CURRENT_USER = {
  id: 'u1',
  name: 'Aisha Verghese',
  role: 'sales', // 'admin' | 'sales' | 'management'
  email: 'aisha@manzio.studio',
  avatarColor: '#5B8DEF',
};

export const USERS = [
  { id: 'u1', name: 'Aisha Verghese', role: 'sales', email: 'aisha@manzio.studio', proposalsSent: 18, conversion: 0.61, avatarColor: '#5B8DEF' },
  { id: 'u2', name: 'Rohan Mathew',   role: 'sales', email: 'rohan@manzio.studio', proposalsSent: 14, conversion: 0.50, avatarColor: '#FF4D2E' },
  { id: 'u3', name: 'Lena Cherian',   role: 'sales', email: 'lena@manzio.studio', proposalsSent: 22, conversion: 0.68, avatarColor: '#1A8754' },
  { id: 'u4', name: 'David Pinto',    role: 'management', email: 'david@manzio.studio', proposalsSent: 0, conversion: 0, avatarColor: '#C98A1F' },
  { id: 'u5', name: 'Naomi Sequeira', role: 'admin', email: 'naomi@manzio.studio', proposalsSent: 0, conversion: 0, avatarColor: '#8A8F98' },
];

export const CLIENTS = [
  {
    id: 'c1', name: 'Verbena Foods Pvt Ltd', contact: 'Priya Nair', email: 'priya@verbenafoods.in',
    phone: '+91 98470 22310', address: 'Kochi, Kerala', industry: 'F&B', proposalsCount: 3,
    notes: 'Wants D2C site relaunch + CRM. Prefers WhatsApp updates over email.',
  },
  {
    id: 'c2', name: 'Trellis Healthtech', contact: 'Arjun Menon', email: 'arjun@trellishealth.io',
    phone: '+91 90720 11843', address: 'Bengaluru, KA', industry: 'Healthcare SaaS', proposalsCount: 2,
    notes: 'Long sales cycle — needs management sign-off on every revision.',
  },
  {
    id: 'c3', name: 'Castellan Realty Group', contact: 'Meera Iqbal', email: 'meera@castellanrealty.com',
    phone: '+91 88840 76521', address: 'Mumbai, MH', industry: 'Real Estate', proposalsCount: 4,
    notes: 'High value, price-sensitive. Always asks for itemised breakdown.',
  },
  {
    id: 'c4', name: 'Northbeam Logistics', contact: 'Sanjay Oommen', email: 'sanjay@northbeam.co',
    phone: '+91 99000 45211', address: 'Chennai, TN', industry: 'Logistics', proposalsCount: 1,
    notes: 'New lead via referral. First proposal in progress.',
  },
  {
    id: 'c5', name: 'Holloway & Finch', contact: 'Kate Holloway', email: 'kate@hollowayfinch.com',
    phone: '+44 7700 900221', address: 'London, UK', industry: 'Legal Services', proposalsCount: 2,
    notes: 'International client — invoice in GBP, mind time zone for calls.',
  },
  {
    id: 'c6', name: 'Solaris Renewable Energy', contact: 'Vikram Das', email: 'vikram@solarisre.in',
    phone: '+91 97450 88102', address: 'Hyderabad, TS', industry: 'Energy', proposalsCount: 2,
    notes: 'Marketing + web combo deal under negotiation.',
  },
];

const today = new Date('2026-06-19');
const d = (offsetDays) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString().slice(0, 10);
};

export const SERVICES = ['UI/UX Design', 'Web Design', 'Software Development', 'Marketing', 'CRM Implementation'];

export const PROPOSALS = [
  {
    id: 'p1', number: 'MZ-2026-0118', client: 'c1', owner: 'u1', status: 'sent',
    title: 'D2C Storefront Relaunch + CRM Integration', service: 'Web Design',
    createdAt: d(-9), updatedAt: d(-2), expiresAt: d(12), sentAt: d(-2),
    value: 485000, currency: 'INR',
    items: [
      { desc: 'UX audit & IA redesign', qty: 1, rate: 65000 },
      { desc: 'Storefront UI design (12 templates)', qty: 12, rate: 9500 },
      { desc: 'Frontend build (Next.js)', qty: 1, rate: 180000 },
      { desc: 'CRM integration (HubSpot)', qty: 1, rate: 95000 },
      { desc: 'QA + launch support (3 weeks)', qty: 1, rate: 31000 },
    ],
    discount: 0.05, tax: 0.18,
    views: 4, lastViewed: d(-1),
    activity: [
      { at: d(-9), label: 'Proposal created', by: 'Aisha Verghese' },
      { at: d(-7), label: 'Submitted for approval', by: 'Aisha Verghese' },
      { at: d(-6), label: 'Approved', by: 'David Pinto', note: 'Good margin, approved as-is.' },
      { at: d(-2), label: 'Sent to client', by: 'Aisha Verghese' },
      { at: d(-1), label: 'Client viewed proposal', by: 'Priya Nair' },
    ],
  },
  {
    id: 'p2', number: 'MZ-2026-0117', client: 'c3', owner: 'u3', status: 'accepted',
    title: 'Property Listings Platform — Phase 2', service: 'Software Development',
    createdAt: d(-21), updatedAt: d(-4), expiresAt: d(6), sentAt: d(-12), acceptedAt: d(-4),
    value: 920000, currency: 'INR',
    items: [
      { desc: 'Map-based search module', qty: 1, rate: 220000 },
      { desc: 'Listing management dashboard', qty: 1, rate: 260000 },
      { desc: 'Payment gateway integration', qty: 1, rate: 140000 },
      { desc: 'Mobile-responsive overhaul', qty: 1, rate: 180000 },
      { desc: 'Post-launch support (2 months)', qty: 2, rate: 60000 },
    ],
    discount: 0.08, tax: 0.18,
    views: 9, lastViewed: d(-4),
    activity: [
      { at: d(-21), label: 'Proposal created', by: 'Lena Cherian' },
      { at: d(-19), label: 'Submitted for approval', by: 'Lena Cherian' },
      { at: d(-18), label: 'Approved', by: 'David Pinto' },
      { at: d(-12), label: 'Sent to client', by: 'Lena Cherian' },
      { at: d(-6), label: 'Client requested changes', by: 'Meera Iqbal', note: 'Asked to itemise post-launch support.' },
      { at: d(-5), label: 'Revised and resent', by: 'Lena Cherian' },
      { at: d(-4), label: 'Client accepted', by: 'Meera Iqbal' },
    ],
  },
  {
    id: 'p3', number: 'MZ-2026-0119', client: 'c2', owner: 'u1', status: 'pending',
    title: 'Patient Intake Portal — UI/UX + Build', service: 'UI/UX Design',
    createdAt: d(-3), updatedAt: d(-1), expiresAt: d(20),
    value: 610000, currency: 'INR',
    items: [
      { desc: 'Clinical workflow research', qty: 1, rate: 85000 },
      { desc: 'UI/UX design (full system)', qty: 1, rate: 210000 },
      { desc: 'Frontend development', qty: 1, rate: 240000 },
      { desc: 'Accessibility audit (WCAG AA)', qty: 1, rate: 75000 },
    ],
    discount: 0, tax: 0.18,
    views: 0, lastViewed: null,
    activity: [
      { at: d(-3), label: 'Proposal created', by: 'Aisha Verghese' },
      { at: d(-1), label: 'Submitted for approval', by: 'Aisha Verghese' },
    ],
  },
  {
    id: 'p4', number: 'MZ-2026-0120', client: 'c4', owner: 'u2', status: 'draft',
    title: 'Fleet Tracking Dashboard — Discovery', service: 'Software Development',
    createdAt: d(-1), updatedAt: d(0), expiresAt: d(29),
    value: 340000, currency: 'INR',
    items: [
      { desc: 'Discovery & technical scoping', qty: 1, rate: 60000 },
      { desc: 'Realtime tracking module', qty: 1, rate: 180000 },
      { desc: 'Driver mobile app (MVP)', qty: 1, rate: 100000 },
    ],
    discount: 0, tax: 0.18,
    views: 0, lastViewed: null,
    activity: [
      { at: d(-1), label: 'Proposal created', by: 'Rohan Mathew' },
    ],
  },
  {
    id: 'p5', number: 'MZ-2026-0112', client: 'c5', owner: 'u3', status: 'rejected',
    title: 'Brand Site + Marketing Retainer', service: 'Marketing',
    createdAt: d(-30), updatedAt: d(-15), expiresAt: d(-1), sentAt: d(-22),
    value: 275000, currency: 'GBP',
    items: [
      { desc: 'Brand refresh', qty: 1, rate: 65000 },
      { desc: 'Website redesign (8 pages)', qty: 1, rate: 110000 },
      { desc: 'Marketing retainer (3 months)', qty: 3, rate: 33333 },
    ],
    discount: 0, tax: 0,
    views: 3, lastViewed: d(-16),
    activity: [
      { at: d(-30), label: 'Proposal created', by: 'Lena Cherian' },
      { at: d(-27), label: 'Approved', by: 'David Pinto' },
      { at: d(-22), label: 'Sent to client', by: 'Lena Cherian' },
      { at: d(-16), label: 'Client viewed proposal', by: 'Kate Holloway' },
      { at: d(-15), label: 'Client rejected', by: 'Kate Holloway', note: 'Going with an in-house team for now.' },
    ],
  },
  {
    id: 'p6', number: 'MZ-2026-0098', client: 'c6', owner: 'u2', status: 'expired',
    title: 'Solar Monitoring Marketing Site', service: 'Marketing',
    createdAt: d(-55), updatedAt: d(-25), expiresAt: d(-3), sentAt: d(-40),
    value: 190000, currency: 'INR',
    items: [
      { desc: 'Landing page design', qty: 1, rate: 55000 },
      { desc: 'SEO + content setup', qty: 1, rate: 75000 },
      { desc: 'Lead-gen automation', qty: 1, rate: 60000 },
    ],
    discount: 0, tax: 0.18,
    views: 2, lastViewed: d(-38),
    activity: [
      { at: d(-55), label: 'Proposal created', by: 'Rohan Mathew' },
      { at: d(-48), label: 'Approved', by: 'David Pinto' },
      { at: d(-40), label: 'Sent to client', by: 'Rohan Mathew' },
      { at: d(-38), label: 'Client viewed proposal', by: 'Vikram Das' },
      { at: d(-3), label: 'Proposal expired', by: 'System' },
    ],
  },
  {
    id: 'p7', number: 'MZ-2026-0121', client: 'c6', owner: 'u1', status: 'approved',
    title: 'CRM Rollout — Sales & Field Teams', service: 'CRM Implementation',
    createdAt: d(-6), updatedAt: d(-1), expiresAt: d(24),
    value: 410000, currency: 'INR',
    items: [
      { desc: 'CRM configuration (Zoho)', qty: 1, rate: 95000 },
      { desc: 'Field team mobile setup', qty: 1, rate: 120000 },
      { desc: 'Data migration', qty: 1, rate: 85000 },
      { desc: 'Training & documentation', qty: 1, rate: 110000 },
    ],
    discount: 0.04, tax: 0.18,
    views: 0, lastViewed: null,
    activity: [
      { at: d(-6), label: 'Proposal created', by: 'Aisha Verghese' },
      { at: d(-3), label: 'Submitted for approval', by: 'Aisha Verghese' },
      { at: d(-1), label: 'Approved', by: 'David Pinto', note: 'Ready to send whenever client confirms scope call.' },
    ],
  },
  {
    id: 'p8', number: 'MZ-2026-0113', client: 'c2', owner: 'u3', status: 'accepted',
    title: 'Telehealth Booking Flow Redesign', service: 'UI/UX Design',
    createdAt: d(-40), updatedAt: d(-20), expiresAt: d(-10), sentAt: d(-32), acceptedAt: d(-20),
    value: 350000, currency: 'INR',
    items: [
      { desc: 'Booking flow UX redesign', qty: 1, rate: 140000 },
      { desc: 'Design system update', qty: 1, rate: 110000 },
      { desc: 'Usability testing (2 rounds)', qty: 2, rate: 50000 },
    ],
    discount: 0, tax: 0.18,
    views: 6, lastViewed: d(-20),
    activity: [
      { at: d(-40), label: 'Proposal created', by: 'Lena Cherian' },
      { at: d(-37), label: 'Approved', by: 'David Pinto' },
      { at: d(-32), label: 'Sent to client', by: 'Lena Cherian' },
      { at: d(-20), label: 'Client accepted', by: 'Arjun Menon' },
    ],
  },
];

export const TEMPLATES = [
  { id: 't1', name: 'Web Design — Standard', service: 'Web Design', uses: 14, updatedAt: d(-18) },
  { id: 't2', name: 'Software Development — Fixed Scope', service: 'Software Development', uses: 9, updatedAt: d(-30) },
  { id: 't3', name: 'UI/UX Discovery Sprint', service: 'UI/UX Design', uses: 11, updatedAt: d(-12) },
  { id: 't4', name: 'CRM Implementation — Zoho/HubSpot', service: 'CRM Implementation', uses: 6, updatedAt: d(-25) },
  { id: 't5', name: 'Marketing Retainer — Quarterly', service: 'Marketing', uses: 8, updatedAt: d(-9) },
];

export function fmtMoney(value, currency = 'INR') {
  const symbols = { INR: '₹', GBP: '£', USD: '$', EUR: '€' };
  const sym = symbols[currency] || currency + ' ';
  return sym + Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function computeTotals(proposal) {
  const subtotal = proposal.items.reduce((s, it) => s + it.qty * it.rate, 0);
  const discountAmt = subtotal * (proposal.discount || 0);
  const afterDiscount = subtotal - discountAmt;
  const taxAmt = afterDiscount * (proposal.tax || 0);
  const total = afterDiscount + taxAmt;
  return { subtotal, discountAmt, afterDiscount, taxAmt, total };
}

export function getClient(id) { return CLIENTS.find(c => c.id === id); }
export function getOwner(id) { return USERS.find(u => u.id === id); }

export function dashboardStats() {
  const total = PROPOSALS.length;
  const byStatus = (s) => PROPOSALS.filter(p => p.status === s).length;
  const totalValue = PROPOSALS
    .filter(p => ['sent', 'approved', 'accepted'].includes(p.status))
    .reduce((sum, p) => sum + computeTotals(p).total, 0);
  return {
    total,
    draft: byStatus('draft'),
    pending: byStatus('pending'),
    approved: byStatus('approved'),
    sent: byStatus('sent'),
    accepted: byStatus('accepted'),
    rejected: byStatus('rejected'),
    expired: byStatus('expired'),
    totalValue,
  };
}

export function monthlySeries() {
  return [
    { month: 'Jan', sent: 6, accepted: 3, value: 1240000 },
    { month: 'Feb', sent: 8, accepted: 5, value: 1860000 },
    { month: 'Mar', sent: 5, accepted: 2, value: 980000 },
    { month: 'Apr', sent: 9, accepted: 6, value: 2210000 },
    { month: 'May', sent: 11, accepted: 7, value: 2640000 },
    { month: 'Jun', sent: 7, accepted: 4, value: 1750000 },
  ];
}

export function recentActivity() {
  const all = PROPOSALS.flatMap(p => p.activity.map(a => ({ ...a, proposal: p.number, proposalId: p.id, title: p.title })));
  return all.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 10);
}

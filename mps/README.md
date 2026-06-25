# Manzio Proposal System (MPS) — Frontend

A complete React + Vite frontend for Manzio's internal proposal management tool, built against the requirements in `Manzio_Proposal_System_Requirements.pdf`.

## What this is

This is the **frontend only** — a fully interactive UI with realistic mock data, role-based views, and all the screens a Sales Executive, Manager, or Admin would use day to day. There is no backend; all data lives in `src/data/mockData.js` and in-memory React state (`src/context/AppContext.jsx`), so changes reset on page refresh.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Try it out

- Use the **"Viewing as"** switcher in the top bar to flip between **Sales**, **Management**, and **Admin** — navigation and available actions change with the role.
- Go to **Proposals → + New Proposal** to build one from scratch (or apply a template) and watch the PDF preview update live.
- Open any proposal and walk it through **Draft → Pending Approval → Approved → Sent → Client Accepted** using the action buttons.
- Switch to the **Management** role and visit **Approvals** to approve/reject what Sales submitted.
- **Client Portal** simulates what an external client sees when they open a proposal link.

## Structure

```
src/
  components/      Shared UI: Shell (nav/topbar), StatusThread (signature stepper),
                    StatusBadge, ProposalPdfPreview, generic ui primitives
  context/          AppContext — role switching, in-memory proposal state, toasts
  data/             mockData.js — clients, proposals, users, templates, helpers
  pages/            One file per route (Dashboard, Proposals, ProposalDetail,
                    ProposalBuilder, Clients, ClientDetail, Templates, Approvals,
                    Reports, ClientPortal, Settings)
  tokens.css        Design tokens — colors, type, spacing, radius, motion
```

## Requirements coverage

Maps to the original spec (`Manzio_Proposal_System_Requirements.pdf`):

| # | Requirement | Where |
|---|---|---|
| 2 | User roles & permissions | Role switcher in topbar; nav + actions gated by role throughout |
| 3 | Dashboard | `pages/Dashboard.jsx` |
| 4 | Client management | `pages/Clients.jsx`, `pages/ClientDetail.jsx` |
| 5 | Proposal management | `pages/ProposalBuilder.jsx`, `pages/ProposalDetail.jsx` |
| 6 | Proposal templates | `pages/Templates.jsx` |
| 7 | Proposal PDF design | `components/ProposalPdfPreview.jsx` |
| 8 | Proposal workflow | `components/StatusThread.jsx` + status actions in `ProposalDetail.jsx` |
| 9 | Sharing & tracking | Share modal + views/last-viewed in `ProposalDetail.jsx` |
| 10 | Internal approval | `pages/Approvals.jsx` |
| 11 | Client portal | `pages/ClientPortal.jsx` |
| 12 | Notifications | Toast system (`components/ui.jsx`) + Settings → Notifications tab |
| 13 | Reports & analytics | `pages/Reports.jsx` |
| 14 | Search & filters | Topbar search + filter bar in `pages/Proposals.jsx` |
| 15 | System settings | `pages/Settings.jsx` |
| 16 | Security & activity logs | Settings → Activity Log tab |

Note: this is a frontend prototype with mock data — wiring it to a real backend (auth, persistence, email sending, PDF export, etc.) is a separate phase.

## Design notes

- **Palette**: near-black ink (`#0B0D12`) and warm paper (`#F7F6F2`) as the base, with Manzio vermilion (`#FF4D2E`) as the single accent color reserved for primary actions and brand marks.
- **Type**: Fraunces for display/headings, Inter for UI text, JetBrains Mono for proposal numbers, amounts, and dates.
- **Signature element**: the `StatusThread` component — a stitched stepper that represents a proposal's journey from Draft to Accepted, reused at every scale (list rows, builder header, client portal, detail page).

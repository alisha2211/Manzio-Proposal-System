import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Shell from './components/Shell.jsx';
import { Toasts } from './components/ui.jsx';
import Login from './pages/Login.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Proposals from './pages/Proposals.jsx';
import ProposalDetail from './pages/ProposalDetail.jsx';
import ProposalBuilder from './pages/ProposalBuilder.jsx';
import Clients from './pages/Clients.jsx';
import ClientDetail from './pages/ClientDetail.jsx';
import Templates from './pages/Templates.jsx';
import Approvals from './pages/Approvals.jsx';
import Reports from './pages/Reports.jsx';
import ClientPortal from './pages/ClientPortal.jsx';
import Settings from './pages/Settings.jsx';

function Routed() {
  const { isLoggedIn, login, toasts } = useApp();

  // Show login screen when user is not authenticated
  if (!isLoggedIn) {
    return <Login onLogin={login} />;
  }

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/proposals/new" element={<ProposalBuilder />} />
        <Route path="/proposals/:id" element={<ProposalDetail />} />
        <Route path="/proposals/:id/edit" element={<ProposalBuilder />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/portal" element={<ClientPortal />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
      <Toasts toasts={toasts} />
    </Shell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Routed />
    </AppProvider>
  );
}


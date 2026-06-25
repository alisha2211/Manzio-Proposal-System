import React, { createContext, useContext, useState, useCallback } from 'react';
import { PROPOSALS as INITIAL_PROPOSALS, USERS } from '../data/mockData.js';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  // Auth state — null means "not logged in"
  const [authUser, setAuthUser] = useState(null);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [toasts, setToasts]     = useState([]);

  const login = useCallback((user) => {
    setAuthUser(user);
  }, []);

  const logout = useCallback(() => {
    setAuthUser(null);
  }, []);

  const pushToast = useCallback((message, tone = 'default') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, 3600);
  }, []);

  const updateProposalStatus = useCallback((id, status, note) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== id) return p;
      const stamp = new Date().toISOString().slice(0, 10);
      const labelMap = {
        pending: 'Submitted for approval',
        approved: 'Approved',
        rejected: 'Rejected',
        sent: 'Sent to client',
        accepted: 'Client accepted',
        cancelled: 'Cancelled',
        draft: 'Reverted to draft',
      };
      const activityEntry = {
        at: stamp,
        label: labelMap[status] || `Status changed to ${status}`,
        by: authUser?.name || 'User',
        note,
      };
      return { ...p, status, updatedAt: stamp, activity: [...p.activity, activityEntry] };
    }));
  }, [authUser]);

  const addProposal = useCallback((proposal) => {
    setProposals(prev => [proposal, ...prev]);
  }, []);

  const value = {
    // auth
    authUser,
    isLoggedIn: !!authUser,
    login,
    logout,
    // role convenience — falls back to 'sales' if not logged in
    role: authUser?.role || 'sales',
    setRole: () => {},          // kept for Shell compatibility (demo role-switch hidden when real auth active)
    currentUser: authUser || { name: 'Guest', role: 'sales', avatarColor: '#8A8F98' },
    users: USERS,
    // proposals
    proposals, setProposals,
    updateProposalStatus,
    addProposal,
    // toasts
    toasts, pushToast,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

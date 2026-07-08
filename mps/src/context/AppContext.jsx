import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';
import proposalService from '../services/proposalService';
import clientService from '../services/clientService';
import userService from '../services/userService';
import templateService from '../services/templateService';
import settingsService from '../services/settingsService';
import notificationService from '../services/notificationService';
import reportService from '../services/reportService';
import activityService from '../services/activityService';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [toasts, setToasts]     = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [systemActivities, setSystemActivities] = useState([]);
  const [settings, setSettings] = useState({
    companyName: 'Manzio Creative Studio',
    address: 'Kochi, Kerala, India',
    phone: '+91 9495929458',
    email: 'manziostudio@gmail.com',
    website: 'https://www.manziostudio.com/',
    gstNumber: '32ABCDE1234F1Z5',
    currency: 'INR',
    taxPercentage: 18.0,
    companyLogo: null,
    numberPrefix: 'MZ',
    numberFormat: '{PREFIX}-{YYYY}-{####}',
    nextNumber: '0122',
    validityDays: 30
  });

  const darkMode = false;
  const toggleDarkMode = useCallback(() => {}, []);

  const pushToast = useCallback((message, tone = 'default') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, 3600);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Session restoration
  useEffect(() => {
    const token = localStorage.getItem("manzio_token");
    if (token) {
      authService.getMe()
        .then(res => {
          if (res.success && res.user) {
            setAuthUser(res.user);
          } else {
            localStorage.removeItem("manzio_token");
          }
        })
        .catch(() => {
          localStorage.removeItem("manzio_token");
        })
        .finally(() => {
          setLoadingSession(false);
        });
    } else {
      setLoadingSession(false);
    }
  }, []);

  // Fetch notifications helper
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationService.getAll();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    try {
      const res = await activityService.getAll();
      if (res.success) {
        setSystemActivities(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    }
  }, []);

  // Fetch all workspace data on authentication
  useEffect(() => {
    if (!authUser) {
      setProposals([]);
      setClients([]);
      setUsers([]);
      setTemplates([]);
      setNotifications([]);
      setReports([]);
      setSystemActivities([]);
      return;
    }

    const loadData = async () => {
      try {
        const [propsRes, clientsRes, templatesRes, settingsRes, notificationsRes, reportsRes, activitiesRes] = await Promise.all([
          proposalService.getAll(),
          clientService.getAll(),
          templateService.getAll(),
          settingsService.get(),
          notificationService.getAll(),
          reportService.getAll(),
          activityService.getAll()
        ]);

        if (propsRes.success) setProposals(propsRes.data);
        if (clientsRes.success) setClients(clientsRes.data);
        if (templatesRes.success) setTemplates(templatesRes.data);
        if (settingsRes.success && settingsRes.data) setSettings(settingsRes.data);
        if (notificationsRes.success) setNotifications(notificationsRes.data);
        if (reportsRes.success) setReports(reportsRes.data);
        if (activitiesRes.success) setSystemActivities(activitiesRes.data);

        if (['admin', 'management'].includes(authUser.role)) {
          const usersRes = await userService.getAll();
          if (usersRes.success) {
            setUsers(usersRes.data);
          }
        }
      } catch (err) {
        console.error("Failed to sync workspace data:", err);
        pushToast("Failed to sync workspace data.", "danger");
      }
    };

    loadData();
  }, [authUser, pushToast]);

  const login = useCallback((user) => {
    setAuthUser(user);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthUser(null);
  }, []);

  // Notifications
  const markNotificationRead = useCallback(async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  }, []);

  // Settings
  const saveSettings = useCallback(async (settingsData) => {
    try {
      const res = await settingsService.update(settingsData);
      if (res.success) {
        setSettings(res.data);
        pushToast("Settings saved successfully.", "success");
        return res.data;
      } else {
        pushToast(res.message || "Failed to save settings.", "danger");
        return null;
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      pushToast("Failed to save settings.", "danger");
      return null;
    }
  }, [pushToast]);

  // Proposals
  const addProposal = useCallback(async (proposalData) => {
    try {
      const res = await proposalService.create(proposalData);
      if (res.success) {
        setProposals(prev => [res.data, ...prev]);
        fetchNotifications();
        pushToast("Proposal created successfully.", "success");
        return res.data;
      } else {
        pushToast(res.message || "Failed to create proposal.", "danger");
        return null;
      }
    } catch (err) {
      console.error("Failed to create proposal:", err);
      pushToast("Failed to create proposal.", "danger");
      return null;
    }
  }, [pushToast, fetchNotifications]);

  const updateProposal = useCallback(async (id, proposalData) => {
    try {
      const res = await proposalService.update(id, proposalData);
      if (res.success) {
        setProposals(prev => prev.map(p => p.id === id ? res.data : p));
        fetchNotifications();
        pushToast("Proposal updated successfully.", "success");
        return res.data;
      } else {
        pushToast(res.message || "Failed to update proposal.", "danger");
        return null;
      }
    } catch (err) {
      console.error("Failed to update proposal:", err);
      pushToast("Failed to update proposal.", "danger");
      return null;
    }
  }, [pushToast, fetchNotifications]);

  const updateProposalStatus = useCallback(async (id, status, note) => {
    try {
      const res = await proposalService.updateStatus(id, status, note);
      if (res.success) {
        setProposals(prev => prev.map(p => p.id === id ? res.data : p));
        fetchNotifications();
        pushToast(`Proposal status updated to "${status}".`, "success");
      } else {
        pushToast(res.message || "Failed to update proposal status.", "danger");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      pushToast("Failed to update status.", "danger");
    }
  }, [pushToast, fetchNotifications]);

  const removeProposal = useCallback(async (id) => {
    try {
      const res = await proposalService.remove(id);
      if (res.success) {
        setProposals(prev => prev.filter(p => p.id !== id));
        fetchActivityLogs();
        pushToast('Proposal deleted.', 'success');
      }
    } catch (err) {
      console.error("Failed to delete proposal:", err);
      pushToast('Failed to delete proposal.', 'danger');
    }
  }, [pushToast, fetchActivityLogs]);

  const duplicateProposal = useCallback(async (id) => {
    try {
      const res = await proposalService.duplicate(id);
      if (res.success) {
        setProposals(prev => [res.data, ...prev]);
        fetchActivityLogs();
        pushToast('Proposal duplicated successfully.', 'success');
        return res.data;
      } else {
        pushToast(res.message || 'Failed to duplicate proposal.', 'danger');
      }
    } catch (err) {
      console.error("Failed to duplicate proposal:", err);
      pushToast('Failed to duplicate proposal.', 'danger');
    }
    return null;
  }, [pushToast, fetchActivityLogs]);

  const sendProposal = useCallback(async (id) => {
    try {
      const res = await proposalService.send(id);
      if (res.success) {
        setProposals(prev => prev.map(p => p.id === id ? res.data : p));
        fetchNotifications();
        fetchActivityLogs();
        pushToast('Proposal sent to client successfully.', 'success');
        return res.data;
      } else {
        pushToast(res.message || 'Failed to send proposal.', 'danger');
      }
    } catch (err) {
      console.error("Failed to send proposal:", err);
      pushToast('Failed to send proposal.', 'danger');
    }
    return null;
  }, [pushToast, fetchNotifications, fetchActivityLogs]);

  // Clients
  const addClient = useCallback(async (clientData) => {
    try {
      const res = await clientService.create(clientData);
      if (res.success) {
        setClients(prev => [...prev, res.data]);
        fetchNotifications();
        pushToast('Client added successfully.', 'success');
        return res.data;
      } else {
        pushToast(res.message || 'Failed to add client.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Failed to add client:', err);
      pushToast('Failed to add client.', 'danger');
      return null;
    }
  }, [pushToast, fetchNotifications]);

  const updateClient = useCallback(async (id, clientData) => {
    try {
      const res = await clientService.update(id, clientData);
      if (res.success) {
        setClients(prev => prev.map(c => c.id === id ? res.data : c));
        pushToast('Client updated successfully.', 'success');
        return res.data;
      } else {
        pushToast(res.message || 'Failed to update client.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Failed to update client:', err);
      pushToast('Failed to update client.', 'danger');
      return null;
    }
  }, [pushToast]);

  const removeClient = useCallback(async (id) => {
    try {
      const res = await clientService.remove(id);
      if (res.success) {
        setClients(prev => prev.filter(c => c.id !== id));
        pushToast('Client deleted successfully.', 'success');
        return true;
      } else {
        pushToast(res.message || 'Failed to delete client.', 'danger');
        return false;
      }
    } catch (err) {
      console.error('Failed to delete client:', err);
      pushToast('Failed to delete client.', 'danger');
      return false;
    }
  }, [pushToast]);

  // Users
  const addUser = useCallback(async (userData) => {
    try {
      const res = await userService.create(userData);
      if (res.success) {
        setUsers(prev => [...prev, res.data]);
        fetchNotifications();
        fetchActivityLogs();
        pushToast('User added successfully.', 'success');
        return res.data;
      } else {
        pushToast(res.message || 'Failed to add user.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Failed to add user:', err);
      pushToast(err.response?.data?.message || 'Failed to add user.', 'danger');
      return null;
    }
  }, [pushToast, fetchNotifications, fetchActivityLogs]);

  const updateUser = useCallback(async (id, userData) => {
    try {
      const res = await userService.update(id, userData);
      if (res.success) {
        setUsers(prev => prev.map(u => u.id === id ? res.data : u));
        fetchActivityLogs();
        pushToast('User updated successfully.', 'success');
        return res.data;
      } else {
        pushToast(res.message || 'Failed to update user.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Failed to update user:', err);
      pushToast(err.response?.data?.message || 'Failed to update user.', 'danger');
      return null;
    }
  }, [pushToast, fetchActivityLogs]);

  const deleteUser = useCallback(async (id) => {
    try {
      const res = await userService.remove(id);
      if (res.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        fetchActivityLogs();
        pushToast('User deleted successfully.', 'success');
        return true;
      } else {
        pushToast(res.message || 'Failed to delete user.', 'danger');
        return false;
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      pushToast(err.response?.data?.message || 'Failed to delete user.', 'danger');
      return false;
    }
  }, [pushToast, fetchActivityLogs]);

  const toggleUserStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await userService.updateStatus(id, newStatus);
      if (res.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        fetchActivityLogs();
        pushToast(`User status set to ${newStatus}.`, 'success');
        return true;
      } else {
        pushToast(res.message || 'Failed to update user status.', 'danger');
        return false;
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      pushToast(err.response?.data?.message || 'Failed to update user status.', 'danger');
      return false;
    }
  }, [pushToast, fetchActivityLogs]);

  // Auth Profile / Password
  const updateProfile = useCallback(async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success) {
        setAuthUser(res.user);
        fetchActivityLogs();
        pushToast('Profile updated successfully.', 'success');
        return res.user;
      } else {
        pushToast(res.message || 'Failed to update profile.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      pushToast('Failed to update profile.', 'danger');
      return null;
    }
  }, [pushToast, fetchActivityLogs]);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const res = await authService.changePassword(oldPassword, newPassword);
      if (res.success) {
        fetchActivityLogs();
        pushToast('Password changed successfully.', 'success');
        return true;
      } else {
        pushToast(res.message || 'Failed to change password.', 'danger');
        return false;
      }
    } catch (err) {
      console.error('Failed to change password:', err);
      pushToast(err.response?.data?.message || 'Failed to change password.', 'danger');
      return false;
    }
  }, [pushToast, fetchActivityLogs]);

  // Templates
  const addTemplate = useCallback(async (templateData) => {
    try {
      const res = await templateService.create(templateData);
      if (res.success) {
        setTemplates(prev => [...prev, res.data]);
        pushToast('Template created successfully.', 'success');
        return res.data;
      } else {
        pushToast(res.message || 'Failed to create template.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Failed to create template:', err);
      pushToast('Failed to create template.', 'danger');
      return null;
    }
  }, [pushToast]);

  const updateTemplate = useCallback(async (id, templateData) => {
    try {
      const res = await templateService.update(id, templateData);
      if (res.success) {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...res.data } : t));
        pushToast('Template updated successfully.', 'success');
        return res.data;
      } else {
        pushToast(res.message || 'Failed to update template.', 'danger');
        return null;
      }
    } catch (err) {
      console.error('Failed to update template:', err);
      pushToast('Failed to update template.', 'danger');
      return null;
    }
  }, [pushToast]);

  const removeTemplate = useCallback(async (id) => {
    try {
      const res = await templateService.remove(id);
      if (res.success) {
        setTemplates(prev => prev.filter(t => t.id !== id));
        fetchActivityLogs();
        pushToast('Template deleted.', 'success');
        return true;
      } else {
        pushToast(res.message || 'Failed to delete template.', 'danger');
        return false;
      }
    } catch (err) {
      console.error('Failed to delete template:', err);
      pushToast('Failed to delete template.', 'danger');
      return false;
    }
  }, [pushToast, fetchActivityLogs]);

  const activateTemplate = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await templateService.activate(id, newStatus);
      if (res.success) {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        fetchActivityLogs();
        pushToast(`Template status set to ${newStatus}.`, 'success');
        return true;
      } else {
        pushToast(res.message || 'Failed to update template status.', 'danger');
        return false;
      }
    } catch (err) {
      console.error('Failed to update template status:', err);
      pushToast('Failed to update template status.', 'danger');
      return false;
    }
  }, [pushToast, fetchActivityLogs]);

  // Reports
  const addReportLog = useCallback(async (name, type, reportData) => {
    try {
      const res = await reportService.create({ name, type, data: reportData });
      if (res.success) {
        setReports(prev => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Failed to save report log:', err);
    }
    return null;
  }, []);

  const removeReportLog = useCallback(async (id) => {
    try {
      const res = await reportService.remove(id);
      if (res.success) {
        setReports(prev => prev.filter(r => r.id !== id));
        pushToast('Report log deleted.', 'success');
        return true;
      }
    } catch (err) {
      console.error('Failed to delete report log:', err);
      pushToast('Failed to delete report log.', 'danger');
    }
    return false;
  }, [pushToast]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    authUser,
    isLoggedIn: !!authUser,
    login,
    logout,
    role: authUser?.role || 'management',
    setRole: () => {},
    currentUser: authUser || { name: 'Guest', role: 'management', avatarColor: '#94A3B8' },
    users,
    clients,
    templates,
    proposals,
    setProposals,
    updateProposalStatus,
    addProposal,
    updateProposal,
    removeProposal,
    duplicateProposal,
    sendProposal,
    addClient,
    updateClient,
    removeClient,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateProfile,
    changePassword,
    addTemplate,
    updateTemplate,
    removeTemplate,
    activateTemplate,
    settings,
    saveSettings,
    reports,
    addReportLog,
    removeReportLog,
    toasts,
    pushToast,
    darkMode,
    toggleDarkMode,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    loadingSession,
    systemActivities,
    fetchActivityLogs,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

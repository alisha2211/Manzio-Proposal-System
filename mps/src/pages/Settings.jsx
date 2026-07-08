import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Card, PageHeader, Button, Avatar } from '../components/ui.jsx';
import { Edit2, Trash2 } from 'lucide-react';
import './Settings.css';

const TABS = ['Company', 'Proposal Numbering', 'Users & Roles', 'Notifications', 'Activity Log', 'My Profile'];
const AVATAR_COLORS = ['#FF4D2E', '#5B8DEF', '#1A8754', '#C98A1F', '#8A8F98', '#7C3AED', '#EC4899'];

export default function Settings() {
  const {
    users, pushToast, addUser, updateUser, deleteUser, toggleUserStatus,
    currentUser, role, settings, saveSettings,
    updateProfile, changePassword, systemActivities
  } = useApp();
  
  const [tab, setTab] = useState('Company');

  const allowedTabs = role === 'admin'
    ? ['Company', 'Proposal Numbering', 'Users & Roles', 'Notifications', 'Activity Log', 'My Profile']
    : ['Notifications', 'My Profile'];

  useEffect(() => {
    if (role && role !== 'admin') {
      setTab('My Profile');
    }
  }, [role]);

  const fileInputRef = useRef(null);

  // --- Company states ---
  const [companyName, setCompanyName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [defaultTax, setDefaultTax] = useState(18);
  const [address, setAddress] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);

  // --- Numbering states ---
  const [prefix, setPrefix] = useState('MZ');
  const [format, setFormat] = useState('{PREFIX}-{YYYY}-{####}');
  const [nextNumber, setNextNumber] = useState('0122');
  const [validityDays, setValidityDays] = useState(30);

  // --- Profile states ---
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileAvatarColor, setProfileAvatarColor] = useState(AVATAR_COLORS[0]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- User Editing states ---
  const [editUser, setEditUser] = useState(null); // User currently being edited
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('management');
  const [editAvatarColor, setEditAvatarColor] = useState(AVATAR_COLORS[0]);
  const [editPassword, setEditPassword] = useState('');

  // Load settings on mount / settings update
  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName || '');
      setSupportEmail(settings.email || '');
      setPhone(settings.phone || '');
      setWebsite(settings.website || '');
      setGstNumber(settings.gstNumber || '');
      setCurrency(settings.currency || 'INR');
      setDefaultTax(settings.taxPercentage !== undefined ? settings.taxPercentage : 18);
      setAddress(settings.address || '');
      setCompanyLogo(settings.companyLogo || null);

      setPrefix(settings.numberPrefix || 'MZ');
      setFormat(settings.numberFormat || '{PREFIX}-{YYYY}-{####}');
      setNextNumber(settings.nextNumber || '0122');
      setValidityDays(settings.validityDays !== undefined ? settings.validityDays : 30);
    }
  }, [settings]);

  // Load profile details
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setProfileAvatarColor(currentUser.avatarColor || AVATAR_COLORS[0]);
    }
  }, [currentUser]);

  // --- Notification states ---
  const [notifPreferences, setNotifPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('manzio_notif_prefs');
      return saved ? JSON.parse(saved) : {
        'Proposal created': true,
        'Approvals': true,
        'Client viewed': true,
        'Expiry reminders': true,
      };
    } catch {
      return {
        'Proposal created': true,
        'Approvals': true,
        'Client viewed': true,
        'Expiry reminders': true,
      };
    }
  });

  // --- New User states ---
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('management');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await saveSettings({ ...settings, companyLogo: ev.target.result });
        if (res) {
          setCompanyLogo(res.companyLogo);
          pushToast('Company logo updated successfully.', 'success');
        }
      } catch (err) {
        console.error('Logo upload failed:', err);
        pushToast('Failed to upload logo.', 'danger');
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveCompany() {
    const data = {
      ...settings,
      companyName: companyName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: supportEmail.trim(),
      website: website.trim(),
      gstNumber: gstNumber.trim(),
      currency,
      taxPercentage: Number(defaultTax),
    };
    await saveSettings(data);
  }

  async function handleSaveNumbering() {
    const data = {
      ...settings,
      numberPrefix: prefix.trim(),
      numberFormat: format.trim(),
      nextNumber: nextNumber.trim(),
      validityDays: Number(validityDays),
    };
    await saveSettings(data);
  }

  function handleToggleNotif(prefName) {
    setNotifPreferences(prev => {
      const next = { ...prev, [prefName]: !prev[prefName] };
      localStorage.setItem('manzio_notif_prefs', JSON.stringify(next));
      return next;
    });
  }

  async function handleAddUser(e) {
    e.preventDefault();
    if (!name.trim()) {
      pushToast('Name is required.', 'danger');
      return;
    }
    if (!email.trim()) {
      pushToast('Email address is required.', 'danger');
      return;
    }
    if (!password) {
      pushToast('Password is required.', 'danger');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      pushToast('Please enter a valid email address.', 'danger');
      return;
    }

    // Password length validation
    if (password.length < 6) {
      pushToast('Password must be at least 6 characters long.', 'danger');
      return;
    }

    // Duplicate user check
    const isDuplicate = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (isDuplicate) {
      pushToast('A user with this email address already exists.', 'danger');
      return;
    }

    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: userRole,
      avatarColor
    };

    const saved = await addUser(userData);
    if (saved) {
      setShowAdd(false);
      setName('');
      setEmail('');
      setPassword('');
      setUserRole('management');
      setAvatarColor(AVATAR_COLORS[0]);
    }
  }

  async function handleEditUserSubmit(e) {
    e.preventDefault();
    if (!editName.trim() || !editUser) return;

    const userData = {
      name: editName.trim(),
      email: editUser.email,
      role: editRole,
      avatarColor: editAvatarColor,
    };
    if (editPassword) {
      userData.password = editPassword;
    }

    const saved = await updateUser(editUser.id, userData);
    if (saved) {
      setEditUser(null);
      setEditPassword('');
    }
  }

  async function handleUpdateProfileSubmit(e) {
    e.preventDefault();
    if (!profileName.trim()) {
      pushToast('Name is required.', 'danger');
      return;
    }
    if (!profileEmail.trim()) {
      pushToast('Email is required.', 'danger');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileEmail.trim())) {
      pushToast('Please enter a valid email address.', 'danger');
      return;
    }

    // Check duplicate email on other users
    const isDuplicate = users.some(u => u.id !== currentUser.id && u.email.toLowerCase() === profileEmail.trim().toLowerCase());
    if (isDuplicate) {
      pushToast('Email address is already in use by another user.', 'danger');
      return;
    }

    const res = await updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      avatarColor: profileAvatarColor
    });
    if (res) {
      pushToast('Profile updated successfully.', 'success');
    }
  }

  async function handleChangePasswordSubmit(e) {
    e.preventDefault();
    if (!oldPassword) {
      pushToast('Current password is required.', 'danger');
      return;
    }
    if (!newPassword) {
      pushToast('New password is required.', 'danger');
      return;
    }
    if (newPassword.length < 6) {
      pushToast('New password must be at least 6 characters long.', 'danger');
      return;
    }
    if (newPassword !== confirmPassword) {
      pushToast('New passwords do not match.', 'danger');
      return;
    }
    const res = await changePassword(oldPassword, newPassword);
    if (res) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }

  function startEditUser(u) {
    setEditUser(u);
    setEditName(u.name || '');
    setEditRole(u.role || 'management');
    setEditAvatarColor(u.avatarColor || AVATAR_COLORS[0]);
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="System Settings" description="Company information, numbering, notifications, and access control." />

      <div className="settings-tabs">
        {allowedTabs.map(t => (
          <button key={t} className={`settings-tab ${tab === t ? 'is-active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Company' && allowedTabs.includes('Company') && (
        <Card className="settings-card">
          <h3>Company information</h3>
          <div className="settings-field-grid">
            <div className="ui-field">
              <label>Company name</label>
              <input value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
            <div className="ui-field">
              <label>Support email</label>
              <input value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
            </div>
            <div className="ui-field">
              <label>Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +91 98470 22310" />
            </div>
            <div className="ui-field">
              <label>Website</label>
              <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="e.g. https://manzio.studio" />
            </div>
            <div className="ui-field">
              <label>GST Number</label>
              <input value={gstNumber} onChange={e => setGstNumber(e.target.value)} placeholder="e.g. 32ABCDE1234F1Z5" />
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
              <label>Default tax (%)</label>
              <input type="number" value={defaultTax} onChange={e => setDefaultTax(Number(e.target.value))} />
            </div>
            <div className="ui-field settings-span-2">
              <label>Address</label>
              <input value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          <div className="settings-logo-row">
            <div className="settings-logo-preview" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {companyLogo ? <img src={companyLogo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : 'M'}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleLogoUpload}
              />
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                Upload new logo
              </Button>
              {companyLogo && (
                <Button variant="ghost" size="sm" style={{ color: 'var(--danger)', marginLeft: 8 }} onClick={() => setCompanyLogo(null)}>
                  Remove logo
                </Button>
              )}
              <p className="settings-hint">PNG, JPG or SVG, transparent background recommended.</p>
            </div>
          </div>
          <Button variant="accent" onClick={handleSaveCompany}>Save Changes</Button>
        </Card>
      )}

      {tab === 'Proposal Numbering' && allowedTabs.includes('Proposal Numbering') && (
        <Card className="settings-card">
          <h3>Proposal numbering format</h3>
          <div className="settings-field-grid">
            <div className="ui-field">
              <label>Prefix</label>
              <input value={prefix} onChange={e => setPrefix(e.target.value)} />
            </div>
            <div className="ui-field">
              <label>Format</label>
              <input value={format} onChange={e => setFormat(e.target.value)} className="mono" />
            </div>
            <div className="ui-field">
              <label>Next number</label>
              <input value={nextNumber} onChange={e => setNextNumber(e.target.value)} className="mono" />
            </div>
            <div className="ui-field">
              <label>Default validity (days)</label>
              <input type="number" value={validityDays} onChange={e => setValidityDays(Number(e.target.value))} />
            </div>
          </div>
          <p className="settings-preview">Preview: <span className="mono">{prefix}-2026-{nextNumber}</span></p>
          <Button variant="accent" onClick={handleSaveNumbering}>Save Changes</Button>
        </Card>
      )}

      {tab === 'Users & Roles' && allowedTabs.includes('Users & Roles') && (
        <Card className="settings-card settings-card--table">
          <div className="settings-card-header">
            <h3>Users &amp; roles</h3>
            {role === 'admin' && <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>+ Add User</Button>}
          </div>
          <table className="ui-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Email</th>
                <th>Proposals</th>
                <th>Status</th>
                {role === 'admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar user={u} size={28} />
                      {u.name}
                    </div>
                  </td>
                  <td>
                    <span className="settings-role-tag">
                      {u.role === 'management' ? 'Manager' : u.role === 'sales' ? 'Sales' : 'Super Admin'}
                    </span>
                  </td>
                  <td>{u.email}</td>
                  <td className="mono">{u.proposalsSent || 0}</td>
                  <td>
                    <button
                      disabled={role !== 'admin' || u.id === currentUser.id}
                      onClick={() => toggleUserStatus(u.id, u.status)}
                      className={`status-btn-toggle ${u.status === 'active' ? 'active' : 'inactive'}`}
                      style={{
                        padding: '4px 10px',
                        fontSize: '10px',
                        fontWeight: '600',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: role === 'admin' && u.id !== currentUser.id ? 'pointer' : 'default',
                        backgroundColor: u.status === 'active' ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: u.status === 'active' ? 'var(--success)' : 'var(--danger)',
                        opacity: u.id === currentUser.id ? 0.6 : 1
                      }}
                    >
                      {u.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  {role === 'admin' && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ padding: 6 }}
                          onClick={() => startEditUser(u)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ padding: 6, color: 'var(--danger)' }}
                          disabled={u.id === currentUser.id}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete user ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'Notifications' && (
        <Card className="settings-card">
          <h3>Notification preferences</h3>
          <div className="settings-toggle-list">
            {[
              ['Proposal created', 'Notify Manager when a new proposal is created'],
              ['Approvals', 'Notify Manager when a proposal is approved or rejected'],
              ['Client viewed', 'Notify Manager when a client opens a proposal'],
              ['Expiry reminders', 'Remind Manager 3 days before a proposal expires'],
            ].map(([title, desc]) => (
              <div className="settings-toggle-row" key={title}>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    checked={!!notifPreferences[title]}
                    onChange={() => handleToggleNotif(title)}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>
            ))}
          </div>
          <Button variant="accent" onClick={() => pushToast('Notification preferences saved.', 'success')}>Save Changes</Button>
        </Card>
      )}

      {tab === 'Activity Log' && allowedTabs.includes('Activity Log') && (
        <Card className="settings-card settings-card--table">
          <h3>Activity log</h3>
          <table className="ui-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {systemActivities && systemActivities.length > 0 ? (
                systemActivities.map((row, i) => (
                  <tr key={i}>
                    <td className="mono" style={{ fontSize: '10px' }}>{new Date(row.createdAt).toLocaleString('en-IN')}</td>
                    <td>{row.userName}</td>
                    <td><strong>{row.action}</strong></td>
                    <td className="pp-dim" style={{ fontSize: '10px' }}>{row.description || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
                    No activity logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'My Profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Card className="settings-card">
            <h3>Edit Profile Details</h3>
            <form onSubmit={handleUpdateProfileSubmit}>
              <div className="settings-field-grid" style={{ marginBottom: 16 }}>
                <div className="ui-field">
                  <label>Full Name</label>
                  <input required value={profileName} onChange={e => setProfileName(e.target.value)} />
                </div>
                <div className="ui-field">
                  <label>Email Address</label>
                  <input type="email" required value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                </div>
              </div>
              <div className="ui-field" style={{ marginBottom: 16 }}>
                <label>Avatar Color</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {AVATAR_COLORS.map(c => (
                    <button
                      type="button"
                      key={c}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: c,
                        border: profileAvatarColor === c ? '2px solid var(--text-primary)' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setProfileAvatarColor(c)}
                    />
                  ))}
                </div>
              </div>
              <Button variant="accent" type="submit">Update Profile</Button>
            </form>
          </Card>

          <Card className="settings-card">
            <h3>Change Password</h3>
            <form onSubmit={handleChangePasswordSubmit}>
              <div className="settings-field-grid" style={{ marginBottom: 16 }}>
                <div className="ui-field">
                  <label>Current Password</label>
                  <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="ui-field">
                  <label>New Password</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" />
                </div>
                <div className="ui-field">
                  <label>Confirm New Password</label>
                  <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-type new password" />
                </div>
              </div>
              <Button variant="accent" type="submit">Update Password</Button>
            </form>
          </Card>
        </div>
      )}

      {showAdd && (
        <div className="ui-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <h2 className="pd-modal-title">Create a new user</h2>
            <p className="pd-modal-desc" style={{ marginBottom: 16 }}>Register a new workspace member with access permissions.</p>
            <form onSubmit={handleAddUser}>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Name *</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Email Address *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@manzio.studio" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Password *</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Role</label>
                <select value={userRole} onChange={e => setUserRole(e.target.value)}>
                  <option value="management">Manager</option>
                  <option value="admin">Super Admin</option>
                  <option value="sales">Sales Representative</option>
                </select>
              </div>
              <div className="ui-field" style={{ marginBottom: 16 }}>
                <label>Avatar Color</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {AVATAR_COLORS.map(c => (
                    <button
                      type="button"
                      key={c}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: c,
                        border: avatarColor === c ? '2px solid var(--text-primary)' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setAvatarColor(c)}
                    />
                  ))}
                </div>
              </div>
              <div className="pd-modal-actions">
                <Button variant="ghost" type="button" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button variant="accent" type="submit">Create User</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editUser && (
        <div className="ui-modal-overlay" onClick={() => setEditUser(null)}>
          <div className="ui-modal" onClick={e => e.stopPropagation()}>
            <h2 className="pd-modal-title">Edit user details</h2>
            <p className="pd-modal-desc" style={{ marginBottom: 16 }}>Update workspace access or change password for {editUser.name}.</p>
            <form onSubmit={handleEditUserSubmit}>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Name *</label>
                <input required value={editName} onChange={e => setEditName(e.target.value)} placeholder="Full Name" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Email Address (Cannot change)</label>
                <input disabled value={editUser.email} style={{ opacity: 0.6 }} />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Change Password (Leave blank to keep same)</label>
                <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="New Password" />
              </div>
              <div className="ui-field" style={{ marginBottom: 12 }}>
                <label>Role</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)}>
                  <option value="management">Manager</option>
                  <option value="admin">Super Admin</option>
                  <option value="sales">Sales Representative</option>
                </select>
              </div>
              <div className="ui-field" style={{ marginBottom: 16 }}>
                <label>Avatar Color</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {AVATAR_COLORS.map(c => (
                    <button
                      type="button"
                      key={c}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: c,
                        border: editAvatarColor === c ? '2px solid var(--text-primary)' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setEditAvatarColor(c)}
                    />
                  ))}
                </div>
              </div>
              <div className="pd-modal-actions">
                <Button variant="ghost" type="button" onClick={() => setEditUser(null)}>Cancel</Button>
                <Button variant="accent" type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
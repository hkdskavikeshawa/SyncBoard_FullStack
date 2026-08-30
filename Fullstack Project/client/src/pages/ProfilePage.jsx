import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Trash2, RefreshCw } from 'lucide-react';

const getBrowserAndOS = () => {
  const ua = navigator.userAgent;
  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Windows';
  if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return `${browser} on ${os}`;
};

const getFallbackLocation = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const parts = tz.split('/');
      const city = parts[parts.length - 1].replace(/_/g, ' ');
      if (city === 'Colombo') return 'Colombo, Sri Lanka';
      return `${city}, ${parts[0]}`;
    }
  } catch (e) {}
  return 'Colombo, Sri Lanka';
};

const INITIAL_MOCK_SESSIONS = [
  { id: 1, device: getBrowserAndOS(), location: getFallbackLocation(), current: true },
  { id: 2, device: 'Safari on iPhone', location: 'New York, US', current: false },
  { id: 3, device: 'Firefox on Ubuntu', location: 'Berlin, DE', current: false },
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.name || 'Ayesha',
    email: user?.email || 'ayesha@gmail.com',
    bio: user?.bio || 'Senior Product Designer leading onboarding and user experience improvements.',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    const saved = localStorage.getItem(`user_2fa_${user?.id}`);
    return saved !== null ? saved === 'true' : true;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(`user_sessions_${user?.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MOCK_SESSIONS;
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const updateCurrentSessionLocation = async () => {
      const detectedDevice = getBrowserAndOS();
      let detectedLocation = getFallbackLocation();

      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          if (data.city && data.country_name) {
            detectedLocation = `${data.city}, ${data.country_name}`;
          }
        }
      } catch (e) {
        // use fallback timezone location
      }

      if (isMounted) {
        setSessions(prev => prev.map(s => s.current ? { ...s, device: detectedDevice, location: detectedLocation } : s));
      }
    };

    updateCurrentSessionLocation();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.name || 'Ayesha',
        email: user.email || 'ayesha@gmail.com',
        bio: user.bio || 'Senior Product Designer leading onboarding and user experience improvements.',
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const showNotification = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback({ message: '', type: '' });
    }, 3500);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result;
      setAvatarPreview(base64Url);
      updateUser({ avatar: base64Url });
      showNotification('Profile photo uploaded & saved successfully! 📸');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    updateUser({
      name: formData.displayName,
      email: formData.email,
      bio: formData.bio,
      avatar: avatarPreview
    });
    showNotification('Personal details saved successfully! 🎉');
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (!passwords.currentPassword) {
      showNotification('Please enter your current password.', 'error');
      return;
    }
    if (passwords.newPassword.length < 6) {
      showNotification('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showNotification('New password and confirm password do not match.', 'error');
      return;
    }
    showNotification('Password updated successfully! 🔒');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggle2FA = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    localStorage.setItem(`user_2fa_${user?.id}`, String(newValue));
    showNotification(newValue ? 'Two-Factor Authentication enabled!' : 'Two-Factor Authentication disabled.');
  };

  const revokeSession = (id) => {
    const targetSession = sessions.find(s => s.id === id);
    if (targetSession?.current) {
      if (window.confirm('Revoking your current active session will log you out. Continue?')) {
        logout();
      }
      return;
    }

    const nextSessions = sessions.filter((s) => s.id !== id);
    setSessions(nextSessions);
    localStorage.setItem(`user_sessions_${user?.id}`, JSON.stringify(nextSessions));
    showNotification(`Session "${targetSession?.device || 'Active Session'}" revoked successfully!`);
  };

  const handleResetSessions = () => {
    setSessions(INITIAL_MOCK_SESSIONS);
    localStorage.removeItem(`user_sessions_${user?.id}`);
    showNotification('Default mock active sessions restored!');
  };

  const initials = (formData.displayName || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', padding: '24px 20px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontWeight: 600, fontSize: '0.95rem' }}>← Back to Board</Link>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-main)' }}>My Profile</div>
        </div>

        {feedback.message && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 18px', borderRadius: '12px', marginBottom: '20px',
            background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${feedback.type === 'error' ? '#EF4444' : 'var(--color-success)'}`,
            color: feedback.type === 'error' ? '#EF4444' : 'var(--color-success)',
            fontWeight: 600, fontSize: '0.95rem'
          }}>
            {feedback.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div style={{ display: 'grid', gap: '22px' }}>
          {/* Header Summary Banner */}
          <section style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden', background: 'var(--color-primary)', border: '3px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '2rem' }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials
                )}
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-text-main)' }}>{formData.displayName}</h2>
                <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>{formData.email}</p>
              </div>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {/* Personal Details */}
            <section style={cardStyle}>
              <h3 style={sectionTitle}>Personal Details</h3>
              <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '18px' }}>
                <label style={fieldStyle}>
                  <span>Display Name</span>
                  <input
                    value={formData.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    style={inputStyle}
                    placeholder="Your display name"
                  />
                </label>

                <label style={fieldStyle}>
                  <span>Contact Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={inputStyle}
                    placeholder="you@company.com"
                  />
                </label>

                <label style={fieldStyle}>
                  <span>Bio / Job Title</span>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
                    placeholder="Short bio or job title"
                  />
                </label>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ ...badgeStyle, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>Role: Admin</span>
                  <span style={{ ...badgeStyle, background: 'rgba(15, 118, 110, 0.15)', color: 'var(--color-primary)' }}>Active</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', cursor: 'pointer', fontWeight: 700 }}>
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Avatar Management */}
            <section style={cardStyle}>
              <h3 style={sectionTitle}>Avatar Management</h3>

              <div style={{ display: 'grid', gap: '18px', justifyItems: 'center' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: 'var(--color-surface)', border: '2px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>{initials}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn"
                  style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Upload New Photo
                </button>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarSelect} style={{ display: 'none' }} />

                <p style={{ margin: 0, color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.85rem' }}>
                  Recommended size: 800 × 800 px. Saved automatically.
                </p>
              </div>
            </section>
          </div>

          {/* Security Settings & Active Sessions */}
          <section style={cardStyle}>
            <h3 style={sectionTitle}>Security Settings</h3>

            <div style={{ display: 'grid', gap: '22px' }}>
              <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <label style={fieldStyle}>
                    <span>Current Password</span>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      style={inputStyle}
                      placeholder="Enter current password"
                    />
                  </label>

                  <label style={fieldStyle}>
                    <span>New Password</span>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      style={inputStyle}
                      placeholder="Choose a new password"
                    />
                  </label>

                  <label style={fieldStyle}>
                    <span>Confirm Password</span>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      style={inputStyle}
                      placeholder="Confirm new password"
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', cursor: 'pointer', fontWeight: 700 }}>
                    Update Password
                  </button>
                </div>
              </form>

              {/* 2FA Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', paddingTop: '6px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Two-Factor Authentication</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Secure your account with an extra verification step.</div>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  aria-label="Toggle two-factor authentication"
                  style={{
                    position: 'relative',
                    width: '58px',
                    height: '32px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    background: twoFactorEnabled ? 'var(--color-primary)' : '#d1d5db',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: twoFactorEnabled ? '30px' : '4px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>

              {/* Active Sessions List */}
              <div style={{ paddingTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, color: 'var(--color-text-main)' }}>Active Sessions</h4>
                  {sessions.length < INITIAL_MOCK_SESSIONS.length && (
                    <button type="button" onClick={handleResetSessions} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RefreshCw size={14} /> Reset Mock Sessions
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {sessions.map((session) => (
                    <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--color-background)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{session.device}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{session.location}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {session.current && (
                          <span style={{ ...badgeStyle, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>Current</span>
                        )}
                        <button type="button" onClick={() => revokeSession(session.id)} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #fca5a5', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Trash2 size={14} /> Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '18px',
  padding: '22px',
  boxShadow: 'var(--shadow-md)',
};

const sectionTitle = {
  margin: '0 0 18px',
  color: 'var(--color-text-main)',
  fontSize: '1.25rem',
};

const fieldStyle = {
  display: 'grid',
  gap: '8px',
  fontWeight: 600,
  color: 'var(--color-text-main)',
};

const inputStyle = {
  width: '100%',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '12px 14px',
  color: 'var(--color-text-main)',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
};

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '999px',
  padding: '6px 10px',
  fontSize: '0.72rem',
  fontWeight: 700,
};

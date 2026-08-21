import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.name || 'Bethany Parker',
    email: user?.email || 'bethany@codeforge.io',
    bio: 'Senior Product Designer leading onboarding and user experience improvements.',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'London, UK', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'New York, US', current: false },
    { id: 3, device: 'Firefox on Ubuntu', location: 'Berlin, DE', current: false },
  ]);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // TODO: Connect to AWS S3 presigned upload flow
    console.log('Selected avatar file:', file.name);
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    console.log('Profile update payload:', formData);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    console.log('Password update attempt:', passwords);
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggle2FA = () => setTwoFactorEnabled((prev) => !prev);

  const revokeSession = (id) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const initials = (formData.displayName || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const displayAvatar = avatarPreview || '/logo.png';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', padding: '24px 20px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>← Back to Board</Link>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-main)' }}>My Profile</div>
        </div>

        <div style={{ display: 'grid', gap: '22px' }}>
          <section style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden', background: 'var(--color-primary)', border: '3px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '2rem' }}>
                {displayAvatar === '/logo.png' ? initials : <img src={displayAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-text-main)' }}>{formData.displayName}</h2>
                <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>{formData.email}</p>
              </div>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
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
                  <span style={{ ...badgeStyle, background: '#dcfce7', color: '#166534' }}>Role: Admin</span>
                  <span style={{ ...badgeStyle, background: '#dff7f4', color: '#0f766e' }}>Active</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 18px', cursor: 'pointer', fontWeight: 700 }}>
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

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

                <p style={{ margin: 0, color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  Recommended size: 800 x 800 px.
                </p>
              </div>
            </section>
          </div>

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

              <div style={{ paddingTop: '4px' }}>
                <h4 style={{ margin: '0 0 14px', color: 'var(--color-text-main)' }}>Active Sessions</h4>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {sessions.map((session) => (
                    <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--color-background)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{session.device}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{session.location}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {session.current && (
                          <span style={{ ...badgeStyle, background: '#dcfce7', color: '#166534' }}>Current</span>
                        )}
                        <button type="button" onClick={() => revokeSession(session.id)} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer', fontWeight: 700 }}>
                          Revoke
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
  background: '#fff',
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

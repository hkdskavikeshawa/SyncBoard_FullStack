import { useState } from 'react';
import { X, Calendar, Mail, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ScheduleReportDialog({ onClose }) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [frequency, setFrequency] = useState('weekly');
  const [day, setDay] = useState('Monday');
  const [format, setFormat] = useState('pdf');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: '24px' }}>
      <div className="glass-panel" style={{
        backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
            <Calendar size={22} color="var(--color-primary)" />
            Schedule Automated Reports
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {isSaved ? (
          <div style={{ padding: '36px 24px', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main)', margin: '0 0 8px' }}>Schedule Configured! 🎉</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              Automated <strong>{frequency}</strong> {format.toUpperCase()} reports will be emailed to <strong>{email}</strong> every {frequency === 'monthly' ? '1st of the month' : day}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label htmlFor="schedule-email" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} color="var(--color-primary)" />
                Recipient Email
              </label>
              <input 
                id="schedule-email"
                type="email" 
                required
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="frequency-select" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--color-primary)" />
                Report Frequency
              </label>
              <select 
                id="frequency-select"
                className="input-field" 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="weekly">Weekly Summary</option>
                <option value="biweekly">Bi-Weekly Summary</option>
                <option value="monthly">Monthly Summary</option>
              </select>
            </div>

            {frequency !== 'monthly' && (
              <div>
                <label htmlFor="day-select" className="input-label">Delivery Day</label>
                <select 
                  id="day-select"
                  className="input-field" 
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                >
                  <option value="Monday">Every Monday</option>
                  <option value="Tuesday">Every Tuesday</option>
                  <option value="Wednesday">Every Wednesday</option>
                  <option value="Thursday">Every Thursday</option>
                  <option value="Friday">Every Friday</option>
                  <option value="Saturday">Every Saturday</option>
                  <option value="Sunday">Every Sunday</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="format-select" className="input-label">Export Format</label>
              <select 
                id="format-select"
                className="input-field" 
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="csv">CSV Spreadsheet (.csv)</option>
                <option value="both">Both (PDF + CSV)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Schedule</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

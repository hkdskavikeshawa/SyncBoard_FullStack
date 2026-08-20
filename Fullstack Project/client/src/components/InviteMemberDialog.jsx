import { useState } from 'react'; 
import { X, UserPlus, AlertCircle } from 'lucide-react'; 
import { useTasks } from '../hooks/useTasks'; 
 
export default function InviteMemberDialog({ onClose }) { 
  const [email, setEmail] = useState(''); 
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const { inviteMember } = useTasks(); 
 
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (!email.trim()) return; 
     
    setError(''); 
    setSuccess(''); 
    setIsSubmitting(true); 
     
    try { 
      await inviteMember(email.trim()); 
      setSuccess('User successfully invited to the board!'); 
      setEmail(''); 
      setTimeout(() => { 
        onClose(); 
      }, 1500); 
    } catch (err) { 
      setError(err.message || 'Failed to invite user'); 
    } finally { 
      setIsSubmitting(false); 
    } 
  }; 
 
  return ( 
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}> 
      <div className="glass-panel" style={{ 
        backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', 
        width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-xl)', 
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
      }}> 
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}> 
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}> 
            
            <span style={{ 
              width: '28px', 
              height: '28px', 
              border: '1.5px solid var(--color-primary)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0 
            }}> 
              <UserPlus size={17} color="var(--color-primary)" /> 
            </span> 

            Invite Member 
          </h2> 
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}> 
            <X size={20} /> 
          </button> 
        </div> 
         
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}> 
          <div style={{ marginBottom: '20px' }}> 
            <label htmlFor="email" className="input-label">User's Email Address</label> 
            <input  
              type="email"  
              id="email"  
              className="input-field"  
              placeholder="e.g., alex@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoFocus 
              required 
            /> 
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}> 
              The user must be registered in the system. 
            </p> 
          </div> 
 
          {error && ( 
            <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}> 
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> 
              <span>{error}</span> 
            </div> 
          )} 
 
          {success && ( 
            <div style={{ padding: '12px', backgroundColor: '#D1FAE5', color: '#059669', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '20px' }}> 
              {success} 
            </div> 
          )} 
           
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}> 
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button> 
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !email.trim()}> 
              {isSubmitting ? 'Inviting...' : 'Send Invite'} 
            </button> 
          </div> 
        </form> 
      </div> 
    </div> 
  ); 
}
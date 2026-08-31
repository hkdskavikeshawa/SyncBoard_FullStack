import { useState, useEffect, useRef } from 'react';
import { getComments, addComment } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, Loader2 } from 'lucide-react';

const getAvatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 65%, 55%)`;
};

const formatRelativeTime = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function CommentThread({ taskId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getComments(taskId).then(data => {
      if (alive) { setComments(data); setLoading(false); }
    });
    return () => { alive = false; };
  }, [taskId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      const comment = await addComment(taskId, {
        text: trimmed,
        authorId: user?.id || 'anon',
        authorName: user?.name || 'Anonymous',
      });
      setComments(prev => [...prev, comment]);
      setText('');
      textareaRef.current?.focus();
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          padding: '8px', borderRadius: '10px',
          backgroundColor: 'rgba(15, 118, 110, 0.12)', color: 'var(--color-primary)'
        }}>
          <MessageSquare size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
            Comments
          </h3>
          {!loading && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
          )}
        </div>
      </div>

      {/* Comment List */}
      <div style={{
        maxHeight: '360px', overflowY: 'auto', paddingRight: '4px',
        display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px'
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
            <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : comments.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 24px',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed var(--color-border)',
            color: 'var(--color-text-muted)'
          }}>
            <MessageSquare size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p style={{ margin: 0, fontWeight: 500 }}>No comments yet</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Be the first to add a comment</p>
          </div>
        ) : (
          comments.map((c, i) => (
            <div
              key={c.id}
              className="animate-fade-in"
              style={{
                display: 'flex', gap: '12px',
                animationDelay: `${i * 0.04}s`, opacity: 0
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: getAvatarColor(c.authorName),
                color: '#fff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem',
                flexShrink: 0
              }}>
                {c.authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>

              {/* Bubble */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                    {c.authorName}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    {formatRelativeTime(c.createdAt)}
                  </span>
                </div>
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0 12px 12px 12px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-main)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {c.text}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div style={{
        display: 'flex', gap: '10px', alignItems: 'flex-end',
        padding: '12px', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* My Avatar */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: getAvatarColor(user?.name || 'User'),
          color: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0
        }}>
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment... (Ctrl+Enter to send)"
          rows={2}
          style={{
            flex: 1, resize: 'none', border: 'none', outline: 'none',
            background: 'transparent', fontFamily: 'var(--font-family)',
            fontSize: '0.875rem', color: 'var(--color-text-main)',
            lineHeight: 1.5
          }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          style={{
            padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            backgroundColor: text.trim() && !sending ? 'var(--color-primary)' : 'var(--color-border)',
            color: text.trim() && !sending ? '#fff' : 'var(--color-text-muted)',
            transition: 'all 0.2s ease', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          title="Send comment (Ctrl+Enter)"
        >
          {sending
            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            : <Send size={16} />}
        </button>
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '6px', paddingLeft: '4px' }}>
        Press <kbd style={{ padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.7rem' }}>Ctrl+Enter</kbd> to send
      </p>
    </div>
  );
}

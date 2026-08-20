import { Link } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0F172A', // Pure Dark Theme Background (Slate-900)
      overflow: 'hidden',
      padding: '24px'
    }}>
      {/* Dark Ambient Glow Lights */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* Subtle Dark Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      {/* Glowing Neon Gradient Border Wrapper */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '520px',
        width: '100%',
        padding: '1.5px', // Border Width
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)',
        boxShadow: '0 0 50px rgba(99, 102, 241, 0.3), 0 20px 40px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Card Inner Background */}
        <div className="animate-fade-in" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          padding: '40px 32px',
          backgroundColor: '#1E293B', // Dark Surface Color (Slate-800)
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '22px',
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '24px' }}>
            <img src="/logo.png" alt="CodeForge" style={{ height: '44px', objectFit: 'contain' }} />
          </div>

          {/* Glowing 404 Text */}
          <h1 style={{
            fontSize: '7rem',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-2px',
            background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #F472B6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            userSelect: 'none'
          }}>
            404
          </h1>

          {/* Dark Error Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#FCA5A5',
            fontSize: '0.85rem',
            fontWeight: 600,
            margin: '16px 0 20px 0'
          }}>
            <AlertTriangle size={15} />
            <span>Page Lost in Space</span>
          </div>

          {/* Heading & Paragraph */}
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '10px', color: '#F8FAFC' }}>
            Oops! You've drifted off course
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: '#94A3B8',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '400px'
          }}>
            The page or workspace you are looking for doesn't exist, was renamed, or has been moved.
          </p>

          {/* Buttons Container */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                backgroundColor: '#6366F1',
                color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <Home size={18} />
              Back to Dashboard
            </Link>

            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                backgroundColor: 'transparent',
                color: '#CBD5E1',
                border: '1px solid #334155',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={18} />
              Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
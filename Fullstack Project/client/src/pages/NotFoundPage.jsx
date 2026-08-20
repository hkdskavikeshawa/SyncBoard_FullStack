import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div 
      className="flex-center animate-fade-in" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        textAlign: 'center', 
        padding: '24px', 
        backgroundColor: 'var(--color-background)'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 36px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          maxWidth: '460px',
          width: '100%'
        }}
      >
        {/* Logo with subtle ambient glow */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <img 
            src="/logo.png" 
            alt="CodeForge" 
            style={{ 
              height: '64px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))'
            }} 
          />
        </div>

        {/* Gradient 404 Text */}
        <h1 
          style={{ 
            fontSize: '5rem', 
            fontWeight: 800,
            lineHeight: 1,
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px'
          }}
        >
          404
        </h1>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px', color: 'var(--color-text)' }}>
          Page Not Found
        </h2>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', fontSize: '0.95rem', lineHeight: '1.6' }}>
          The page or task you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Styled Return Button */}
        <Link 
          to="/" 
          className="btn btn-primary" 
          style={{ 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontWeight: 500,
            borderRadius: 'var(--radius-md)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowLeft size={18} />
          Return to Board
        </Link>
      </div>
    </div>
  );
}
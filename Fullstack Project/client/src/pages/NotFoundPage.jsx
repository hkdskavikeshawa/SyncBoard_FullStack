import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

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
        backgroundColor: '#f1f5f9',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Inline Keyframe Animations */}
      <style>{`
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse404 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.28; transform: scale(1.08); }
        }

        .animated-logo {
          animation: floatLogo 4s ease-in-out infinite;
        }

        .animated-404 {
          animation: pulse404 3s ease-in-out infinite;
          display: inline-block;
        }

        .animated-glow {
          animation: pulseGlow 5s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient Background Glow */}
      <div 
        className="animated-glow"
        style={{
          position: 'absolute',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-primary, #6366f1) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          top: '50%',
          left: '50%',
          marginTop: '-190px',
          marginLeft: '-190px'
        }}
      />

      {/* Light Glassmorphic Container Card */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 36px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          maxWidth: '450px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Animated Floating Logo */}
        <div className="animated-logo" style={{ marginBottom: '24px' }}>
          <img 
            src="/logo.png" 
            alt="CodeForge" 
            style={{ 
              height: '72px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08))'
            }} 
          />
        </div>

        {/* Small Status Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: 'var(--color-primary, #6366f1)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}
        >
          <Compass size={14} /> Page Not Found
        </div>

        {/* Animated Gradient 404 Text */}
        <h1 
          className="animated-404"
          style={{ 
            fontSize: '5.5rem', 
            fontWeight: 900,
            lineHeight: 1,
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, var(--color-primary, #6366f1) 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px'
          }}
        >
          404
        </h1>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
          Lost in Space?
        </h2>

        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.925rem', lineHeight: '1.6' }}>
          The page or task you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Interactive Return Button */}
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 28px',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderRadius: '12px',
            width: '100%',
            backgroundColor: 'var(--color-primary, #6366f1)',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
            transition: 'all 0.25s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.3)';
          }}
        >
          <ArrowLeft size={18} />
          Return to Board
        </Link>
      </div>
    </div>
  );
}
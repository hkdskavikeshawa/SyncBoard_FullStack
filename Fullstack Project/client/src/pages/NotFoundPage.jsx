import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

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
        backgroundColor: '#090d16', // Dark background color
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Neon Ambient Glow Effect */}
      <div 
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Dark Glassmorphic Card Container */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 36px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(17, 24, 39, 0.75)',
          backdropFilter: 'blur(16px)',
          maxWidth: '440px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Logo Section */}
        <div style={{ marginBottom: '24px' }}>
          <img 
            src="/logo.png" 
            alt="CodeForge" 
            style={{ 
              height: '70px', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.3))'
            }} 
          />
        </div>

        {/* Small Neon Pill Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818cf8',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            marginBottom: '16px'
          }}
        >
          <AlertCircle size={14} /> ERROR 404
        </div>

        {/* Neon Gradient Text for 404 */}
        <h1 
          style={{ 
            fontSize: '5.5rem', 
            fontWeight: 900,
            lineHeight: 1,
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #4f46e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px',
            filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.4))'
          }}
        >
          404
        </h1>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '12px', color: '#f3f4f6' }}>
          Page Not Found
        </h2>

        <p style={{ color: '#9ca3af', marginBottom: '32px', fontSize: '0.925rem', lineHeight: '1.6' }}>
          The page or task you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Primary Glow Button */}
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontWeight: 600,
            fontSize: '0.95rem',
            borderRadius: '12px',
            width: '100%',
            backgroundColor: '#6366f1',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.6)';
            e.currentTarget.style.backgroundColor = '#4f46e5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
            e.currentTarget.style.backgroundColor = '#6366f1';
          }}
        >
          <ArrowLeft size={18} />
          Return to Board
        </Link>
      </div>
    </div>
  );
}
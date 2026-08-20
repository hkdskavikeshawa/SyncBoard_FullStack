import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex-center animate-fade-in" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', textAlign: 'center', padding: '24px', backgroundColor: 'var(--color-background)'
    }}>
      <img src="/logo.png" alt="CodeForge" style={{ height: '80px', marginBottom: '32px' }} />
      <h1 style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '8px', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Page not found</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', maxWidth: '400px' }}>
        The page or task you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        Return to Board
      </Link>
    </div>
  );
}

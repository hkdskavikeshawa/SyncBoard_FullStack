import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TasksProvider } from './context/TasksContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import BoardPage from './pages/BoardPage';
import TaskDetailPage from './pages/TaskDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <BoardPage />
                  </ProtectedRoute>
                } />
                <Route path="/tasks/:id" element={
                  <ProtectedRoute>
                    <TaskDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <footer style={{ flexShrink: 0, textAlign: 'center', padding: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', zIndex: 100 }}>
              &copy; {new Date().getFullYear()} Team 34. All rights reserved.
            </footer>
          </div>
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

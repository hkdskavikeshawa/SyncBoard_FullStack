import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TasksProvider } from './context/TasksContext';
import BoardPage from './pages/BoardPage';
import TaskDetailPage from './pages/TaskDetailPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <TasksProvider>
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </TasksProvider>
    </BrowserRouter>
  );
}

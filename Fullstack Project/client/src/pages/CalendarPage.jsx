import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CalendarPage() {
  const { tasks, status, error, loadInitial } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (status === 'loading' || status === 'idle') return <LoadingState />;
  if (status === 'error') return <ErrorState message={error} onRetry={loadInitial} />;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to get priority color
  const getPriorityColor = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F97316';
      case 'low': return '#3B82F6';
      default: return '#EAB308';
    }
  };

  // Build grid days
  const calendarCells = [];
  
  // Empty padding cells before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ key: `prev-${i}`, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate === dayStr);
    calendarCells.push({
      key: `day-${day}`,
      day,
      dayStr,
      isCurrentMonth: true,
      isToday: dayStr === todayStr,
      tasks: dayTasks
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px', backgroundColor: 'var(--color-background)' }}>
      <Navbar />

      {/* Header & Controls */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon color="var(--color-primary)" size={28} />
            <span>Interactive Task Calendar</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Track deadlines, schedule deliverables, and view due dates in a monthly grid
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleToday} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Today
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '4px' }}>
            <button onClick={handlePrevMonth} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-main)' }} title="Previous Month">
              <ChevronLeft size={18} />
            </button>
            <span style={{ padding: '0 12px', fontWeight: 700, color: 'var(--color-text-main)', minWidth: '150px', textAlign: 'center' }}>
              {monthNames[month]} {year}
            </span>
            <button onClick={handleNextMonth} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-main)' }} title="Next Month">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Days of Week Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '12px', textTransform: 'uppercase' }}>
          {daysOfWeek.map(d => (
            <div key={d} style={{ padding: '8px 0' }}>{d}</div>
          ))}
        </div>

        {/* Month Day Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', flex: 1, minHeight: '550px' }}>
          {calendarCells.map(cell => {
            if (!cell.isCurrentMonth) {
              return (
                <div key={cell.key} style={{ borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-background)', border: '1px solid transparent', opacity: 0.4 }}></div>
              );
            }

            return (
              <div 
                key={cell.key}
                style={{ 
                  borderRadius: 'var(--radius-sm)', padding: '8px',
                  backgroundColor: cell.isToday ? 'rgba(15, 118, 110, 0.08)' : 'var(--color-surface)',
                  border: cell.isToday ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ 
                    fontSize: '0.85rem', fontWeight: cell.isToday ? 700 : 500, 
                    color: cell.isToday ? 'var(--color-primary)' : 'var(--color-text-main)',
                    width: '24px', height: '24px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: cell.isToday ? 'rgba(15, 118, 110, 0.2)' : 'transparent'
                  }}>
                    {cell.day}
                  </span>
                  {cell.tasks.length > 0 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {cell.tasks.length} task{cell.tasks.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Tasks List inside Day Cell */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {cell.tasks.map(task => (
                    <Link 
                      key={task.id}
                      to={`/tasks/${task.id}`}
                      style={{ 
                        textDecoration: 'none', padding: '4px 8px', borderRadius: '4px',
                        backgroundColor: 'var(--color-background)',
                        borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                        fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-main)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}
                      title={task.title}
                    >
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                        {task.title}
                      </span>
                      <ArrowUpRight size={10} color="var(--color-text-muted)" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

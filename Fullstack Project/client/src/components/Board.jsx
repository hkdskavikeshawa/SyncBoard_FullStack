import Column from './Column';
import { useTasks } from '../hooks/useTasks';

export default function Board({ tasks }) {
  const { columns } = useTasks();

  return (
    <div style={{ 
      display: 'flex', gap: '24px', height: '100%'
    }}>
      {columns.sort((a,b) => a.order - b.order).map(column => (
        <Column 
          key={column.id} 
          column={column} 
          tasks={tasks.filter(t => t.columnId === column.id)} 
        />
      ))}
    </div>
  );
}

import Column from './Column';
import { useTasks } from '../hooks/useTasks';

export default function Board({ tasks }) {
  const { columns, addColumn, isOwner } = useTasks();

  const handleAddColumn = () => {
    const name = prompt('Enter new column name:');
    if (name && name.trim()) {
      addColumn(name.trim());
    }
  };

  return (
    <div style={{ 
      display: 'flex', gap: '24px', height: '100%', overflowX: 'auto', paddingBottom: '16px'
    }}>
      {columns.sort((a,b) => a.order - b.order).map(column => (
        <Column 
          key={column.id} 
          column={column} 
          tasks={tasks.filter(t => t.columnId === column.id)} 
        />
      ))}
      {isOwner && (
        <button 
          onClick={handleAddColumn}
          style={{ 
            minWidth: '320px', height: 'fit-content', padding: '16px', 
            backgroundColor: 'transparent', border: '2px dashed var(--color-border)', 
            borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)',
            cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          + Add Column
        </button>
      )}
    </div>
  );
}

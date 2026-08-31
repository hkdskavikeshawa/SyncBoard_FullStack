import { Search, Filter } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

export default function FilterBar({ filters, setFilters }) {
  const { boardMembers, members, columns } = useTasks();
  const assignableMembers = boardMembers && boardMembers.length > 0 ? boardMembers : members;

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleAssigneeChange = (e) => {
    setFilters(prev => ({ ...prev, assignee: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };

  return (
    <div style={{ 
      display: 'flex', gap: '16px', flexWrap: 'wrap', 
      padding: '16px', backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px'
    }}>
      <div style={{ flex: '1 1 300px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="input-field" 
          style={{ paddingLeft: '38px' }}
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', flex: '1 1 300px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Filter size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--color-text-muted)' }} />
          <select 
            className="input-field" 
            style={{ paddingLeft: '36px', appearance: 'none' }}
            value={filters.assignee}
            onChange={handleAssigneeChange}
          >
            <option value="">All Assignees</option>
            {assignableMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <select 
            className="input-field"
            value={filters.status}
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            {columns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

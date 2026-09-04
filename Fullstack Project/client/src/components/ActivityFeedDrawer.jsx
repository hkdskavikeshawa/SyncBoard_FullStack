import { X, Download, History, CheckCircle, PlusCircle, MoveRight } from 'lucide-react';

export default function ActivityFeedDrawer({ isOpen, onClose, tasks = [], columns = [], boardName = 'Board' }) {
  if (!isOpen) return null;

  // Generate recent activity log events based on current board state
  const activities = [
    { id: 'a1', type: 'create', text: `Board "${boardName}" loaded with ${tasks.length} tasks`, time: 'Just now', icon: History },
    ...tasks.map(t => {
      const col = columns.find(c => c.id === t.columnId);
      return {
        id: `act-${t.id}`,
        type: 'task',
        text: `Task "${t.title}" is in column "${col ? col.name : 'To Do'}"`,
        time: t.dueDate ? `Due: ${t.dueDate}` : 'Recent',
        icon: CheckCircle
      };
    })
  ];

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ boardName, columns, tasks }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${boardName.toLowerCase().replace(/\s+/g, '_')}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ["ID", "Title", "Column", "Priority", "Due Date", "Description"];
    const rows = tasks.map(t => {
      const col = columns.find(c => c.id === t.columnId);
      return [
        t.id,
        `"${(t.title || '').replace(/"/g, '""')}"`,
        `"${(col ? col.name : '').replace(/"/g, '""')}"`,
        t.priority || 'medium',
        t.dueDate || '',
        `"${(t.description || '').replace(/"/g, '""')}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodeURI(csvContent));
    downloadAnchor.setAttribute("download", `${boardName.toLowerCase().replace(/\s+/g, '_')}_tasks.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} 
      />

      {/* Drawer */}
      <div 
        className="glass-panel animate-fade-in" 
        style={{ 
          position: 'relative', width: '380px', height: '100%', 
          backgroundColor: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column', zIndex: 101, boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--color-text-main)', fontSize: '1.1rem' }}>
            <History size={20} color="var(--color-primary)" />
            <span>Activity & Export</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Export Data Actions */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
            Export Board Data
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportJSON} className="btn btn-outline" style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}>
              <Download size={14} /> JSON
            </button>
            <button onClick={exportCSV} className="btn btn-outline" style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem', gap: '4px' }}>
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        {/* Activity Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
            Recent Activity Log
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activities.map(act => {
              const IconComp = act.icon;
              return (
                <div key={act.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(15, 118, 110, 0.1)', color: 'var(--color-primary)', marginTop: '2px' }}>
                    <IconComp size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                      {act.text}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {act.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

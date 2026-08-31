import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ScheduleReportDialog from '../components/ScheduleReportDialog';
import { BarChart2, CheckCircle2, Clock, Users, PieChart, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const { tasks, columns, members, status, error, loadInitial } = useTasks();
  const [selectedBoardFilter, setSelectedBoardFilter] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  if (status === 'loading' || status === 'idle') return <LoadingState />;
  if (status === 'error') return <ErrorState message={error} onRetry={loadInitial} />;

  const totalTasks = tasks.length;

  const statusCounts = columns.map(col => {
    const count = tasks.filter(t => t.columnId === col.id).length;
    const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
    return { id: col.id, name: col.name, count, percentage };
  });

  const priorities = ['urgent', 'high', 'medium', 'low'];
  const priorityColors = { urgent: '#EF4444', high: '#F97316', medium: '#EAB308', low: '#3B82F6' };

  const priorityCounts = priorities.map(p => {
    const count = tasks.filter(t => (t.priority || 'medium').toLowerCase() === p).length;
    const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
    return { name: p.toUpperCase(), count, percentage, color: priorityColors[p] };
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const doneColumn = columns.find(c => c.name.toLowerCase().includes('done') || c.name.toLowerCase().includes('complete'));
  const overdueCount = tasks.filter(t => t.dueDate && t.dueDate < todayStr && t.columnId !== doneColumn?.id).length;

  const completedCount = doneColumn ? tasks.filter(t => t.columnId === doneColumn.id).length : 0;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const memberWorkload = members.map(m => {
    const memberTasks = tasks.filter(t => (t.assigneeIds || []).includes(m.id) || t.assigneeId === m.id);
    const memberCompleted = memberTasks.filter(t => t.columnId === doneColumn?.id).length;
    const rate = memberTasks.length > 0 ? Math.round((memberCompleted / memberTasks.length) * 100) : 0;
    return { member: m, total: memberTasks.length, completed: memberCompleted, rate };
  });

  const downloadTextFile = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const printDate = new Date().toLocaleString();

    const element = document.createElement('div');
    element.style.padding = '24px';
    element.style.background = '#ffffff';
    element.style.color = '#1E293B';
    element.style.fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

    element.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0F766E; padding-bottom: 12px; margin-bottom: 20px;">
        <div>
          <h1 style="color: #0F766E; margin: 0; font-size: 20px; font-weight: 700;">SyncBoard Analytics & Workspace Report</h1>
          <p style="margin: 4px 0 0; color: #64748B; font-size: 12px;">Comprehensive Sprint Velocity & Team Workload Report</p>
        </div>
        <div style="font-size: 11px; color: #64748B; text-align: right;">
          <p style="margin:0;"><strong>Date:</strong> ${printDate}</p>
          <p style="margin:3px 0 0;"><strong>Status:</strong> Active Workspace</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; text-align: center;">
          <div style="font-size: 10px; color: #64748B; text-transform: uppercase; font-weight: 700;">Total Tasks</div>
          <div style="font-size: 18px; font-weight: 700; color: #0F766E; margin-top: 4px;">${totalTasks}</div>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; text-align: center;">
          <div style="font-size: 10px; color: #64748B; text-transform: uppercase; font-weight: 700;">Completion Rate</div>
          <div style="font-size: 18px; font-weight: 700; color: #0F766E; margin-top: 4px;">${completionRate}%</div>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; text-align: center;">
          <div style="font-size: 10px; color: #64748B; text-transform: uppercase; font-weight: 700;">Overdue Tasks</div>
          <div style="font-size: 18px; font-weight: 700; color: ${overdueCount > 0 ? '#EF4444' : '#0F766E'}; margin-top: 4px;">${overdueCount}</div>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; text-align: center;">
          <div style="font-size: 10px; color: #64748B; text-transform: uppercase; font-weight: 700;">Contributors</div>
          <div style="font-size: 18px; font-weight: 700; color: #0F766E; margin-top: 4px;">${members.length}</div>
        </div>
      </div>

      <div style="font-size: 14px; font-weight: 700; color: #0F766E; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px;">1. Column Status Distribution</div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px;">
        <thead>
          <tr style="background: #0F766E; color: #ffffff;">
            <th style="padding: 8px 10px; text-align: left;">Column Status</th>
            <th style="padding: 8px 10px; text-align: left;">Task Count</th>
            <th style="padding: 8px 10px; text-align: left;">Percentage Share</th>
          </tr>
        </thead>
        <tbody>
          ${statusCounts.map((col, idx) => `
            <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 10px;"><strong>${col.name}</strong></td>
              <td style="padding: 8px 10px;">${col.count} tasks</td>
              <td style="padding: 8px 10px;">${col.percentage}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="font-size: 14px; font-weight: 700; color: #0F766E; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px;">2. Team Member Workload Summary</div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px;">
        <thead>
          <tr style="background: #0F766E; color: #ffffff;">
            <th style="padding: 8px 10px; text-align: left;">Member Name</th>
            <th style="padding: 8px 10px; text-align: left;">Role</th>
            <th style="padding: 8px 10px; text-align: left;">Assigned</th>
            <th style="padding: 8px 10px; text-align: left;">Completed</th>
            <th style="padding: 8px 10px; text-align: left;">Completion Rate</th>
          </tr>
        </thead>
        <tbody>
          ${memberWorkload.map(({ member, total, completed, rate }, idx) => `
            <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 8px 10px;"><strong>${member.name}</strong></td>
              <td style="padding: 8px 10px;">${member.role || 'Team Member'}</td>
              <td style="padding: 8px 10px;">${total}</td>
              <td style="padding: 8px 10px;">${completed}</td>
              <td style="padding: 8px 10px;">${rate}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="font-size: 14px; font-weight: 700; color: #0F766E; border-bottom: 2px solid #E2E8F0; padding-bottom: 4px; margin-top: 18px; margin-bottom: 10px;">3. Detailed Task Inventory</div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px;">
        <thead>
          <tr style="background: #0F766E; color: #ffffff;">
            <th style="padding: 8px 10px; text-align: left;">Task Title</th>
            <th style="padding: 8px 10px; text-align: left;">Status Column</th>
            <th style="padding: 8px 10px; text-align: left;">Assignees</th>
            <th style="padding: 8px 10px; text-align: left;">Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.map((t, idx) => {
            const col = columns.find(c => c.id === t.columnId);
            const assigneeNames = (t.assigneeIds || []).map(id => {
              const m = members.find(mem => mem.id === id);
              return m ? m.name : id;
            }).join(', ') || 'Unassigned';
            return `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#F8FAFC'}; border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 8px 10px;"><strong>${t.title}</strong></td>
                <td style="padding: 8px 10px;">${col ? col.name : 'N/A'}</td>
                <td style="padding: 8px 10px;">${assigneeNames}</td>
                <td style="padding: 8px 10px;">${t.dueDate || 'No due date'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    const opt = {
      margin: 0.3,
      filename: 'SyncBoard_Analytics_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleDownloadCsv = () => {
    const csvRows = [
      ['Task Status', 'Count'],
      ...statusCounts.map(col => [col.name, col.count]),
      ['Total Tasks', totalTasks],
      ['Completion Rate', `${completionRate}%`],
      ['Overdue Tasks', overdueCount],
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    downloadTextFile('syncboard_analytics.csv', csvContent, 'text/csv;charset=utf-8;');
  };

  const handleConfigureSchedule = () => {
    setShowScheduleModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px', backgroundColor: 'var(--color-background)' }}>
      <Navbar />

      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart2 color="var(--color-primary)" size={28} />
            <span>Analytics & Workspace Insights</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Real-time project velocity, status distributions, and team workload metrics
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#0284C7' }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Tasks</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{totalTasks}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Completion Velocity</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{completionRate}%</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: overdueCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(100, 116, 139, 0.15)', color: overdueCount > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Overdue Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: overdueCount > 0 ? 'var(--color-danger)' : 'var(--color-text-main)' }}>{overdueCount} tasks</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(15, 118, 110, 0.15)', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Active Contributors</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{members.length} members</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <PieChart size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Column Status Distribution</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {statusCounts.map(col => (
              <div key={col.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  <span>{col.name}</span>
                  <span>{col.count} tasks ({col.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${col.percentage}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.4s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <TrendingUp size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Task Priority Breakdown</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {priorityCounts.map(p => (
              <div key={p.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: p.color }}></span>
                    {p.name}
                  </span>
                  <span>{p.count} tasks ({p.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${p.percentage}%`, height: '100%', backgroundColor: p.color, transition: 'width 0.4s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Users size={20} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Team Member Workload & Contribution</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {memberWorkload.map(({ member, total, completed, rate }) => (
            <div key={member.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>{member.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{member.role || 'Team Member'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                <span>Workload: {total} tasks</span>
                <span>{rate}% completed</span>
              </div>

              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${rate}%`, height: '100%', backgroundColor: 'var(--color-success)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '24px', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <BarChart2 size={20} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Reports & Data Export</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '18px' }}>
          <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>Summary Exports</div>
            <p style={{ margin: '0 0 14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Generate downloadable PDF and CSV reports for sprint reviews, task completion rates, and overdue metrics.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleDownloadPdf} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                Download PDF
              </button>
              <button type="button" onClick={handleDownloadCsv} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', fontWeight: 700, cursor: 'pointer' }}>
                Download CSV
              </button>
            </div>
          </div>

          <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>Scheduled Reporting</div>
            <p style={{ margin: '0 0 14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Set up automated weekly or monthly summaries sent directly via email.
            </p>
            <button type="button" onClick={handleConfigureSchedule} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)', fontWeight: 700, cursor: 'pointer' }}>
              Configure Schedule
            </button>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleReportDialog onClose={() => setShowScheduleModal(false)} />
      )}
    </div>
  );
}
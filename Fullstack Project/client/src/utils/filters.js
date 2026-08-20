export function applyFilters(tasks, filters) {
  return tasks.filter(task => {
    if (filters.assignee && !(task.assigneeIds || []).includes(filters.assignee)) return false;
    if (filters.status && task.columnId !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      if (!titleMatch) return false;
    }
    return true;
  });
}

export function validateTask({ title, dueDate }) {
  const errors = {};
  const trimmed = (title ?? '').trim();

  if (!trimmed) {
    errors.title = 'Title is required';
  } else if (trimmed.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(dueDate) < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }
  
  return errors;
}

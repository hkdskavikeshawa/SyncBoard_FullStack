import { useState } from 'react';
import { validateTask } from '../utils/validation';
import { useTasks } from '../hooks/useTasks';

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const { members } = useTasks();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
    assigneeIds: initialData?.assigneeIds || []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleAssigneeToggle = (memberId) => {
    setFormData(prev => {
      const isSelected = prev.assigneeIds.includes(memberId);

      const newAssigneeIds = isSelected
        ? prev.assigneeIds.filter(id => id !== memberId)
        : [...prev.assigneeIds, memberId];

      return {
        ...prev,
        assigneeIds: newAssigneeIds
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateTask(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',

        /* =========================
           ONLY OUTER BORDER
        ========================== */
        padding: '26px',
        background: '#ffffff',
        border: '1px solid rgba(34, 197, 94, 0.28)',
        borderRadius: '16px',

        /* Soft green outer shadow */
        boxShadow: `
          0 0 0 1px rgba(34, 197, 94, 0.02),
          0 6px 22px rgba(34, 197, 94, 0.09),
          0 2px 6px rgba(15, 23, 42, 0.04)
        `,

        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* =========================
          HEADER
      ========================== */}
      <div
        style={{
          paddingBottom: '4px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {/* Green icon */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(34, 197, 94, 0.10)',
              color: '#16a34a',
              fontSize: '18px',
              fontWeight: 700
            }}
          >
            
          </div>

          
        </div>
      </div>

      {/* =========================
          TITLE
      ========================== */}
      <div>
        <label
          htmlFor="title"
          className="input-label"
          style={{
            display: 'block',
            marginBottom: '7px',
            fontWeight: 600,
            color: 'var(--color-text)'
          }}
        >
          Title{' '}
          <span style={{ color: 'var(--color-danger)' }}>
            *
          </span>
        </label>

        <input
          type="text"
          id="title"
          name="title"
          className="input-field"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Update user profile"
          style={{
            width: '100%',
            boxSizing: 'border-box',

            /* No inner border */
            border: 'none',

            borderRadius: '9px',
            padding: '11px 12px',
            background: '#f7faf8',

            outline: 'none',

            boxShadow: errors.title
              ? '0 0 0 2px rgba(239, 68, 68, 0.15)'
              : 'none',

            transition: 'all 0.2s ease'
          }}
        />

        {errors.title && (
          <div
            style={{
              color: 'var(--color-danger)',
              fontSize: '0.75rem',
              marginTop: '5px'
            }}
          >
            {errors.title}
          </div>
        )}
      </div>

      {/* =========================
          DESCRIPTION
      ========================== */}
      <div>
        <label
          htmlFor="description"
          className="input-label"
          style={{
            display: 'block',
            marginBottom: '7px',
            fontWeight: 600,
            color: 'var(--color-text)'
          }}
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          className="input-field"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Add more details about this task..."
          style={{
            width: '100%',
            boxSizing: 'border-box',

            /* No inner border */
            border: 'none',

            borderRadius: '9px',
            padding: '11px 12px',

            background: '#f7faf8',

            resize: 'vertical',
            minHeight: '95px',
            lineHeight: 1.5,

            outline: 'none',

            transition: 'all 0.2s ease'
          }}
        />
      </div>

      {/* =========================
          DUE DATE
      ========================== */}
      <div>
        <label
          htmlFor="dueDate"
          className="input-label"
          style={{
            display: 'block',
            marginBottom: '7px',
            fontWeight: 600,
            color: 'var(--color-text)'
          }}
        >
          Due Date
        </label>

        <input
          type="date"
          id="dueDate"
          name="dueDate"
          className="input-field"
          value={formData.dueDate}
          onChange={handleChange}
          style={{
            width: '100%',
            boxSizing: 'border-box',

            /* No inner border */
            border: 'none',

            borderRadius: '9px',
            padding: '11px 12px',

            background: '#f7faf8',

            cursor: 'pointer',

            outline: 'none',

            boxShadow: errors.dueDate
              ? '0 0 0 2px rgba(239, 68, 68, 0.15)'
              : 'none',

            transition: 'all 0.2s ease'
          }}
        />

        {errors.dueDate && (
          <div
            style={{
              color: 'var(--color-danger)',
              fontSize: '0.75rem',
              marginTop: '5px'
            }}
          >
            {errors.dueDate}
          </div>
        )}
      </div>

      {/* =========================
          ASSIGNEES
      ========================== */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}
        >
          <label
            className="input-label"
            style={{
              fontWeight: 600,
              color: 'var(--color-text)'
            }}
          >
            Assignees
          </label>

          {formData.assigneeIds.length > 0 && (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,

                color: '#15803d',

                background: 'rgba(34, 197, 94, 0.10)',

                padding: '4px 9px',
                borderRadius: '999px'
              }}
            >
              {formData.assigneeIds.length} selected
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',

            maxHeight: '170px',
            overflowY: 'auto',

            padding: '7px',

            /* No inner border */
            border: 'none',

            borderRadius: '10px',

            background: 'rgba(34, 197, 94, 0.035)'
          }}
        >
          {members.length === 0 && (
            <div
              style={{
                padding: '18px 12px',
                textAlign: 'center',

                fontSize: '0.85rem',
                color: 'var(--color-text-muted)'
              }}
            >
              No members available
            </div>
          )}

          {members.map(m => {
            const isSelected = formData.assigneeIds.includes(m.id);

            return (
              <label
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',

                  cursor: 'pointer',

                  padding: '9px 10px',

                  borderRadius: '8px',

                  /* No inner border */
                  border: 'none',

                  background: isSelected
                    ? 'rgba(34, 197, 94, 0.10)'
                    : '#ffffff',

                  transition: 'all 0.18s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleAssigneeToggle(m.id)}
                  style={{
                    width: '16px',
                    height: '16px',

                    accentColor: '#16a34a',

                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                />

                {/* Avatar */}
                <span
                  style={{
                    width: '30px',
                    height: '30px',

                    borderRadius: '50%',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    background: isSelected
                      ? '#16a34a'
                      : '#edf2f0',

                    color: isSelected
                      ? '#ffffff'
                      : '#64748b',

                    fontSize: '0.72rem',
                    fontWeight: 700,

                    flexShrink: 0
                  }}
                >
                  {m.name?.charAt(0)?.toUpperCase()}
                </span>

                <span
                  style={{
                    color: 'var(--color-text)',
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  {m.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* =========================
          FOOTER / BUTTONS
      ========================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',

          marginTop: '4px',
          paddingTop: '6px'
        }}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
            style={{
              minWidth: '90px',
              height: '40px',

              borderRadius: '8px',

              background: '#f8faf9',

              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            minWidth: '110px',
            height: '40px',

            borderRadius: '8px',

            background: '#16a34a',
            border: 'none',

            color: '#ffffff',

            boxShadow: `
              0 4px 12px rgba(34, 197, 94, 0.20)
            `,

            transition: 'all 0.2s ease'
          }}
        >
          Save Task
        </button>
      </div>
    </form>
  );
}

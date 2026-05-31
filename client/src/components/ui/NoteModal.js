import React, { useState, useEffect } from 'react';

const COLORS = ['#7C3AED','#F59E0B','#10B981','#EF4444','#3B82F6','#EC4899','#14B8A6','#F97316'];

export default function NoteModal({ note, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    color: COLORS[0],
    isPinned: false,
  });

  useEffect(() => {
    if (note) {
      setForm({
        title:    note.title    || '',
        content:  note.content  || '',
        color:    note.color    || COLORS[0],
        isPinned: note.isPinned || false,
      });
    }
  }, [note]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{note?.id ? 'Edit note' : 'New note'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              placeholder="Note title..."
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              placeholder="Write your note here..."
              value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Color label</label>
            <div className="color-picker">
              {COLORS.map(c => (
                <div
                  key={c}
                  className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm(p => ({ ...p, color: c }))}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <input
              type="checkbox"
              id="pinned"
              checked={form.isPinned}
              onChange={e => setForm(p => ({ ...p, isPinned: e.target.checked }))}
              style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <label htmlFor="pinned" style={{ fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
              📌 Pin this note
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn-sm btn-ghost"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-sm btn-primary-sm"
              style={{ flex: 2, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : (note?.id ? 'Save changes' : 'Create note')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

const COLORS = [
  '#7C3AED',
  '#F59E0B',
  '#10B981',
  '#EF4444',
  '#3B82F6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');

function getImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http') || imageUrl.startsWith('blob') || imageUrl.startsWith('data')) return imageUrl;
  return `${API_BASE}${imageUrl}`;
}

export default function NoteModal({ note, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    color: COLORS[0],
    isPinned: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    console.log('NoteModal useEffect, note:', note);
    if (note) {
      setForm({
        title: note.title || '',
        content: note.content || '',
        color: note.color || COLORS[0],
        isPinned: note.isPinned || false,
      });
      if (note.imageUrl) setImagePreview(getImageUrl(note.imageUrl));
    }
  }, [note]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      'NoteModal handleSubmit form:',
      form,
      'selectedFile:',
      selectedFile,
    );
    if (!form.title.trim() || !form.content.trim()) return;
    onSave(form, selectedFile);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h3>{note?.id ? 'Edit note' : 'New note'}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              placeholder="Note title..."
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              placeholder="Write your note here..."
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Color label</label>
            <div className="color-picker">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => {
                    console.log('Color swatch clicked:', c);
                    setForm((p) => ({ ...p, color: c }));
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: '1.25rem',
            }}
          >
            <input
              type="checkbox"
              id="pinned"
              checked={form.isPinned}
              onChange={(e) =>
                setForm((p) => ({ ...p, isPinned: e.target.checked }))
              }
              style={{
                width: 16,
                height: 16,
                accentColor: 'var(--primary)',
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor="pinned"
              style={{ fontSize: 14, cursor: 'pointer', fontWeight: 500 }}
            >
              📌 Pin this note
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Upload image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px dashed var(--border)',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            />
            {imagePreview && (
              <div style={{ marginTop: '0.75rem', position: 'relative' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'var(--danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    cursor: 'pointer',
                    fontSize: 14,
                  }}
                >
                  ×
                </button>
              </div>
            )}
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
              {loading ? (
                <span
                  className="spinner"
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                  }}
                />
              ) : note?.id ? (
                'Save changes'
              ) : (
                'Create note'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import NoteModal from '../components/ui/NoteModal';
import { notesApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  const fetchNotes = useCallback(async (q) => {
    setLoading(true);
    try {
      const { data } = await notesApi.getAll(q);
      const notes = Array.isArray(data) ? data : [];
      setNotes(notes);
    } catch (err) {
      console.error('Notes.js fetchNotes error:', err);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchNotes(search || undefined), 350);
    return () => clearTimeout(t);
  }, [search, fetchNotes]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (note, e) => {
    e.stopPropagation();
    setEditing(note);
    setModalOpen(true);
  };

  const handleSave = async (form, file) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await notesApi.update(editing.id, form, file);
        toast.success('Note updated!');
      } else {
        await notesApi.create(form, file);
        toast.success('Note created!');
      }
      setModalOpen(false);
      fetchNotes(search || undefined);
    } catch {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this note?')) return;
    setDeleting(id);
    try {
      await notesApi.delete(id);
      toast.success('Note deleted');
      setNotes((p) => p.filter((n) => n.id !== id));
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const handlePin = async (note, e) => {
    e.stopPropagation();
    try {
      await notesApi.update(note.id, { isPinned: !note.isPinned });
      setNotes((p) =>
        p.map((n) => (n.id === note.id ? { ...n, isPinned: !n.isPinned } : n)),
      );
    } catch {
      toast.error('Failed to update note');
    }
  };

  const pinned = notes.filter((n) => n.isPinned);
  const others = notes.filter((n) => !n.isPinned);

  return (
    <AppLayout title="My Notes" subtitle="All your notes in one place">
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search notes by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ color: 'var(--text-muted)', fontSize: 16 }}
            >
              ×
            </button>
          )}
        </div>
        <button className="btn-sm btn-primary-sm" onClick={openCreate}>
          + New Note
        </button>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem',
            color: 'var(--text-muted)',
          }}
        >
          Loading your notes…
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📭</div>
          <p>
            {search
              ? `No notes matching "${search}"`
              : 'No notes yet. Create your first one!'}
          </p>
          {!search && (
            <button
              className="btn-sm btn-primary-sm"
              style={{ marginTop: 16, display: 'inline-flex' }}
              onClick={openCreate}
            >
              + Create note
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Pinned */}
          {pinned.length > 0 && (
            <section style={{ marginBottom: '1.5rem' }}>
              <div className="section-header">
                <h3>📌 Pinned</h3>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 12,
                }}
              >
                {pinned.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(e) => openEdit(note, e)}
                    onDelete={(e) => handleDelete(note.id, e)}
                    onPin={(e) => handlePin(note, e)}
                    deleting={deleting === note.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Others */}
          {others.length > 0 && (
            <section>
              <div className="section-header">
                <h3>{pinned.length > 0 ? 'Other Notes' : 'All Notes'}</h3>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {others.length} notes
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 12,
                }}
              >
                {others.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(e) => openEdit(note, e)}
                    onDelete={(e) => handleDelete(note.id, e)}
                    onPin={(e) => handlePin(note, e)}
                    deleting={deleting === note.id}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {modalOpen && (
        <NoteModal
          note={editing}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          loading={saving}
        />
      )}
    </AppLayout>
  );
}

function NoteCard({ note, onEdit, onDelete, onPin, deleting }) {
  console.log('NoteCard note.color:', note.color, 'note:', note);
  return (
    <div
      className="card"
      style={{
        borderTop: `3px solid ${note.color || 'var(--primary)'}`,
        cursor: 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        animation: 'fadeUp 0.3s ease both',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}
      >
        <h4
          style={{
            fontSize: 14,
            fontWeight: 700,
            flex: 1,
            marginRight: 8,
            color: note.color || 'var(--text-primary)',
          }}
        >
          {note.title}
        </h4>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="action-btn"
            onClick={onPin}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            📌
          </button>
          <button className="action-btn" onClick={onEdit} title="Edit">
            ✏️
          </button>
          <button
            className="action-btn delete"
            onClick={onDelete}
            title="Delete"
            disabled={deleting}
          >
            {deleting ? '…' : '🗑️'}
          </button>
        </div>
      </div>

      {note.imageUrl && (
        <img
          src={note.imageUrl}
          alt=""
          style={{
            width: '100%',
            maxHeight: 150,
            objectFit: 'cover',
            borderRadius: 8,
            marginBottom: 12,
          }}
        />
      )}

      <p
        style={{
          fontSize: 13,
          color: note.color || 'var(--text-secondary)',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        {note.content}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {format(new Date(note.updatedAt), 'MMM d, yyyy · HH:mm')}
        </span>
        {note.isPinned && <span className="pin-badge">Pinned</span>}
      </div>
    </div>
  );
}

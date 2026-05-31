import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import MiniCalendar from '../components/ui/MiniCalendar';
import NoteModal from '../components/ui/NoteModal';
import { notesApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const fetchNotes = async () => {
    try {
      const { data } = await notesApi.getAll();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (form, file) => {
    setSaving(true);
    try {
      await notesApi.create(form, file);
      toast.success('Note created!');
      setModalOpen(false);
      fetchNotes();
    } catch {
      toast.error('Failed to create note');
    } finally {
      setSaving(false);
    }
  };

  const pinned = notes.filter((n) => n.isPinned);
  const recent = notes.filter((n) => !n.isPinned).slice(0, 5);
  const noteDates = notes.map((n) => n.createdAt);

  const stats = [
    { label: 'Total Notes', value: notes.length, color: 'purple', icon: '📝' },
    { label: 'Pinned', value: pinned.length, color: 'amber', icon: '📌' },
    {
      label: 'This Week',
      value: notes.filter((n) => {
        const d = new Date(n.createdAt);
        const now = new Date();
        return now - d < 7 * 24 * 60 * 60 * 1000;
      }).length,
      color: 'green',
      icon: '📆',
    },
    {
      label: 'Updated Today',
      value: notes.filter((n) => {
        const d = new Date(n.updatedAt);
        return d.toDateString() === new Date().toDateString();
      }).length,
      color: 'red',
      icon: '✏️',
    },
  ];

  return (
    <AppLayout>
      {/* Hero */}
      <div className="hero-banner">
        <h1>Today's Overview</h1>
        <p>
          Check your notes and schedule for {format(new Date(), 'EEEE, MMMM d')}
        </p>
        <button
          className="btn-outline-white"
          onClick={() => setModalOpen(true)}
        >
          + New Note
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div
            className={`stat-card ${s.color}`}
            key={s.label}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="stat-label">
              {s.icon} {s.label}
            </div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Two col */}
      <div className="two-col">
        {/* Notes list */}
        <div className="card">
          <div className="section-header">
            <h3>Recent Notes</h3>
            <button
              className="btn-sm btn-ghost"
              onClick={() => navigate('/notes')}
            >
              View all
            </button>
          </div>

          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-muted)',
              }}
            >
              Loading…
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No notes yet. Create your first one!</p>
              <button
                className="btn-sm btn-primary-sm"
                style={{ marginTop: 12, display: 'inline-flex' }}
                onClick={() => setModalOpen(true)}
              >
                + Create note
              </button>
            </div>
          ) : (
            <>
              {pinned.slice(0, 2).map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onClick={() => navigate('/notes')}
                />
              ))}
              {recent.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  onClick={() => navigate('/notes')}
                />
              ))}
            </>
          )}
        </div>

        {/* Calendar + agenda */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <div className="card">
            <MiniCalendar noteDates={noteDates} />
          </div>

          <div className="card">
            <div className="section-header" style={{ marginBottom: '0.75rem' }}>
              <h3>Today's Agenda</h3>
            </div>
            {notes.filter(
              (n) =>
                new Date(n.updatedAt).toDateString() ===
                new Date().toDateString(),
            ).length === 0 ? (
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  padding: '0.5rem 0',
                }}
              >
                Nothing scheduled for today.
              </p>
            ) : (
              notes
                .filter(
                  (n) =>
                    new Date(n.updatedAt).toDateString() ===
                    new Date().toDateString(),
                )
                .slice(0, 4)
                .map((note) => (
                  <div className="agenda-item" key={note.id}>
                    <span className="agenda-time">
                      {format(new Date(note.updatedAt), 'HH:mm')}
                    </span>
                    <div
                      className="agenda-dot"
                      style={{ background: note.color || 'var(--primary)' }}
                    />
                    <div>
                      <div className="agenda-text">{note.title}</div>
                      <div className="agenda-sub">Note updated</div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <NoteModal
          onSave={handleCreate}
          onClose={() => setModalOpen(false)}
          loading={saving}
        />
      )}
    </AppLayout>
  );
}

function NoteItem({ note, onClick }) {
  return (
    <div className="note-item" onClick={onClick}>
      <div
        className="note-color-dot"
        style={{ background: note.color || 'var(--primary)' }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="note-title">
          {note.isPinned && <span style={{ marginRight: 4 }}>📌</span>}
          {note.title}
        </div>
        {note.imageUrl && (
          <img
            src={note.imageUrl}
            alt=""
            style={{
              width: '100%',
              maxHeight: 100,
              objectFit: 'cover',
              borderRadius: 8,
              marginTop: 8,
              marginBottom: 8,
            }}
          />
        )}
        <div className="note-preview">{note.content}</div>
        <div className="note-meta">
          <span className="note-date">
            {format(new Date(note.updatedAt), 'MMM d, yyyy')}
          </span>
          {note.isPinned && <span className="pin-badge">Pinned</span>}
        </div>
      </div>
    </div>
  );
}

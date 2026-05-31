import React, { useEffect, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import MiniCalendar from '../components/ui/MiniCalendar';
import { notesApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { format, isSameDay } from 'date-fns';

export default function Agenda() {
  const [notes, setNotes]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(new Date());
  const toast = useToast();

  useEffect(() => {
    notesApi.getAll()
      .then(({ data }) => setNotes(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load notes'))
      .finally(() => setLoading(false));
  }, []);

  const noteDates = notes.map(n => n.createdAt);

  const dayNotes = notes.filter(n =>
    isSameDay(new Date(n.updatedAt), selected) ||
    isSameDay(new Date(n.createdAt), selected)
  );

  const groupedByMonth = notes.reduce((acc, note) => {
    const key = format(new Date(note.createdAt), 'MMMM yyyy');
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  return (
    <AppLayout title="Agenda" subtitle="Your notes timeline and schedule">
      <div className="two-col">
        {/* Timeline */}
        <div>
          {/* Selected day panel */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div className="section-header">
              <h3>📅 {format(selected, 'EEEE, MMMM d')}</h3>
              {isSameDay(selected, new Date()) && (
                <span className="pin-badge" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>Today</span>
              )}
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>
            ) : dayNotes.length === 0 ? (
              <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No notes for this day</p>
              </div>
            ) : (
              dayNotes.map(note => (
                <div className="agenda-item" key={note.id}>
                  <span className="agenda-time">{format(new Date(note.updatedAt), 'HH:mm')}</span>
                  <div className="agenda-dot" style={{ background: note.color || 'var(--primary)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="agenda-text">{note.title}</div>
                    <div className="agenda-sub">{note.content.slice(0, 80)}{note.content.length > 80 ? '…' : ''}</div>
                  </div>
                  {note.isPinned && <span className="pin-badge">Pinned</span>}
                </div>
              ))
            )}
          </div>

          {/* Full timeline grouped by month */}
          <div className="card">
            <div className="section-header">
              <h3>📜 All notes timeline</h3>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{notes.length} total</span>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>
            ) : notes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No notes yet</p>
              </div>
            ) : (
              Object.entries(groupedByMonth).map(([month, monthNotes]) => (
                <div key={month} style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    marginBottom: '0.75rem', paddingBottom: 6,
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {month}
                  </div>
                  {monthNotes.map(note => (
                    <div
                      key={note.id}
                      className="agenda-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelected(new Date(note.createdAt))}
                    >
                      <span className="agenda-time">{format(new Date(note.createdAt), 'MMM d')}</span>
                      <div className="agenda-dot" style={{ background: note.color || 'var(--primary)' }} />
                      <div style={{ flex: 1 }}>
                        <div className="agenda-text">{note.title}</div>
                        <div className="agenda-sub">{note.content.slice(0, 60)}{note.content.length > 60 ? '…' : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <MiniCalendar noteDates={noteDates} onDayClick={setSelected} />
          </div>

          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: '0.75rem' }}>📊 Quick stats</h3>
            {[
              { label: 'Total notes',    value: notes.length },
              { label: 'Pinned',         value: notes.filter(n => n.isPinned).length },
              { label: 'Created today',  value: notes.filter(n => isSameDay(new Date(n.createdAt), new Date())).length },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Clash Display', sans-serif", color: 'var(--primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

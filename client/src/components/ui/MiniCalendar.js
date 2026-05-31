import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, isSameDay } from 'date-fns';

export default function MiniCalendar({ noteDates = [], onDayClick }) {
  const [current, setCurrent] = useState(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd   = endOfMonth(current);
  const start      = startOfWeek(monthStart);
  const end        = endOfWeek(monthEnd);

  const days = [];
  let day = start;
  while (day <= end) { days.push(day); day = addDays(day, 1); }

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const hasNote = d => noteDates.some(nd => isSameDay(new Date(nd), d));

  return (
    <div>
      <div className="calendar-header">
        <h4>{format(current, 'MMMM yyyy')}</h4>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="action-btn" onClick={prevMonth} style={{ width: 26, height: 26 }}>‹</button>
          <button className="action-btn" onClick={nextMonth} style={{ width: 26, height: 26 }}>›</button>
        </div>
      </div>

      <div className="cal-grid">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="cal-day-label">{d}</div>
        ))}
        {days.map((d, i) => (
          <div
            key={i}
            className={[
              'cal-day',
              isToday(d)           ? 'today' : '',
              !isSameMonth(d, current) ? 'other-month' : '',
              hasNote(d)           ? 'has-note' : '',
            ].join(' ')}
            onClick={() => onDayClick?.(d)}
          >
            {format(d, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
}

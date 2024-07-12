import React from 'react';
import { useDrop } from 'react-dnd';
import NoteItem from './NoteItem';
import AddNoteButton from './AddNoteButton';
import { useNoteQuery } from '../../hooks/useNoteQuery';

function NotesCard({ weekNumber, notes, handleNoteClick, handleDropNoteToTrash }) {
  const notesForWeek = notes.filter((note) => note.weekNumber === weekNumber);
  const doneNotes = notesForWeek.filter((note) => note.done);
  const notDoneNotes = notesForWeek.filter((note) => !note.done);
  const allNotes = [...notDoneNotes, ...doneNotes];
  const { updateNoteWeekNumber } = useNoteQuery();

  const [{ isOver }, dropNote] = useDrop({
    accept: 'NOTE_ITEM',
    dropNote: (item) => {
      const droppedNoteId = item.id;
      const updatedNotes = notes.map((note) => (note.id === droppedNoteId ? { ...note, weekNumber } : note));
      updateNoteWeekNumber(droppedNoteId, weekNumber);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={dropNote} className={`note-card ${isOver ? 'highlight' : ''}`}>
      <div className="date-container">
        <p className="day-name">notes</p>
        <AddNoteButton weekNumber={weekNumber} />
      </div>
      <div className="todos-container">
        {allNotes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            handleNoteClick={handleNoteClick}
            handleDropNoteToTrash={handleDropNoteToTrash}
          />
        ))}
      </div>
    </div>
  );
}

export default NotesCard;

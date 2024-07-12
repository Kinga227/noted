import React from 'react';
import { useDrag } from 'react-dnd';
import Note from './todotypes/Note';

function NoteItem({ note, handleNoteClick, handleDropNoteToTrash }) {
  const [{ isDragging }, drag] = useDrag({
    item: { id: note.id, weekNumber: note.weekNumber, type: 'NOTE_ITEM' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (dropResult.type === 'NOTE_CARD') {
        } else if (dropResult.type === 'TRASH') {
          handleDropNoteToTrash(item.id);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    type: 'NOTE_ITEM',
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <button type="button" className="todo-item" onClick={() => handleNoteClick(note.id)}>
        <Note />
        <div className="description-container">
          {note.done ? <span className="todo-done">{note.description}</span> : <span>{note.description}</span>}
        </div>
      </button>
    </div>
  );
}

export default NoteItem;

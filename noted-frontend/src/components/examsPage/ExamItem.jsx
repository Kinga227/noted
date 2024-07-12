import React from 'react';
import { useDrag } from 'react-dnd';

function ExamItem({ exam, handleDropToTrash }) {
  const [{ isDragging }, drag] = useDrag({
    item: { id: exam.id, date: exam.date, type: 'EXAM_ITEM' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (dropResult.type === 'EXAM_CARD') {
        } else if (dropResult.type === 'TRASH') {
          handleDropToTrash(item.id);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    type: 'EXAM_ITEM',
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <button type="button" className="exam-item">
        <div className="exam-description-container">
          <span style={{ fontWeight: 800 }} className="exam-title">
            {exam.title}
          </span>
          <span className="exam-description">{exam.description}</span>
        </div>
      </button>
    </div>
  );
}

export default ExamItem;

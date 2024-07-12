import React from 'react';
import { useDrag } from 'react-dnd';
import { useSubjectQuery } from '../../hooks/useSubjectQuery';

function ClassItem({ classData, handleDropToTrash }) {
  const { data: subjects, isLoading, isError } = useSubjectQuery();

  const [{ isDragging }, drag] = useDrag({
    item: { id: classData.id, type: 'CLASS_ITEM' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (dropResult.type === 'TRASH') {
          handleDropToTrash(item.id);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    type: 'CLASS_ITEM',
  });

  const subjectName = () => {
    const subject = subjects.find((subj) => subj.id === classData.subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getClassTypeColor = () => {
    switch (classData.classTypeId) {
      case 1:
        return '#370000';
      case 2:
        return '#0A4700';
      case 3:
      case 4:
        return '#605600';
      default:
        return 'black';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching subjects</div>;
  }

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        height: '100%',
      }}
    >
      <button
        type="button"
        className={`class-item${classData.classTypeId === 3 ? ' typeid-3' : ''}`}
        style={{
          backgroundColor: getClassTypeColor(),
          color: 'white',
          letterSpacing: 1,
          height: '100%',
          top: classData.startHour.split(':')[0] % 2 !== 0 ? '50%' : '0%',
          transform: classData.startHour.split(':')[0] % 2 !== 0 ? 'translateY(-50%)' : '',
        }}
      >
        <div className="class-description-container">
          <span style={{ fontWeight: 800 }} className="class-subject">
            {subjectName()}
          </span>
          <span style={{ fontStyle: 'italic' }} className="class-teacher">
            {classData.teacherName}
          </span>
          <span style={{ fontWeight: 'bold' }} className="class-location">
            {classData.location}
          </span>
        </div>
      </button>
    </div>
  );
}

export default ClassItem;

import { useDrop } from 'react-dnd';
import { useExamQuery } from '../../hooks/useExamQuery';
import AddExamButton from './AddExamButton';
import ExamItem from './ExamItem';

function ExamDateCard({ date, originalDate, dayName, exams, handleDropToTrash }) {
  const examsForDate = exams.filter(
    (exam) => new Date(exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) === date,
  );
  const { updateDate } = useExamQuery();

  const [{ isOver }, drop] = useDrop({
    accept: 'EXAM_ITEM',
    drop: (item) => {
      const droppedExamId = item.id;
      const updatedExams = exams.map((exam) => (exam.id === droppedExamId ? { ...exam, date: originalDate } : exam));
      updateDate(droppedExamId, originalDate);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`examday-card ${isOver ? 'highlight' : ''}`}>
      <div className="examdate-container">
        <p className="examday-name">{dayName}</p>
        <p className="examdate">{date}</p>
        <AddExamButton originalDate={originalDate} />
      </div>
      <div className="todos-container">
        {examsForDate.map((exam) => (
          <ExamItem key={exam.id} exam={exam} handleDropToTrash={handleDropToTrash} />
        ))}
      </div>
    </div>
  );
}

export default ExamDateCard;

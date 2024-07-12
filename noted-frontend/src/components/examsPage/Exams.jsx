import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import Popup from 'reactjs-popup';
import { useAuth } from '../../hooks/AuthContext';
import MenuBar from '../MenuBar';
import UnauthenticatedRedirect from '../UnauthenticatedRedirect';
import { useExamQuery } from '../../hooks/useExamQuery';
import { useExamWeekQuery } from '../../hooks/useExamWeekQuery';
import ExamDateCard from './ExamDateCard';
import SetExamWeeks from './SetExamWeeks';
import ConfirmationDialog from '../todoPage/ConfirmationDialog';

export default function Exams() {
  const { isAuthenticated } = useAuth();
  const { data: examsData, isError, isLoading, removeExam } = useExamQuery();
  const { data: examWeeksData } = useExamWeekQuery();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [, setShowWeeksPopup] = useState(false);
  const examsContainerRef = useRef(null);

  const handleDropToTrash = (examId) => {
    setExamToDelete(examId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeExam(examToDelete);
    } catch (error) {
    } finally {
      setShowConfirmation(false);
      setExamToDelete(null);
    }
  };

  const [, drop] = useDrop({
    accept: 'EXAM_ITEM',
    drop: (item) => {
      if (item.type === 'EXAM_ITEM') {
        const droppedExamId = item.id;
        handleDropToTrash(droppedExamId);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver() && monitor.canDrop(),
    }),
    canDrop: (item, monitor) => monitor.isOver(),
    type: 'TRASH',
  });

  const renderExamDateCards = () => {
    const numberOfDays = 7;
    const numberOfExamWeeks = examWeeksData.length;
    const dates = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let i = 0; i < numberOfExamWeeks; i++) {
      const examWeekDates = [];
      const startDateOfExamWeek = new Date(examWeeksData[i].dateOfMonday);

      for (let j = 0; j < numberOfDays; j++) {
        const date = new Date(startDateOfExamWeek);
        date.setDate(startDateOfExamWeek.getDate() + j);
        const dayNameIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        examWeekDates.push({
          date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
          originalDate: date.toISOString(),
          dayName: days[dayNameIndex],
        });
      }
      dates.push(examWeekDates);
    }
    const examWeekRows = [];
    for (let i = 0; i < numberOfExamWeeks; i++) {
      const week = dates[i];
      const dayElements = week.map(({ date, originalDate, dayName }) => (
        <ExamDateCard
          key={date}
          date={date}
          originalDate={originalDate}
          dayName={dayName}
          exams={examsData}
          handleDropToTrash={handleDropToTrash}
        />
      ));
      const examWeekNumber = i;
      examWeekRows.push(
        <React.Fragment key={i}>
          <div className="week-info">
            {examWeekNumber === 0 && <h2 className="exam-week-number">EXAM WEEKS</h2>}
            {examWeekNumber === numberOfExamWeeks - 1 && <h2 className="exam-week-number">RESIT EXAM WEEK</h2>}
            <div className="examweek-days">{dayElements}</div>
          </div>
        </React.Fragment>,
      );
    }
    return examWeekRows;
  };

  return (
    <div className="main-container">
      {isAuthenticated && examsData !== "unauthenticated" && examWeeksData !== "unauthenticated" ? (
        <>
          <MenuBar />
          <Popup
            trigger={
              <button type="button" id="exam-weeks-button">
                set exam weeks
              </button>
            }
            modal
            nested
            id="exam-weeks-popup"
          >
            <SetExamWeeks onClose={() => setShowWeeksPopup(false)} />
          </Popup>
          <div className="main-content">
            <div className="trash-icon" ref={drop}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                strokeWidth="1.5"
                stroke="red"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </div>
            {isError && <div>Error fetching exams</div>}
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div ref={examsContainerRef} className="todos-container-wrapper">
                <div className="todos-container">{renderExamDateCards()}</div>
              </div>
            )}
          </div>
          <ConfirmationDialog
            isOpen={showConfirmation}
            onCancel={() => setShowConfirmation(false)}
            onConfirm={handleConfirmDelete}
          />
        </>
      ) : (
        <UnauthenticatedRedirect />
      )}
    </div>
  );
}

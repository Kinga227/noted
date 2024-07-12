import React, { useEffect, useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import Popup from 'reactjs-popup';
import { useAuth } from '../../hooks/AuthContext';
import UnauthenticatedRedirect from '../UnauthenticatedRedirect';
import MenuBar from '../MenuBar';
import { useToDoQuery } from '../../hooks/useToDoQuery';
import { useNoteQuery } from '../../hooks/useNoteQuery';
import { useWeekQuery } from '../../hooks/useWeekQuery';
import ToDoDateCard from './ToDoDateCards';
import NotesCard from './NotesCard';
import ConfirmationDialog from './ConfirmationDialog';
import SetWeeks from './SetWeeks';

export default function ToDo() {
  const { isAuthenticated } = useAuth();
  const {
    data: todosData,
    isError: isToDoError,
    isLoading: isToDoLoading,
    removeToDo,
    handleTodoClick,
  } = useToDoQuery();
  const {
    data: notesData,
    isError: isNoteError,
    isLoading: isNoteLoading,
    removeNote,
    handleNoteClick,
  } = useNoteQuery();
  const { data: weeksData } = useWeekQuery();
  const [seeAll, setSeeAll] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [, setShowWeeksPopup] = useState(false);
  const todosContainerRef = useRef(null);

  const handleSeeAll = () => {
    setSeeAll(!seeAll);
    if (todosContainerRef.current) {
      todosContainerRef.current.scrollTop = 0;
    }
  };

  const handleSeeLess = () => {
    setSeeAll(false);
  };

  useEffect(() => {
    document.body.style.overflowY = seeAll ? 'auto' : 'hidden';
  }, [seeAll]);

  const hasFutureWeek = () => {
    if (!weeksData || weeksData.length === 0) {
      return false;
    }

    const today = new Date();
    const currentDay = today.getDay();
    const offset = (currentDay + 6) % 7;
    const currentMonday = new Date(today);
    currentMonday.setDate(currentMonday.getDate() - offset);

    const futureWeek = weeksData.some((week) => {
      const weekStartDate = new Date(week.dateOfMonday);
      return weekStartDate > currentMonday;
    });

    return futureWeek;
  };

  const renderSeeAllButton = () => {
    if (!hasFutureWeek()) {
      return null;
    }

    if (!seeAll) {
      return (
        <button type="button" id="see-all" onClick={handleSeeAll}>
          SEE ALL
        </button>
      );
    } else {
      return (
        <button type="button" id="see-less" onClick={handleSeeLess}>
          SEE LESS
        </button>
      );
    }
  };

  const handleDropToTrash = (todoId) => {
    setTodoToDelete(todoId);
    setShowConfirmation(true);
  };

  const handleDropNoteToTrash = (noteId) => {
    setNoteToDelete(noteId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeToDo(todoToDelete);
    } catch (error) {
      console.error('Error deleting todo: ', error);
    } finally {
      setShowConfirmation(false);
      setTodoToDelete(null);
    }
  };

  const handleConfirmDeleteNote = async () => {
    try {
      await removeNote(noteToDelete);
    } catch (error) {
      console.error('Error deleting note: ', error);
    } finally {
      setShowConfirmation(false);
      setNoteToDelete(null);
    }
  };

  const [, drop] = useDrop({
    accept: ['TODO_ITEM', 'NOTE_ITEM'],
    drop: (item) => {
      if (item.type === 'TODO_ITEM') {
        const droppedTodoId = item.id;
        handleDropToTrash(droppedTodoId);
      } else if (item.type === 'NOTE_ITEM') {
        const droppedNoteId = item.id;
        handleDropNoteToTrash(droppedNoteId);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver() && monitor.canDrop(),
    }),
    canDrop: (item, monitor) => monitor.isOver(),
    type: 'TRASH',
  });

  const getCurrentWeekNumber = () => {
    if (!weeksData || weeksData.length === 0) {
      return null;
    }
    const today = new Date();
    const currentDay = today.getDay();
    const offset = (currentDay + 6) % 7;
    const currentMonday = new Date(today);
    currentMonday.setDate(currentMonday.getDate() - offset);
    const currentWeek = weeksData.find((week) => {
      const weekStartDate = new Date(week.dateOfMonday);
      return weekStartDate.getDate() === currentMonday.getDate();
    });
    return currentWeek ? currentWeek.weekNumber : null;
  };

  const renderDateCards = () => {
    const currentWeekNumber = getCurrentWeekNumber();
    const numberOfDays = 7;
    let numberOfWeeks = 1;
    if (seeAll) {
      numberOfWeeks = weeksData.length - currentWeekNumber + 1;
    }
    const dates = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date();
    const currentDay = today.getDay();
    const offset = (currentDay + 6) % 7;
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - offset);
    for (let i = 0; i < numberOfWeeks; i++) {
      const weekDates = [];
      const startDateOfWeek = new Date(weeksData[currentWeekNumber - 1 + i]?.dateOfMonday || firstDayOfWeek);
      for (let j = 0; j < numberOfDays; j++) {
        const date = new Date(startDateOfWeek);
        date.setDate(startDateOfWeek.getDate() + j);
        const dayNameIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        weekDates.push({
          date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
          originalDate: date.toISOString(),
          dayName: days[dayNameIndex],
        });
      }
      dates.push(weekDates);
    }
    const weekRows = [];
    for (let i = 0; i < numberOfWeeks; i++) {
      const week = dates[i];
      const dayElements = week.map(({ date, originalDate, dayName }) => (
        <ToDoDateCard
          key={date}
          date={date}
          originalDate={originalDate}
          dayName={dayName}
          todos={todosData}
          handleTodoClick={handleTodoClick}
          handleDropToTrash={handleDropToTrash}
        />
      ));
      const weekNumber = weeksData && weeksData[currentWeekNumber - 1 + i]?.weekNumber;
      weekRows.push(
        <React.Fragment key={i}>
          {weekNumber && <h2>WEEK {weekNumber}</h2>}
          <div key={i} className="week-container">
            <div className="week-days">
              {dayElements}
              <NotesCard
                key={weekNumber || i}
                weekNumber={weekNumber || `week-${i}`}
                notes={notesData}
                handleNoteClick={handleNoteClick}
                handleDropNoteToTrash={handleDropNoteToTrash}
              />
            </div>
          </div>
        </React.Fragment>,
      );
    }

    return weekRows;
  };

  return (
    <div className="main-container">
      {isAuthenticated && todosData !== "unauthenticated" ? (
        <>
          <MenuBar />
          <Popup
            trigger={
              <button type="button" id="weeks-button">
                set weeks
              </button>
            }
            modal
            nested
            id="weeks-popup"
          >
            <SetWeeks onClose={() => setShowWeeksPopup(false)} />
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
            {isToDoError && <div>Error fetching todos</div>}
            {isNoteError && <div>Error fetching notes</div>}
            {isToDoLoading || isNoteLoading ? (
              <div>Loading...</div>
            ) : (
              <div ref={todosContainerRef} className="todos-container-wrapper">
                <div className="todos-container">{renderDateCards()}</div>
              </div>
            )}
            {weeksData && weeksData.length > 0 && (
              <>
                {renderSeeAllButton()}
              </>
            )}
          </div>
          <ConfirmationDialog
            isOpen={showConfirmation}
            onCancel={() => setShowConfirmation(false)}
            onConfirm={todoToDelete ? handleConfirmDelete : handleConfirmDeleteNote}
          />
        </>
      ) : (
        <UnauthenticatedRedirect />
      )}
    </div>
  );
}


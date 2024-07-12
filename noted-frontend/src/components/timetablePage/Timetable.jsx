import React, { useState } from 'react';
import Switch from 'react-switch';
import { useDrop } from 'react-dnd';
import { useAuth } from '../../hooks/AuthContext';
import MenuBar from '../MenuBar';
import UnauthenticatedRedirect from '../UnauthenticatedRedirect';
import { useTimetable } from '../../hooks/useTimetable';
import ConfirmationDialog from '../todoPage/ConfirmationDialog';
import AddClassButton from './AddClassButton';
import ClassItem from './ClassItem';

export default function Timetable() {
  const { isAuthenticated } = useAuth();
  const { data, isError, isLoading, removeClass } = useTimetable();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [weekTypeFilter, setWeekTypeFilter] = useState(0);

  const generateTimeSlots = () => {
    const timeSlots = [];
    let time = 8;
    while (time <= 18) {
      const hours = Math.floor(time);
      const formattedStartHours = hours.toString().padStart(2, '0');
      const formattedEndHours = (hours + 2).toString();
      const formattedTime = `${formattedStartHours}-${formattedEndHours}`;
      timeSlots.push(formattedTime);
      time += 2;
    }
    return timeSlots;
  };
  const timeSlots = generateTimeSlots();

  const handleDropToTrash = (classId) => {
    setClassToDelete(classId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeClass(classToDelete);
    } catch (error) {
      console.error('Error deleting class: ', error);
    } finally {
      setShowConfirmation(false);
      setClassToDelete(null);
    }
  };

  const [, drop] = useDrop({
    accept: 'CLASS_ITEM',
    drop: (item) => {
      if (item.type === 'CLASS_ITEM') {
        const droppedClassId = item.id;
        handleDropToTrash(droppedClassId);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver() && monitor.canDrop(),
    }),
    canDrop: (item, monitor) => monitor.isOver(),
    type: 'TRASH',
  });

  const renderClasses = (weekdayNumber, timeSlot) => {
    timeSlot = `${timeSlot.split('-')[0]}:00`;
    const startTime = parseInt(timeSlot.split('-')[0]);
    const adjustedStartTime = startTime - 1;
    const formattedAdjustedStartTime = adjustedStartTime.toString().padStart(2, '0') + ':00';
    const classesForDayAndTime = data.filter(
      (classItem) =>
        classItem.weekDayNumber === weekdayNumber &&
        (classItem.startHour === timeSlot || classItem.startHour === formattedAdjustedStartTime) &&
        (classItem.weekType === weekTypeFilter + 1 || classItem.weekType === 3),
    );
    if (classesForDayAndTime.length > 0) {
      return (
        <ClassItem
          key={classesForDayAndTime[0].id}
          classData={classesForDayAndTime[0]}
          handleDropToTrash={handleDropToTrash}
        />
      );
    }
    return null;
  };

  const handleWeekChange = (checked) => {
    setWeekTypeFilter(checked ? 1 : 0);
  };

  return (
    <div className="main-container">
      {isAuthenticated && data !== 'unauthenticated' ? (
        <>
          <MenuBar />
          <AddClassButton />
          <div className="main-content">
            <div className="class-trash-icon" ref={drop}>
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
            {isError && <div>Error fetching classes</div>}
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="classes-container-container">
                <table className="timetable">
                  <thead>
                    <tr className="first-row">
                      <th className="first-column">
                        <label htmlFor="weekSwitch" style={{ display: 'none' }}>
                          {weekTypeFilter === 1 ? 'I' : 'II'}
                        </label>
                        <Switch
                          onChange={handleWeekChange}
                          checked={weekTypeFilter === 1}
                          checkedIcon={<div className="week-type-icon">I</div>}
                          uncheckedIcon={<div className="week-type-icon">II</div>}
                          onColor="#050f10"
                          offColor="#050f10"
                        />
                      </th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot) => (
                      <tr key={timeSlot}>
                        <td className="first-column">{timeSlot}</td>
                        <td>{renderClasses(1, timeSlot)}</td>
                        <td>{renderClasses(2, timeSlot)}</td>
                        <td>{renderClasses(3, timeSlot)}</td>
                        <td>{renderClasses(4, timeSlot)}</td>
                        <td>{renderClasses(5, timeSlot)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

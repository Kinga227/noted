import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useToDoQuery } from '../../hooks/useToDoQuery';
import { useWeekQuery } from '../../hooks/useWeekQuery';
import 'react-datepicker/dist/react-datepicker.css';

export default function SetWeeks({ onClose }) {
  const [weekDates, setWeekDates] = useState({});
  const [warnings, setWarnings] = useState([]);
  const { saveWeeks } = useToDoQuery();
  const { data: weeksData, isLoading: isWeekLoading, isError: isWeekError } = useWeekQuery();

  useEffect(() => {
    if (weeksData && weeksData.length > 0) {
      const initialWeekDates = weeksData.reduce((acc, week) => {
        acc[week.weekNumber] = new Date(week.dateOfMonday);
        return acc;
      }, {});
      setWeekDates(initialWeekDates);
    }
  }, [weeksData]);

  const validateWeeks = () => {
    const warnings = [];
    const weekStartDates = Object.values(weekDates);

    const sortedWeekStartDates = weekStartDates.slice();
    sortedWeekStartDates.sort((a, b) => a - b);

    for (let i = 0; i < weekStartDates.length - 1; i++) {
      const originalDate = weekStartDates[i];
      const sortedDate = sortedWeekStartDates[i];

      if (originalDate !== sortedDate) {
        warnings.push('Weeks are not consecutive.');
        break;
      }
    }

    return warnings;
  };

  const handleDateChange = (date, weekNumber) => {
    if (date) {
      setWeekDates((prevDates) => ({
        ...prevDates,
        [weekNumber]: date,
      }));
    } else {
      const { [weekNumber]: _, ...rest } = weekDates;
      setWeekDates(rest);
    }
  };

  const handleSave = () => {
    const validationWarnings = validateWeeks();
    if (validationWarnings.length > 0) {
      setWarnings(validationWarnings);
      return;
    }

    setWarnings([]);

    const selectedWeeks = Object.entries(weekDates).map(([weekNumber, dateOfMonday]) => ({
      weekNumber: parseInt(weekNumber, 10),
      dateOfMonday: `${new Date(dateOfMonday.getTime() - dateOfMonday.getTimezoneOffset() * 60000).toISOString()}`,
    }));
    saveWeeks(selectedWeeks);
    onClose();
  };

  const renderWeeks = () => {
    const weekItems = [];
    for (let i = 1; i <= 14; i++) {
      weekItems.push(
        <div key={`week-${i}`} className="week-container">
          <div className="week-info">
            <div className="week-number">Week {i}:</div>
            <DatePicker
              selected={weekDates[i]}
              onChange={(date) => handleDateChange(date, i)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select start of the week"
              className="date-picker-input"
              filterDate={(date) => date.getDay() === 1}
              calendarStartDay={1}
            />
          </div>
        </div>,
      );
    }
    return weekItems;
  };

  if (isWeekLoading) {
    return <div>Loading...</div>;
  }

  if (isWeekError) {
    return <div>Error loading weeks data</div>;
  }

  return (
    <div className="selector-container">
      <div className="week-column">{renderWeeks()}</div>
      <button type="button" className="save-button" onClick={handleSave}>
        Save
      </button>
      {warnings.length > 0 && (
        <div className="warnings">
          {warnings.map((warning, index) => (
            <div key={index} className="warning-message">
              {warning}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

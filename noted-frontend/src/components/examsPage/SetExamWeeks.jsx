import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useExamQuery } from '../../hooks/useExamQuery';
import 'react-datepicker/dist/react-datepicker.css';

export default function SetExamWeeks({ onClose }) {
  const [examWeekDates, setExamWeekDates] = useState({});
  const { saveWeeks } = useExamQuery();

  const handleDateChange = (date, weekNumber) => {
    if (date) {
      setExamWeekDates((prevDates) => ({
        ...prevDates,
        [weekNumber]: date,
      }));
    } else {
      const { [weekNumber]: _, ...rest } = examWeekDates;
      setExamWeekDates(rest);
    }
  };

  const handleSave = () => {
    const selectedExamWeeks = Object.entries(examWeekDates).map(([weekNumber, dateOfMonday]) => ({
      weekNumber: parseInt(weekNumber, 10),
      dateOfMonday: `${new Date(dateOfMonday.getTime() - dateOfMonday.getTimezoneOffset() * 60000).toISOString()}`,
    }));
    saveWeeks(selectedExamWeeks);
    onClose();
  };

  const renderExamWeeks = () => {
    const examWeekItems = [];
    for (let i = 1; i <= 4; i++) {
      examWeekItems.push(
        <div key={`week-${i}`} className="exam-week-container">
          <div className="week-info">
            <div className="week-number">
              {i === 3 || i === 4 ? `Exam week ${i} or Resit exam week` : `Exam week ${i}:`}
            </div>
            <DatePicker
              selected={examWeekDates[i]}
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
    return examWeekItems;
  };

  return (
    <div className="selector-container">
      <div className="week-column">{renderExamWeeks()}</div>
      <button type="button" className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

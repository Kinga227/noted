import React, { useState } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts';
import { useAuth } from '../../hooks/AuthContext';
import MenuBar from '../MenuBar';
import UnauthenticatedRedirect from '../UnauthenticatedRedirect';
import CustomTimer from './CustomTimer';
import { useSubjectQuery } from '../../hooks/useSubjectQuery';

export default function Study() {
  const { isAuthenticated } = useAuth();
  const { data, isError, isLoading, addSubject } = useSubjectQuery();
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showNewSubjectInput, setShowNewSubjectInput] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isStudyingStarted, setIsStudyingStarted] = useState(false);

  let subjectsWithTime = [];
  let totalTimeSpent = 0;
  let totalTimeFormatted = '00:00';
  if (data !== undefined) {
    totalTimeSpent = data.reduce((sum, subject) => sum + subject.minutesSpent, 0);
    subjectsWithTime = data.map((subject) => {
      const hours = `0${Math.floor(subject.minutesSpent / 60)}`.slice(-2);
      const minutes = `0${subject.minutesSpent % 60}`.slice(-2);
      const formattedTime = `${hours}:${minutes}`;
      const percentage = totalTimeSpent !== 0 ? (parseInt(subject.minutesSpent) * 100) / totalTimeSpent : 0;
      const formattedPercentage = `${percentage.toFixed(2)}%`

      return {
        id: subject.id,
        value: subject.minutesSpent,
        label: `${subject.name}\u00A0\u00A0(${formattedPercentage})`,
        formatted: formattedTime,
      };
    });

    const totalHours = `0${Math.floor(totalTimeSpent / 60)}`.slice(-2);
    const totalMinutes = `0${totalTimeSpent % 60}`.slice(-2);
    totalTimeFormatted = `${totalHours}:${totalMinutes}`;
  }

  const toggleNewSubjectInput = () => {
    setShowNewSubjectInput(!showNewSubjectInput);
    setNewSubjectName('');
  };

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    setIsButtonDisabled(!isButtonDisabled);
  };

  const handleNewSubjectSave = () => {
    addSubject(newSubjectName);
    setShowNewSubjectInput(false);
    setNewSubjectName(0);
  };

  const handleStartStudying = () => {
    setIsStudyingStarted(true);
  };

  const handleTimerClose = () => {
    setIsStudyingStarted(false);
    setSelectedSubject(0);
  };

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error loading subjects</div>;
  } else {
    content = (
      <select
        value={selectedSubject}
        onChange={(e) => handleSubjectSelect(e.target.value)}
        className="subject-selector"
      >
        <option value="0">Select a subject</option>
        {data.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="main-container">
      {isAuthenticated && data !== "unauthenticated" ? (
        <>
          <MenuBar />
          {!isStudyingStarted ? (
            <div className="study-main-content">
              <div className="study-setter">
                {content}
                <button type="button" className="add-subject-button" onClick={toggleNewSubjectInput}>
                  Add New Subject
                </button>
                {showNewSubjectInput && (
                  <div className="new-subject-container">
                    <input
                      type="text"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="Enter new subject name"
                      className="new-subject-input"
                    />
                    <button type="button" onClick={handleNewSubjectSave} className="save-subject-button">
                      Save
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  className="start-study-button"
                  onClick={handleStartStudying}
                  disabled={isButtonDisabled}
                >
                  START STUDYING
                </button>
              </div>
              <div className="statistics">
                <div className="chart">
                  <div className="statistics-total">Total sime spent studying: {totalTimeFormatted}</div>
                  <PieChart
                    series={[
                      {
                        data: subjectsWithTime,
                        legendTextPattern: ({ label, value }) => `${label} (${value})`,
                        arcLabel: () => '',
                        valueFormatter: (item) => {
                          return `Time spent: ${item.formatted}`;
                        },
                        outerRadius: 110,
                        paddingAngle: 3,
                        cornerRadius: 0,
                        cx: 230,
                        cy: 140,
                      },
                    ]}
                    slotProps={{
                      legend: {
                        direction: 'column',
                        position: {
                          horizontal: 'middle',
                          vertical: 'bottom',
                        },
                        labelStyle: { fontSize: 18, fill: 'white' },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <CustomTimer subjectId={selectedSubject} onClose={handleTimerClose} />
          )}
        </>
      ) : (
        <UnauthenticatedRedirect />
      )}
    </div>
  );
}

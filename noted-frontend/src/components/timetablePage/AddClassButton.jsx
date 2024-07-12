import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Popup from 'reactjs-popup';
import { useTimetable } from '../../hooks/useTimetable';
import { useSubjectQuery } from '../../hooks/useSubjectQuery';

function AddClassButton() {
  const { addClass } = useTimetable();
  const { data, isError, isLoading, addSubject } = useSubjectQuery();
  const [startHour, setStartHour] = useState('08:00');
  const [teacherName, setTeacherName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedWeekDayNumber, setSelectedWeekDayNumber] = useState(null);
  const [selectedWeekType, setSelectedWeekType] = useState(null);
  const [selectedClassTypeId, setSelectedClassTypeId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showNewSubjectInput, setShowNewSubjectInput] = useState(false);
  const queryClient = useQueryClient();
  const popupRef = useRef(null);

  const handleStartHourChange = (event) => {
    setStartHour(event.target.value);
    setIsSaveDisabled(
      event.target.value === '' ||
        teacherName === null ||
        location === null ||
        selectedWeekDayNumber === null ||
        selectedWeekType === null ||
        selectedClassTypeId === null ||
        selectedSubject === '',
    );
  };

  const handleTeacherNameChange = (event) => {
    setTeacherName(event.target.value);
    setIsSaveDisabled(
      event.target.value === '' ||
        startHour === null ||
        location === null ||
        selectedWeekDayNumber === null ||
        selectedWeekType === null ||
        selectedClassTypeId === null ||
        selectedSubject === '',
    );
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    setIsSaveDisabled(
      event.target.value === '' ||
        teacherName === null ||
        startHour === null ||
        selectedWeekDayNumber === null ||
        selectedWeekType === null ||
        selectedClassTypeId === null ||
        selectedSubject === '',
    );
  };

  const handleWeekDayNumberSelect = (weekDayNumber) => {
    setSelectedWeekDayNumber(weekDayNumber);
    setIsSaveDisabled(
      weekDayNumber === null ||
        startHour === '' ||
        teacherName === null ||
        location === null ||
        selectedWeekType === null ||
        selectedClassTypeId === null ||
        selectedSubject === '',
    );
  };

  const handleWeekTypeSelect = (weekTypeId) => {
    setSelectedWeekType(weekTypeId);
    setIsSaveDisabled(
      weekTypeId === null ||
        startHour === '' ||
        teacherName === null ||
        location === null ||
        selectedWeekDayNumber === null ||
        selectedClassTypeId === null ||
        selectedSubject === '',
    );
  };

  const handleClassTypeSelect = (classTypeId) => {
    setSelectedClassTypeId(classTypeId);
    setIsSaveDisabled(
      classTypeId === null ||
        startHour === '' ||
        teacherName === null ||
        location === null ||
        selectedWeekDayNumber === null ||
        selectedWeekType === null ||
        selectedSubject === '',
    );
  };

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    setIsSaveDisabled(
      subjectId === null ||
        startHour === '' ||
        teacherName === null ||
        location === null ||
        selectedWeekDayNumber === null ||
        selectedClassTypeId === null ||
        selectedWeekType === null,
    );
  };

  const handleSaveClick = () => {
    addClass(
      selectedWeekType,
      selectedWeekDayNumber,
      startHour,
      selectedClassTypeId,
      selectedSubject,
      teacherName,
      location,
    );
    queryClient.invalidateQueries('classes');
    if (popupRef.current) {
      popupRef.current.close();
    }

    setStartHour('');
    setTeacherName('');
    setLocation('');
    setSelectedWeekDayNumber(null);
    setSelectedWeekType(null);
    setSelectedClassTypeId(null);
    setSelectedSubject(null);
    setIsSaveDisabled(true);
  };

  const toggleNewSubjectInput = () => {
    setShowNewSubjectInput(!showNewSubjectInput);
    setNewSubjectName('');
  };

  const handleNewSubjectSave = () => {
    addSubject(newSubjectName);
    setShowNewSubjectInput(false);
    setNewSubjectName('');
  };

  const handleClosePopup = () => {
    setShowNewSubjectInput(false);
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
    <Popup
      ref={popupRef}
      trigger={
        <button type="button" className="add-class">
          +
        </button>
      }
      modal
      nested
      onClose={handleClosePopup}
    >
      <div className="add-class-column">
        <div className="add-class-inputs">
          <div className="class-info">
            <div className="hours">
              <div className="input-with-label">
                Start time:
                <select id="startHour" name="startHour" value={startHour} onChange={handleStartHourChange}>
                  {Array.from({ length: 11 }, (_, index) => index + 8).map((hour) => (
                    <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
                  ))}
                </select>
              </div>
            </div>
            <input
              type="text"
              id="teacherName"
              name="teacherName"
              placeholder="Teacher"
              value={teacherName}
              onChange={handleTeacherNameChange}
            />
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Location"
              value={location}
              onChange={handleLocationChange}
            />
          </div>
        </div>
        Day of week:
        <div className="weekday-selector-group">
          <button
            type="button"
            aria-label="monday"
            className={`weekday-selector-button${selectedWeekDayNumber === 1 ? '-selected' : ''}`}
            onClick={() => handleWeekDayNumberSelect(1)}
            selected={selectedWeekDayNumber === 1}
          >
            Monday
          </button>
          <button
            type="button"
            aria-label="tuesday"
            className={`weekday-selector-button${selectedWeekDayNumber === 2 ? '-selected' : ''}`}
            onClick={() => handleWeekDayNumberSelect(2)}
            selected={selectedWeekDayNumber === 2}
          >
            Tuesday
          </button>
          <button
            type="button"
            aria-label="wednesday"
            className={`weekday-selector-button${selectedWeekDayNumber === 3 ? '-selected' : ''}`}
            onClick={() => handleWeekDayNumberSelect(3)}
            selected={selectedWeekDayNumber === 3}
          >
            Wednesday
          </button>
          <button
            type="button"
            aria-label="thursday"
            className={`weekday-selector-button${selectedWeekDayNumber === 4 ? '-selected' : ''}`}
            onClick={() => handleWeekDayNumberSelect(4)}
            selected={selectedWeekDayNumber === 4}
          >
            Thursday
          </button>
          <button
            type="button"
            aria-label="friday"
            className={`weekday-selector-button${selectedWeekDayNumber === 5 ? '-selected' : ''}`}
            onClick={() => handleWeekDayNumberSelect(5)}
            selected={selectedWeekDayNumber === 5}
          >
            Friday
          </button>
        </div>
        Week type:
        <div className="weektype-selector-group">
          <button
            type="button"
            aria-label="1"
            className={`weektype-selector-button${selectedWeekType === 1 ? '-selected' : ''}`}
            onClick={() => handleWeekTypeSelect(1)}
            selected={selectedWeekType === 1}
          >
            I
          </button>
          <button
            type="button"
            aria-label="2"
            className={`weektype-selector-button${selectedWeekType === 2 ? '-selected' : ''}`}
            onClick={() => handleWeekTypeSelect(2)}
            selected={selectedWeekType === 2}
          >
            II
          </button>
          <button
            type="button"
            aria-label="3"
            className={`weektype-selector-button${selectedWeekType === 3 ? '-selected' : ''}`}
            onClick={() => handleWeekTypeSelect(3)}
            selected={selectedWeekType === 3}
          >
            Both
          </button>
        </div>
        Class type:
        <div className="classtype-selector-group">
          <button
            type="button"
            aria-label="course"
            className={`classtype-selector-button${selectedClassTypeId === 1 ? '-selected' : ''}`}
            onClick={() => handleClassTypeSelect(1)}
            selected={selectedClassTypeId === 1}
          >
            Course
          </button>
          <button
            type="button"
            aria-label="seminar"
            className={`classtype-selector-button${selectedClassTypeId === 2 ? '-selected' : ''}`}
            onClick={() => handleClassTypeSelect(2)}
            selected={selectedClassTypeId === 2}
          >
            Seminar
          </button>
          <button
            type="button"
            aria-label="half-group-lab"
            className={`classtype-selector-button${selectedClassTypeId === 3 ? '-selected' : ''}`}
            onClick={() => handleClassTypeSelect(3)}
            selected={selectedClassTypeId === 3}
          >
            Half-group laboratory
          </button>
          <button
            type="button"
            aria-label="ful-group-lab"
            className={`classtype-selector-button${selectedClassTypeId === 4 ? '-selected' : ''}`}
            onClick={() => handleClassTypeSelect(4)}
            selected={selectedClassTypeId === 4}
          >
            Full-group laboratory
          </button>
        </div>
        Subject:
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
        <button type="button" className="save-button" onClick={handleSaveClick} disabled={isSaveDisabled}>
          Save
        </button>
      </div>
    </Popup>
  );
}

export default AddClassButton;

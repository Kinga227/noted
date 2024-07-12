import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import Assignment from './todotypes/Assignment';
import Important from './todotypes/Important';
import Fun from './todotypes/Fun';
import Presenting from './todotypes/Presenting';
import Exam from './todotypes/Exam';
import { useToDoQuery } from '../../hooks/useToDoQuery';
import People from './todotypes/People';
import Calendar from './todotypes/Calendar';

function AddToDoButton({ originalDate }) {
  const { addToDo } = useToDoQuery();
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const queryClient = useQueryClient();
  const popupRef = useRef(null);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setIsSaveDisabled(event.target.value === '' || selectedType === null);
  };

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setIsSaveDisabled(description === '' || typeId === null);
  };

  const handleSaveClick = () => {
    if (selectedType === null) {
      return;
    }

    addToDo(originalDate, description, selectedType);
    queryClient.invalidateQueries('todos');
    if (popupRef.current) {
      popupRef.current.close();
    }

    setDescription('');
    setSelectedType(null);
    setIsSaveDisabled(true);
  };

  return (
    <Popup
      ref={popupRef}
      trigger={
        <button type="button" className="add-todo">
          +
        </button>
      }
      modal
      nested
    >
      <div className="input-group">
        <p id="add-select">Add a description and select a type!</p>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <div className="type-selector-group">
          <button
            type="button"
            aria-label="assignment"
            className={`type-selector-button${selectedType === 1 ? '-selected' : ''}`}
            onClick={() => handleTypeSelect(1)}
            selected={selectedType === 1}
          >
            <Assignment />
          </button>
          <button
            type="button"
            aria-label="important"
            className={`type-selector-button${selectedType === 2 ? '-selected' : ''}`}
            onClick={() => handleTypeSelect(2)}
            selected={selectedType === 2}
          >
            <Important />
          </button>
          <button
            type="button"
            aria-label="fun"
            className={`type-selector-button${selectedType === 3 ? '-selected' : ''}`}
            onClick={() => handleTypeSelect(3)}
            selected={selectedType === 3}
          >
            <Fun />
          </button>
          <button
            type="button"
            aria-label="presenting"
            className={`type-selector-button${selectedType === 4 ? '-selected' : ''}`}
            onClick={() => handleTypeSelect(4)}
            selected={selectedType === 4}
          >
            <Presenting />
          </button>
          <button
            type="button"
            aria-label="exam"
            className={`type-selector-button${selectedType === 5 ? '-selected' : ''}`}
            onClick={() => handleTypeSelect(5)}
            selected={selectedType === 5}
          >
            <Exam />
          </button>
          <button
            type="button"
            aria-label="people"
            className={`type-selector-button${selectedType === 6 ? '-selected' : ''}`}
            onClick={() => handleTypeSelect(6)}
            selected={selectedType === 6}
          >
            <People />
          </button>
          <button
            type="button"
            aria-label="calendar"
            className={`type-selector-button${selectedType === 7 ? '-selected' : ''}`}
            onClick={() => handleTypeSelect(7)}
            selected={selectedType === 7}
          >
            <Calendar />
          </button>
        </div>
        <button type="button" className="save-button" onClick={handleSaveClick} disabled={isSaveDisabled}>
          Save
        </button>
      </div>
    </Popup>
  );
}

export default AddToDoButton;

import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import { useNoteQuery } from '../../hooks/useNoteQuery';

function AddNoteButton({ weekNumber }) {
  const { addNote } = useNoteQuery();
  const [description, setDescription] = useState('');
  const [isSaveDisabled, setIsSaveDisabled] = useState(null);
  const queryClient = useQueryClient();
  const popupRef = useRef(null);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setIsSaveDisabled(event.target.value === '');
  };

  const handleSaveClick = () => {
    addNote(weekNumber, description);
    queryClient.invalidateQueries('notes');
    if (popupRef.current) {
      popupRef.current.close();
    }

    setDescription('');
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
        <p id="add-desc">Add a description!</p>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="description"
          value={description}
          onChange={handleDescriptionChange}
        />
        <button type="button" className="save-button" onClick={handleSaveClick} disabled={isSaveDisabled}>
          Save
        </button>
      </div>
    </Popup>
  );
}

export default AddNoteButton;

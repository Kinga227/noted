import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Popup from 'reactjs-popup';
import { useExamQuery } from '../../hooks/useExamQuery';

function AddExamButton({ originalDate }) {
  const { addExam } = useExamQuery();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaveDisabled, setSaveDisabled] = useState(true);
  const queryClient = useQueryClient();
  const popupRef = useRef(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setSaveDisabled(event.target.value === '');
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSaveClick = () => {
    addExam(originalDate, title, description);
    queryClient.invalidateQueries('exams');
    if (popupRef.current) {
      popupRef.current.close();
    }

    setTitle('');
    setDescription('');
    setSaveDisabled(true);
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
        <p id="add-title">Add a title and optionally a description!</p>
        <input type="text" id="title" name="title" placeholder="title" value={title} onChange={handleTitleChange} />
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Description"
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

export default AddExamButton;

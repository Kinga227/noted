import { useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { useQueryClient } from '@tanstack/react-query';
import { usePointsQuery } from '../../hooks/usePointsQuery';

function AddPointButton({ subjectId, pointData }) {
  const { addPoint } = usePointsQuery(subjectId);
  const [selectedPointTypeId, setSelectedPointTypeId] = useState(pointData.length > 0 ? pointData[0].id : '');
  const [newPoints, setNewPoints] = useState(0.0);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const queryClient = useQueryClient();
  const popupRef = useRef(null);

  const handlePointTypeChange = (pointTypeId) => {
    setSelectedPointTypeId(pointTypeId);
    setIsSaveDisabled(pointTypeId === '' || newPoints === 0.0);
  };

  const handlePointChange = (event) => {
    setNewPoints(event.target.value);
    setIsSaveDisabled(event.target.value === 0.0 || selectedPointTypeId === '');
  };

  const handleSaveClick = () => {
    addPoint(selectedPointTypeId, newPoints);
    queryClient.invalidateQueries('points');
    if (popupRef.current) {
      popupRef.current.close();
    }
    setSelectedPointTypeId(null);
    setNewPoints(0.0);
    setIsSaveDisabled(true);
  };

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
    >
      <div className="add-class-column">
        <div className="add-class-inputs">
          <div className="class-info">
            Point type:
            <select
              value={selectedPointTypeId}
              onChange={(e) => handlePointTypeChange(e.target.value)}
              className="subject-selector"
            >
              {pointData.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.typeName}
                </option>
              ))}
            </select>
            <input
              className="minmax-input"
              type="number"
              id="pointcount"
              name="pointcount"
              placeholder="Points Count"
              value={newPoints}
              onChange={handlePointChange}
            />
          </div>
        </div>
        <button type="button" className="save-button" onClick={handleSaveClick} disabled={isSaveDisabled}>
          Save
        </button>
      </div>
    </Popup>
  );
}

export default AddPointButton;

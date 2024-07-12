import React, { useState } from 'react';
import { usePointsQuery } from '../../hooks/usePointsQuery';
import { useSubjectQuery } from '../../hooks/useSubjectQuery';

function NewPointSystem({ subjectId }) {
  const { addPointType } = usePointsQuery(subjectId);
  const { setGradingFormula } = useSubjectQuery();
  const [typeName, setTypeName] = useState('');
  const [min, setMin] = useState(0.0);
  const [max, setMax] = useState(0.0);
  const [totalMin, setTotalMin] = useState(0.0);
  const [totalMax, setTotalMax] = useState(0.0);
  const [newFormula, setNewFormula] = useState('');
  const [showNewPointsInput, setShowNewPointsInput] = useState(false);
  const [showFormulaInput, setShowFormulaInput] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const handleTypeNameChange = (event) => {
    setTypeName(event.target.value);
  };

  const handleMinChange = (event) => {
    setMin(event.target.value);
  };

  const handleMaxChange = (event) => {
    setMax(event.target.value);
  };

  const handleTotalMinChange = (event) => {
    setTotalMin(event.target.value);
    setIsSaveDisabled(!isSaveDisabled);
  };

  const handleTotalMaxChange = (event) => {
    setTotalMax(event.target.value);
    setIsSaveDisabled(!isSaveDisabled);
  };

  const handleSaveClick = () => {
    addPointType('Total', totalMin, totalMax);
    setTotalMin('0.0');
    setTotalMax('0.0');
    setIsSaveDisabled(!isSaveDisabled);
  };

  const toggleNewPointsInput = () => {
    setShowNewPointsInput(!showNewPointsInput);
    setTypeName('');
    setMin('0.0');
    setMax('0.0');
  };

  const handleNewPointsSave = (event) => {
    event.stopPropagation();
    addPointType(typeName, min, max);
    setShowNewPointsInput(false);
    setTypeName('');
    setMin('0.0');
    setMax('0.0');
  };

  const handleFormulaChange = (event) => {
    setNewFormula(event.target.value);
  };

  const handleNewFormulaSave = () => {
    setGradingFormula(subjectId, newFormula);
    setShowFormulaInput(false);
    setNewFormula('');
  };

  const toggleNewFormulaInput = () => {
    setShowFormulaInput(!showFormulaInput);
    setNewFormula('');
  };

  return (
    <div className="add-class-column">
      <div className="add-class-inputs">
        <div className="class-info">
          <button type="button" className="add-formula-button" onClick={toggleNewFormulaInput}>
            Set formula
          </button>
          {showFormulaInput && (
            <div className="new-subject-container">
              <input
                className="formula-input"
                type="text"
                id="formula"
                name="formula"
                placeholder="Formula"
                value={newFormula}
                onChange={handleFormulaChange}
              />
              <button type="button" onClick={handleNewFormulaSave} className="save-subject-button">
                Save
              </button>
            </div>
          )}
          <button type="button" className="add-button" onClick={toggleNewPointsInput}>
            Add new point type
          </button>
          {showNewPointsInput && (
            <div className="new-subject-container">
              Type name:
              <input
                className="typename-input"
                type="text"
                id="typename"
                name="typename"
                placeholder="Type name"
                value={typeName}
                onChange={handleTypeNameChange}
              />
              Min:
              <input
                className="minmax-input"
                type="number"
                id="min"
                name="min"
                placeholder="Min points"
                value={min}
                onChange={handleMinChange}
              />
              Max:
              <input
                className="minmax-input"
                type="number"
                id="max"
                name="max"
                placeholder="Max points"
                value={max}
                onChange={handleMaxChange}
              />
              <button type="button" onClick={handleNewPointsSave} className="save-subject-button">
                Save
              </button>
            </div>
          )}
          <div className="total-label">Total:</div>
          <div className="selector-group">
            <input
              className="minmax-input"
              type="number"
              id="totalmin"
              name="totalmin"
              placeholder="Min points"
              value={totalMin}
              onChange={handleTotalMinChange}
            />
            <input
              className="minmax-input"
              type="number"
              id="totalmax"
              name="totalmax"
              placeholder="Max points"
              value={totalMax}
              onChange={handleTotalMaxChange}
            />
          </div>
          <button type="button" className="total-save-button" onClick={handleSaveClick} disabled={isSaveDisabled}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPointSystem;

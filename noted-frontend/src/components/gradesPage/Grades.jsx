import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import MenuBar from '../MenuBar';
import NewPointSystem from './NewPointSystem';
import AddPointButton from './AddPointButton';
import UnauthenticatedRedirect from '../UnauthenticatedRedirect';
import { useSubjectQuery } from '../../hooks/useSubjectQuery';
import { usePointsQuery } from '../../hooks/usePointsQuery';

export default function Grades() {
  const { isAuthenticated } = useAuth();
  const { data: subjectData, isError: isSubjectError, isLoading: isSubjectLoading, addSubject } = useSubjectQuery();
  const [selectedSubjectId, setSelectedSubjectId] = useState(localStorage.getItem('selectedSubjectId') || '');
  const { data, isLoading: isPointLoading, refetch: refetchPoints } = usePointsQuery(selectedSubjectId);
  const pointData = data ? data.points : [];
  const gradingFormula = data ? data.formula : '';
  const [showNewSubjectInput, setShowNewSubjectInput] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectFormula, setNewSubjectFormula] = useState('');

  useEffect(() => {
    if (subjectData && subjectData.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjectData[0].id);
    }
  }, [subjectData, selectedSubjectId]);

  useEffect(() => {
    if (selectedSubjectId && selectedSubjectId !== '0') {
      refetchPoints();
      localStorage.setItem('selectedSubjectId', selectedSubjectId);
    }
  }, [selectedSubjectId, subjectData, gradingFormula, refetchPoints]);

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubjectId(subjectId);
  };

  const toggleNewSubjectInput = () => {
    setShowNewSubjectInput(!showNewSubjectInput);
    setNewSubjectName('');
    setNewSubjectFormula('');
  };

  const handleNewSubjectSave = () => {
    addSubject(newSubjectName, newSubjectFormula);
    setShowNewSubjectInput(false);
    setNewSubjectName('');
    setNewSubjectFormula('');
  };

  const typeNamePointsList = [];
  if (pointData.length > 0) {
    pointData.forEach((point) => {
      typeNamePointsList.push({ typeName: point.typeName, points: point.points });
    });
  }

  let totalPoint;
  let totalPoints;
  if (pointData && pointData !== -1) {
    totalPoint = pointData.find((point) => point.typeName === 'Total');
    totalPoints = pointData.reduce((sum, point) => sum + point.points, 0).toFixed(2);
  }

  let formulaTokens = [];
  let isCalculable = false;
  if (gradingFormula.length > 0) {
    isCalculable = true;
    const definedTokens = ['+', '-', '*', '/', '%', '(', ',', ')', 'min', '>', '>=', '='];
    const tokenPattern = new RegExp(
      `(${definedTokens.map((token) => token.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')).join('|')})`,
      'g',
    );
    const formattedGradingFormula = gradingFormula.replace(tokenPattern, ' $1 ').replace(/\s+/g, ' ').trim();
    formulaTokens = formattedGradingFormula.split(' ');

    for (let i = 0; i < formulaTokens.length; i++) {
      const token = formulaTokens[i];
      if (token === '%') {
        formulaTokens[i - 1] = (formulaTokens[i - 1] / 100).toString();
        formulaTokens[i] = '*';
      }
      if (token === 'min') {
        formulaTokens[i] = 'Math.min';
      }
      if (!definedTokens.includes(token) && Number.isNaN(parseFloat(token))) {
        const typeNameItem = typeNamePointsList.find((item) => item.typeName === token);
        if (typeNameItem === undefined) {
          isCalculable = false;
          break;
        } else {
          if (typeNameItem !== undefined && typeNameItem.typeName === 'Total') {
            formulaTokens[i] = totalPoints.split('.')[0];
          } else {
            formulaTokens[i] = typeNameItem.points.toString();
          }
        }
      }
    }
  }
  let gradingResultMessage = '';
  let color = '';
  if (!isCalculable) {
    if (gradingFormula === -1) {
      gradingResultMessage = 'There is no formula set for this subject.';
      color = 'red';
    } else {
      gradingResultMessage =
        'This formula cannot be calculated. Make sure you have correctly entered the point type names.';
      color = 'red';
    }
  } else {
    const formula = formulaTokens.join('');
    try {
      let result = eval(formula);
      if (typeof result === 'boolean') {
        gradingResultMessage = `Your current grade ${
          result ? 'meets the minimum requirement.' : 'does not meet the minimum requirement.'
        }`;
        color = result ? 'green' : 'red';
      } else {
        result = result.toFixed(2);
        gradingResultMessage = `Your current grade is: ${result}`;
        color = result >= 5.0 ? 'green' : 'red';
      }
    } catch (error) {
      gradingResultMessage = 'The evaluation of the formula was unsuccessful.';
      color = 'red';
      console.error('Error evaluating formula: ', error);
    }
  }

  let content;
  if (isSubjectLoading) {
    content = <div>Loading...</div>;
  } else if (isSubjectError) {
    content = <div>Error loading subjects</div>;
  } else {
    content = (
      <select
        value={selectedSubjectId}
        onChange={(e) => handleSubjectSelect(e.target.value)}
        className="subject-selector"
      >
        <option value="0">Select a subject</option>
        {subjectData.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="main-container">
      {isAuthenticated && subjectData !== 'unauthenticated' && data !== 'unauthenticated' ? (
        <>
          <MenuBar />
          <div className="main-content">
            <div className="subject-selector-wrapper">
              <h3>Subject:</h3>
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
                  <input
                    type="text"
                    value={newSubjectFormula}
                    onChange={(e) => setNewSubjectFormula(e.target.value)}
                    placeholder="Enter formula (optional)"
                    className="new-subject-input"
                  />
                  <button
                    type="button"
                    onClick={handleNewSubjectSave}
                    disabled={!newSubjectName}
                    className="save-subject-button"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
            {(selectedSubjectId === '0' || selectedSubjectId === null || selectedSubjectId === undefined) && (
              <div>Select a subject.</div>
            )}
            {selectedSubjectId !== null &&
              selectedSubjectId !== '0' &&
              (!gradingFormula || !pointData || isPointLoading) && <div>Loading formula and points...</div>}
            {selectedSubjectId !== null && selectedSubjectId !== '0' && subjectData.length > 0 && (
              <div className="grades-container-container">
                {gradingFormula !== -1 && <p className="formula">{gradingFormula}</p>}
                <p className={`result-message-${color}`}>{gradingResultMessage}</p>
                {pointData === -1 || pointData.length === 0 ? (
                  <div>
                    <NewPointSystem subjectId={selectedSubjectId} />
                  </div>
                ) : (
                  <div className="system-container">
                    <NewPointSystem subjectId={selectedSubjectId} />
                    <table className="gradestable">
                      <thead>
                        <tr>
                          <th>point type</th>
                          <th>min</th>
                          <th>max</th>
                          <th>my points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pointData.map(
                          (point) =>
                            point.typeName !== 'Total' && (
                              <tr key={point.id}>
                                <td className="first-column">{point.typeName}</td>
                                <td>{point.min}</td>
                                <td>{point.max}</td>
                                <td>{point.points.toFixed(2)}</td>
                              </tr>
                            ),
                        )}
                        {totalPoint && (
                          <tr key={selectedSubjectId}>
                            <td>Total</td>
                            <td>{totalPoint.min}</td>
                            <td>{totalPoint.max}</td>
                            <td>{totalPoints}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <AddPointButton subjectId={selectedSubjectId} pointData={pointData} />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <UnauthenticatedRedirect />
      )}
    </div>
  );
}

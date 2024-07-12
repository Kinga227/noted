import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import {
  fetchAllSubjects,
  newSubject,
  updateSubjectGradingFormula,
  updateSubjectMinutesSpent,
} from '../api/subjects.api';

export function useSubjectQuery() {
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['subjects'],
    queryFn: () => fetchAllSubjects(),
  });

  const addSubject = async (name, formula) => {
    try {
      const subjectData = {
        name,
        gradingFormula: formula,
        minutesSpent: 0,
      };
      const response = await newSubject(subjectData);
      queryClient.invalidateQueries('subjects');
      return response.data;
    } catch (error) {
      console.error('Error adding new subject: ', error.message);
      throw new Error('Error adding new todo: ', error.message);
    }
  };

  const setGradingFormula = async (subjectId, formula) => {
    try {
      const response = await updateSubjectGradingFormula(subjectId, formula);
      queryClient.invalidateQueries('grades');
      return response.data;
    } catch (error) {
      console.error('Error setting new formula: ', error.message);
      throw new Error('Error setting new formula: ', error.message);
    }
  };

  const setMinutesSpent = async (subjectId, minutes) => {
    try {
      const response = await updateSubjectMinutesSpent(subjectId, minutes);
      return response.data;
    } catch (error) {
      console.error('Error adding new study time: ', error.message);
      throw new Error('Error adding new study time: ', error.message);
    }
  };

  return { authToken, addSubject, setGradingFormula, setMinutesSpent, ...queryResult };
}

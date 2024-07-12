import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { fetchAllExams, updateExamDate, newExam, deleteExam, setExamWeeks } from '../api/exams.api';

export function useExamQuery() {
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['exams'],
    queryFn: () => fetchAllExams(),
  });

  const updateDate = async (examId, newDate) => {
    try {
      const response = await updateExamDate(examId, newDate);
      queryClient.invalidateQueries('exams');
      return response.data;
    } catch (error) {
      console.error('Error updating exam date: ', error.message);
      throw new Error('Error updating exam date: ', error.message);
    }
  };

  const addExam = async (date, title, description) => {
    try {
      const examData = {
        date,
        title,
        description,
      };
      const response = await newExam(examData);
      queryClient.invalidateQueries('exams');
      return response.data;
    } catch (error) {
      console.error('Error adding new exam: ', error.message);
      throw new Error('Error adding new exam: ', error.message);
    }
  };

  const removeExam = async (examId) => {
    try {
      const response = await deleteExam(examId);
      queryClient.invalidateQueries('exams');
      return response.data;
    } catch (error) {
      console.error('Error deleting exam: ', error.message);
      throw new Error('Error deleting exam: ', error.message);
    }
  };

  const saveWeeks = async (selectedWeeks) => {
    try {
      const response = await setExamWeeks(selectedWeeks);
      queryClient.invalidateQueries('exams');
      return response.data;
    } catch (error) {
      console.error('Error saving weeks: ', error.message);
      throw new Error('Error saving weeks: ', error.message);
    }
  };

  return {
    authToken,
    updateDate,
    addExam,
    removeExam,
    saveWeeks,
    ...queryResult,
  };
}

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { fetchAllClasses, newClass, deleteClass } from '../api/classes.api';

export function useTimetable() {
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['classes'],
    queryFn: () => fetchAllClasses(),
  });

  const addClass = async (weekType, weekDayNumber, startHour, classTypeId, subjectId, teacherName, location) => {
    try {
      const classData = {
        weekType,
        weekDayNumber,
        startHour,
        classTypeId,
        subjectId,
        teacherName,
        location,
      };
      const response = await newClass(classData);
      queryClient.invalidateQueries('classes');
      return response.data;
    } catch (error) {
      console.error('Error adding new class: ', error.message);
      throw new Error('Error adding new class: ', error.message);
    }
  };

  const removeClass = async (classId) => {
    try {
      const response = await deleteClass(classId);
      queryClient.invalidateQueries('classes');
      return response.data;
    } catch (error) {
      console.error('Error deleting class: ', error.message);
      throw new Error('Error deleting class: ', error.message);
    }
  };

  return {
    authToken,
    addClass,
    removeClass,
    ...queryResult,
  };
}

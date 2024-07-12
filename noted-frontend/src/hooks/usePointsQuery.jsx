import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { fetchAllPoints, newPoint, updatePoint } from '../api/grades.api';
import { getSubjectGradingFormula } from '../api/subjects.api';

export function usePointsQuery(subjectId) {
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['points'],
    queryFn: async () => {
      const [pointsData, formulaData] = await Promise.all([
        fetchAllPoints(subjectId),
        getSubjectGradingFormula(subjectId),
      ]);
      return { points: pointsData, formula: formulaData };
    },
  });

  const addPointType = async (typeName, min, max) => {
    try {
      const pointData = {
        typeName,
        min,
        max,
        subjectId,
      };
      const response = await newPoint(pointData);
      queryClient.invalidateQueries('points');
      return response.data;
    } catch (error) {
      console.error('Error adding new point: ', error.message);
      throw new Error('Error adding new point: ', error.message);
    }
  };

  const addPoint = async (typeId, points) => {
    try {
      const response = await updatePoint(typeId, points);
      queryClient.invalidateQueries('points');
      return response.data;
    } catch (error) {
      console.error('Error updating points: ', error.message);
      throw new Error('Error updating points: ', error.message);
    }
  };

  return { authToken, addPointType, addPoint, ...queryResult };
}

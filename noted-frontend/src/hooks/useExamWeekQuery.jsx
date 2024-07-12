import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { fetchExamWeeks } from '../api/exams.api';

export function useExamWeekQuery() {
  const { authToken } = useAuth();

  const queryResult = useQuery({
    queryKey: ['examweeks'],
    queryFn: () => fetchExamWeeks(),
  });

  return { authToken, ...queryResult };
}

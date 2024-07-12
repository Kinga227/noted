import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { fetchWeeks } from '../api/todos.api';

export function useWeekQuery() {
  const { authToken } = useAuth();

  const queryResult = useQuery({
    queryKey: ['weeks'],
    queryFn: () => fetchWeeks(),
  });

  return { authToken, ...queryResult };
}

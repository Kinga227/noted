import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { fetchAllToDos, setToDoDone, updateTodoDate, newToDo, deleteToDo, setWeeks } from '../api/todos.api';

export function useToDoQuery() {
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetchAllToDos(),
  });

  const updateToDoItem = async (todoId) => {
    try {
      const response = await setToDoDone(todoId);
      queryClient.invalidateQueries('todos');
      return response.data;
    } catch (error) {
      console.error('Error updating todo item: ', error.message);
      throw new Error('Error updating todo item: ', error.message);
    }
  };

  const updateDate = async (todoId, newDate) => {
    try {
      const response = await updateTodoDate(todoId, newDate);
      queryClient.invalidateQueries('todos');
      return response.data;
    } catch (error) {
      console.error('Error updating todo date: ', error.message);
      throw new Error('Error updating todo date: ', error.message);
    }
  };

  const handleTodoClick = (todoId) => {
    updateToDoItem(todoId);
  };

  const addToDo = async (date, description, selectedType) => {
    try {
      const todoData = {
        date,
        description,
        done: false,
        typeId: selectedType,
      };
      const response = await newToDo(todoData);
      queryClient.invalidateQueries('todos');
      return response.data;
    } catch (error) {
      console.error('Error adding new todo: ', error.message);
      throw new Error('Error adding new todo: ', error.message);
    }
  };

  const removeToDo = async (todoId) => {
    try {
      const response = await deleteToDo(todoId);
      queryClient.invalidateQueries('todos');
      return response.data;
    } catch (error) {
      console.error('Error deleting todo: ', error.message);
      throw new Error('Error deleting todo: ', error.message);
    }
  };

  const saveWeeks = async (selectedWeeks) => {
    try {
      const response = await setWeeks(selectedWeeks);
      queryClient.invalidateQueries('todos');
      return response.data;
    } catch (error) {
      console.error('Error saving weeks: ', error.message);
      throw new Error('Error saving weeks: ', error.message);
    }
  };

  return {
    authToken,
    updateToDoItem,
    updateDate,
    addToDo,
    removeToDo,
    saveWeeks,
    handleTodoClick,
    ...queryResult,
  };
}

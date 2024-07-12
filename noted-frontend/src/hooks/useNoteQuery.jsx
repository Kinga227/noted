import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext';

import { fetchAllNotes, setNoteDone, updateWeekNumber, newNote, deleteNote } from '../api/todos.api';

export function useNoteQuery() {
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['notes'],
    queryFn: () => fetchAllNotes(),
  });

  const updateNoteItem = async (noteId) => {
    try {
      const response = await setNoteDone(noteId);
      queryClient.invalidateQueries('notes');
      return response.data;
    } catch (error) {
      console.error('Error updating note item: ', error.message);
      throw new Error('Error updating note item: ', error.message);
    }
  };

  const updateNoteWeekNumber = async (noteId, newWeekNumber) => {
    try {
      const response = await updateWeekNumber(noteId, newWeekNumber);
      queryClient.invalidateQueries('todos');
      return response.data;
    } catch (error) {
      console.error('Error updating note date: ', error.message);
      throw new Error('Error updating note date: ', error.message);
    }
  };

  const handleNoteClick = (noteId) => {
    updateNoteItem(noteId);
  };

  const addNote = async (weekNumber, description) => {
    try {
      const noteData = {
        weekNumber,
        description,
        done: false,
      };
      const response = await newNote(noteData);
      queryClient.invalidateQueries('notes');
      return response.data;
    } catch (error) {
      console.error('Error addig new note: ', error.message);
      throw new Error('Error adding new note: ', error.message);
    }
  };

  const removeNote = async (noteId) => {
    try {
      const response = await deleteNote(noteId);
      queryClient.invalidateQueries('notes');
      return response.data;
    } catch (error) {
      console.error('Error deleting note: ', error.message);
      throw new Error('Error deleting note: ', error.message);
    }
  };

  return {
    authToken,
    updateNoteItem,
    updateNoteWeekNumber,
    addNote,
    removeNote,
    handleNoteClick,
    ...queryResult,
  };
}

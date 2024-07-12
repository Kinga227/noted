import axios from 'axios';

axios.defaults.withCredentials = true;
export const notedApi = axios.create({
  baseURL: 'http://localhost:8080/api/noted/todos',
  headers: {
    Accept: 'application/json',
  },
});

export async function fetchAllToDos() {
  try {
    const result = await notedApi.get();
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error(' Error fetching todos: ', error);
    return [];
  }
}

export async function fetchAllNotes() {
  try {
    const result = await notedApi.get('/notes');
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error fetching notes: ', error);
    return [];
  }
}

export async function fetchWeeks() {
  try {
    const result = await notedApi.get('/weeks');
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error fetching weeks: ', error);
    return [];
  }
}

export async function setToDoDone(todoId) {
  try {
    const result = await notedApi.post(`/${todoId}/done`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error updating todo done/not done: ', error);
    throw error;
  }
}

export async function setNoteDone(noteId) {
  try {
    const result = await notedApi.post(`/note/${noteId}/done`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error updating note done/not done: ', error);
    throw error;
  }
}

export async function deleteToDo(todoId) {
  try {
    const result = await notedApi.delete(`/${todoId}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error deleting todo: ', error);
    throw error;
  }
}

export async function deleteNote(noteId) {
  try {
    const result = await notedApi.delete(`/note/${noteId}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error deleting note: ', error);
    throw error;
  }
}

export async function newToDo(data) {
  try {
    const result = await notedApi.post('/new', data);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error creating todo: ', error);
    throw error;
  }
}

export async function newNote(data) {
  try {
    const result = await notedApi.post('/note/new', data);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error creating note: ', error);
    throw error;
  }
}

export async function updateTodoDate(todoId, newDate) {
  try {
    const instantDate = new Date(newDate).toISOString();
    const result = await notedApi.patch(`/${todoId}/date/${instantDate}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error updating todo: ', error);
    throw error;
  }
}

export async function updateWeekNumber(noteId, newWeekNumber) {
  try {
    const result = await notedApi.patch(`/${noteId}/weekNumber/${newWeekNumber}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error updating note: ', error);
    throw error;
  }
}

export async function setWeeks(selectedWeeks) {
  try {
    const result = await notedApi.post('/weeks', selectedWeeks);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error setting weeks: ', error);
    throw error;
  }
}

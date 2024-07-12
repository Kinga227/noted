import axios from 'axios';

axios.defaults.withCredentials = true;
export const notedApi = axios.create({
  baseURL: 'http://localhost:8080/api/noted/exams',
  headers: {
    Accept: 'application/json',
  },
});

export async function fetchAllExams() {
  try {
    const result = await notedApi.get();
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error fetching exams: ', error);
    return [];
  }
}

export async function fetchExamWeeks() {
  try {
    const result = await notedApi.get('/weeks');
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error fetching exam weeks: ', error);
    return [];
  }
}

export async function deleteExam(examId) {
  try {
    const result = await notedApi.delete(`/${examId}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error deleting exam: ', error);
    throw error;
  }
}

export async function newExam(data) {
  try {
    const result = await notedApi.post('/new', data);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error creating exam: ', error);
    throw error;
  }
}

export async function updateExamDate(examId, newDate) {
  try {
    const instantDate = new Date(newDate).toISOString();
    const result = await notedApi.patch(`/${examId}/date/${instantDate}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error updating exam date: ', error);
    throw error;
  }
}

export async function setExamWeeks(selectedExamWeeks) {
  try {
    const result = await notedApi.post('/weeks', selectedExamWeeks);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error setting exam weeks: ', error);
    throw error;
  }
}

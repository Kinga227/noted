import axios from 'axios';

axios.defaults.withCredentials = true;
export const notedApi = axios.create({
  baseURL: 'http://localhost:8080/api/noted/subjects',
  headers: {
    Accept: 'application/json',
  },
});

export async function fetchAllSubjects() {
  try {
    const result = await notedApi.get();
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error fetching subjects: ', error);
    return [];
  }
}

export async function newSubject(data) {
  try {
    const result = await notedApi.post('/new', data);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error creating subject: ', error);
    throw error;
  }
}

export async function getSubjectGradingFormula(subjectId) {
  try {
    const result = await notedApi.get(`/${subjectId}/gradingFormula`);
    if (result.data === '') {
      return [];
    }
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error getting grading formula: ', error);
    throw error;
  }
}

export async function updateSubjectGradingFormula(subjectId, newFormula) {
  try {
    const requestBody = { formula: newFormula };
    const result = await notedApi.patch(`/${subjectId}/formula`, requestBody);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error updating grading formula: ', error);
    throw error;
  }
}

export async function updateSubjectMinutesSpent(subjectId, newTime) {
  try {
    const result = await notedApi.patch(`/${subjectId}/minutes/${newTime}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error updating minutes spent: ', error);
    throw error;
  }
}

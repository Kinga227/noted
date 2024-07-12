import axios from 'axios';

axios.defaults.withCredentials = true;
export const notedApi = axios.create({
  baseURL: 'http://localhost:8080/api/noted/classes',
  headers: {
    Accept: 'application/json',
  },
});

export async function fetchAllClasses() {
  try {
    const result = await notedApi.get();
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error fetching classes: ', error);
    return [];
  }
}

export async function deleteClass(classId) {
  try {
    const result = await notedApi.delete(`/${classId}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error deleting class: ', error);
    throw error;
  }
}

export async function newClass(data) {
  try {
    const result = await notedApi.post('/new', data);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error creating class: ', error);
    throw error;
  }
}

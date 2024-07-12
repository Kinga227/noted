import axios from 'axios';

axios.defaults.withCredentials = true;
export const notedApi = axios.create({
  baseURL: 'http://localhost:8080/api/noted/points',
  headers: {
    Accept: 'application/json',
  },
});

export async function fetchAllPoints(subjectId) {
  if (subjectId !== undefined && subjectId !== '0') {
    try {
      const result = await notedApi.get(`/${subjectId}`);
      if (result.data.length === 0) {
        return -1;
      }
      return result.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return "unauthenticated";
      }
      console.error('Error fetching points: ', error);
      return [];
    }
  } else {
    return [];
  }
}

export async function newPoint(data) {
  try {
    const result = await notedApi.post(`/${data.subjectId}/new`, data);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error creating point: ', error);
    throw error;
  }
}

export async function updatePoint(pointTypeId, point) {
  try {
    const result = await notedApi.patch(`/${pointTypeId}/point/${point}`);
    return result;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return "unauthenticated";
    }
    console.error('Error updating point: ', error);
    throw error;
  }
}

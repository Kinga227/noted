import axios from 'axios';

export const notedApi = axios.create({
  baseURL: 'http://localhost:8080/api/noted/auth',
  headers: {
    Accept: 'application/json',
  },
});

export const login = async (user) => {
  try {
    const response = await notedApi.post('/login', user);
    return response.data;
  } catch (error) {
    console.error('Error in login request:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.response ? error.response.data.message : 'Login failed',
    };
  }
};

export const logout = async (token) => {
  try {
    const response = await notedApi.post('/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in logout request:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.response ? error.response.data.message : 'Logout failed',
    };
  }
};

export const register = async (user) => {
  try {
    const response = await notedApi.post('/registration', user);
    return response.data;
  } catch (error) {
    console.error('Error in registration request:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.response ? error.response.data.message : 'Registration failed',
    };
  }
};

export const getUserData = async () => {
  try {
    const response = await notedApi.get();
    return response.data;
  } catch (error) {
    console.error('Error in fetching user data:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.response ? error.response.data.message : 'Failed to fetch user data',
    };
  }
};
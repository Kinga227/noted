import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getUserData } from '../api/noted.api';
import { useAuth } from './AuthContext';

export const useLogin = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const { setAuthToken, setUser: setAuthUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      await getUserData();
    } catch (err) {
      console.error('Error fetching user data: ', err);
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const loggedInUser = await login(user);

      if (loggedInUser.token) {
        setAuthToken(loggedInUser.token);
        const userData = await getUserData();
        setAuthUser(userData);
        setIsAuthenticated(true);
        navigate('/todos');
      } else {
        console.error('Login failed: ', loggedInUser.message);
        if (loggedInUser.response && loggedInUser.response.status === 403) {
          setError('Invalid credentials. Please check your email and password.');
        } else if (loggedInUser.response && loggedInUser.response.status === 404) {
          setError('No user registered with given email.');
        } else {
          setError(loggedInUser.message || 'Unknown error occurred during login.');
        }
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Login failed. Please try again later.');
    }
  };

  return { user, setUser, error, setError, handleLogin, fetchData };
};
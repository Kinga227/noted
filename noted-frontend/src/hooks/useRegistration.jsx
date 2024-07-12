import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/noted.api';

export const useRegistration = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegistration = async () => {
    try {
      if (user.password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      const newUser = await register(user);
      if (newUser.success) {
        navigate('/login');
      } else {
        console.error('Registration failed: ', newUser.message);
        if (newUser.message === 'Email already exists.') {
          setError('Email already exists. Please use a different email or try signing in to your existing account.');
        } else {
          setError(newUser.message || 'Unknown error occurred during registration.');
        }
      }
    } catch (err) {
      console.error('Error during registration: ', err);
      setError('Registration failed. Please try again later.');
    }
  };

  return { user, setUser, confirmPassword, setConfirmPassword, error, setError, handleRegistration };
};

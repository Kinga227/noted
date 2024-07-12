import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { logout } from '../api/noted.api';
import { useAuth } from './AuthContext';

export function useLogout() {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(['auth']);

  const handleLogout = async () => {
    try {
      await logout(authToken);
      localStorage.removeItem('token');
      removeCookie('auth', { httpOnly: false, path: '/' });
      navigate('/login');
    } catch (err) {
      console.error('Error occurred during logout:', err);
      setError(err.message || 'An error occurred during logout.');
    }
  };


  return { handleLogout, error };
}

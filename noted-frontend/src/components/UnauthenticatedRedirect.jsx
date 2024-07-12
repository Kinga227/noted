import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { useLogout } from '../hooks/useLogout';

export default function UnauthenticatedRedirect() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      const timeoutId = setTimeout(() => {
        navigate('/login');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, navigate]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="unauthenticated-redirect">
      <p className="unauthenticated">You have no access to this page.</p>
      <button type="button" className="general-button" onClick={handleLoginClick}>
        Go to login page
      </button>
    </div>
  );
}

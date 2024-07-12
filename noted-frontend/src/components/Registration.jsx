import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { useRegistration } from '../hooks/useRegistration';

export default function Registration() {
  const { fetchData } = useLogin();
  const { user, setUser, confirmPassword, setConfirmPassword, error, setError, handleRegistration } = useRegistration();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <div className="main-container">
      <div className="container">
        <h2>CREATE A NEW ACCOUNT</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={(e) => handleRegistration(e).catch((err) => setError(err.message))}>
          <div className="input-group">
            <input
              type="name"
              id="full-name"
              name="full-name"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              placeholder="Full Name"
            />
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
            />
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
            <button type="button" className="general-button" onClick={handleRegistration}>
              Register
            </button>
          </div>
        </form>
      </div>
      <div className="login-newuser-container">
        <h2>ALREADY HAVE AN ACCOUNT?</h2>
        <button type="button" className="general-button" onClick={handleSignInClick}>
          Sign In
        </button>
      </div>
    </div>
  );
}

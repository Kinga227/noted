import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
  const { user, setUser, error, setError, handleLogin, fetchData } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleSignUpClick = () => {
    navigate('/registration');
  };

  return (
    <div className="main-container">
      <div className="container">
        <h2 className="login">LOGIN TO YOUR ACCOUNT</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={(e) => handleLogin(e).catch((err) => setError(err.message))}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={user?.email || ''}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="password"
              id="password"
              name="password"
              value={user?.password || ''}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
            />
            <button type="button" className="general-button" onClick={handleLogin}>
              Sign in
            </button>
          </div>
        </form>
      </div>
      <div className="login-newuser-container">
        <h2>NEW HERE?</h2>
        <button type="button" className="general-button" onClick={handleSignUpClick}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

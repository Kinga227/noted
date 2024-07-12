import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['auth']);

  useEffect(() => {
    const token = cookies.auth;
    if (token) {
      setIsAuthenticated(true);
    }
  }, [cookies.auth]);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = useMemo(
    () => ({
      authToken: cookies.auth,
      setAuthToken: (token) => {
        if (token) {
          setCookie('auth', token, { httpOnly: false, path: '/' });
          setIsAuthenticated(true);
        } else {
          removeCookie('auth', { httpOnly: false, path: '/' });
          setIsAuthenticated(false);
        }
      },
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      logout,
    }),
    [cookies.auth, user, setUser, isAuthenticated, setIsAuthenticated, logout],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

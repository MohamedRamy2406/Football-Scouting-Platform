import { createContext, useContext, useEffect, useState } from 'react';
import {
  getCurrentUser,
  logoutUser
} from '../api/authApi.js';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkSession = async () => {

      try {

        const { response, data } = await getCurrentUser();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }

      } catch (error) {

        console.error('Session check failed:', error);
        setUser(null);

      } finally {

        setLoading(false);

      }


    };

    checkSession();

  }, []);
  const logout = async () => {

  try {

    const { response } = await logoutUser();

    if (!response.ok) {
      console.error('Logout failed.');
      return false;
    }

    setUser(null);

    return true;

  } catch (error) {

    console.error('Logout error:', error);

    return false;

  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
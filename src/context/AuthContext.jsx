import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkSession = async () => {

      try {

        const response = await fetch(
          'http://localhost:5000/api/auth/me',
          {
            credentials: 'include'
          }
        );

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
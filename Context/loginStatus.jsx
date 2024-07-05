import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(); // Use PascalCase for component and context names

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      setIsLoggedIn(isAuthenticated);
      setLoading(false); // Update loading state here
    }, []);
  
    const login = () => {
      setIsLoggedIn(true);
      localStorage.setItem('isAuthenticated', 'true');
    };
  
    const logout = () => {
      setIsLoggedIn(false);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
    };
  
    if (loading) {
        console.log("loading")
      return <div>Loading...</div>;
    }
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };


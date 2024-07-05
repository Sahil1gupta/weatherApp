import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../Context/loginStatus';
import Registration from './Registration';
import Login from './Login';
import Home from './Home';

function App() {
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn)
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        </Routes>
      </Router>

  );
}

export default App;

import { Routes, Route, useNavigate } from 'react-router-dom';

import Profile from './pages/Profile'
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import ProtectedRoute from './pages/ProtectedRoute';
import SignIn from './pages/Signin';
import { useEffect, useState } from 'react';



function App() {
  // Replace this with your authentication logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pull = JSON.parse(localStorage.getItem("user"));
    if(pull){
      setIsAuthenticated(true);
      navigate("/");
    }
  }, []);
  

  return (
    <div className="App">
      <Routes>
        <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated}/>} />

        <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />

      </Routes>

    </div>
  );
}

export default App;

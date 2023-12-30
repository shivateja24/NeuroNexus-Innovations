import { React, useState,useReducer, useContext, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import DashBoard from './components/Dashboard';
import Register from './components/Register';
import TaskDetails from './components/Taskdetails'
 import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
export const User = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const token =  localStorage.getItem("token");

/*   const {  username, id } = useContext(User);
 */

  useEffect(() => {
    token ? navigate('/dashboard'): navigate('/login');
  }, []);

  return (
    
    <Routes>
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/dashboard" element={<DashBoard />} />
      <Route exact path = "/taskdetails" element = {<TaskDetails />}></Route>
       <Route exact path="/login" element={<Login />} />
    </Routes>

  );
};

function App() {
  const [userContext, setUserContext] = useState({});

  return (
    <div>
    <ToastContainer />
      <User.Provider value={{ userContext,setUserContext }}>
       <BrowserRouter>
        <Routing />
      </BrowserRouter>
      </User.Provider>
      </div>
  );
}

export default App;
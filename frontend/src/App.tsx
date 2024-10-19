import './App.css';
import './index.css';

import Login from './components/auth/Login';
import { Routes ,  Route} from 'react-router-dom';
import Home from './components/home/Home';
import { useEffect } from 'react';
import socket from './socket';
import Signup from './components/auth/Signup';
import { SocketProvider } from './context/SocketContext';
import { useAppContext } from './context/AppContext';
 

function App() {

  
 

  
 
  const { user } = useAppContext();

  return (
      <Routes>
        <Route path='login' element={<Login></Login>} ></Route>
        <Route path='signup' element={<Signup></Signup>} ></Route>
        <Route path="" element={<Home></Home>}></Route>
      </Routes>
  );
}

export default App;
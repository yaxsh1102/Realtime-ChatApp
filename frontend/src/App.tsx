import './App.css';
import './index.css';

import Login from './components/auth/Login';
import { Routes ,  Route} from 'react-router-dom';
import Home from './components/home/Home';
import { useEffect } from 'react';
import socket from './socket';

 

function App() {

  
 

  return (
      <Routes>
        <Route path='login' element={<Login></Login>} ></Route>
        <Route path='signup' element={<Login></Login>} ></Route>
        <Route path="" element={<Home></Home>}></Route>
      </Routes>

  );
}

export default App;
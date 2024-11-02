import './App.css';
import './index.css';

import Login from './components/auth/Login';
import { Routes ,  Route} from 'react-router-dom';
import Home from './components/home/Home';
import Signup from './components/auth/Signup';
import useFetchUser from './components/hooks/useGetUser';
 

function App() {
  useFetchUser()



  
 

  
 

  return (
      <Routes>
        <Route path='login' element={<Login></Login>} ></Route>
        <Route path='signup' element={<Signup></Signup>} ></Route>
        <Route path="" element={<Home></Home>}></Route>
      </Routes>
  );
}

export default App;
import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Loader from '../miscellaneous/Loader';
import LoadingButton from '../miscellaneous/LoadingButton';

interface FormData {
  name: string;
  email: string;
  password: string;
  gender: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const[loading , setLoading] = useState<boolean>(false)


  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    gender: ''
  });
  useEffect(()=>{
    async function awakeServer(){

      try{
      const data = await fetch(process.env.REACT_APP_BACKEND_URL as string,{
        method:"POST" ,
        headers:{
          "content-type":"application/json"
        }
      } )
    }catch(err){
      
    }finally{
      setServerReady(true)
    }
    }
   !serverReady &&  awakeServer()

  } , [])

  const { setUser , showToast , serverReady , setServerReady } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const signupHandler = () => {
    const { email, password, name, gender } = formData;
    if (!email || !password || !name || !gender) {
      showToast("All Fields are Required")
      
      return;
    }
    if (isValidEmail.test(email)) {
      void signup(name, email, password, gender);
    }
  };

  async function signup(name: string, email: string, password: string, gender: string) {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL as string}auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, gender }),
      });

      const resp = await response.json();
      if (resp.success) {
        localStorage.setItem('token', resp.data.token);
        setUser(resp.data.user);
        navigate('/');
      }else{
        showToast(resp.message)
      }
    } catch (err) {
      console.log(err)
      showToast("Error Occured")
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#000000] to-[#434343]">
       {!serverReady && <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center'>
        <div className="flex flex-col items-center space-y-4 bg-black/40 p-6 rounded-lg">
          <LoadingButton/>
            <p className="text-white text-lg">
              Warming up the server...
            </p>
            <p className="text-white text-sm">
              This may take up to a minute
            </p>
          </div></div>}
      <div className="p-8 space-y-8 rounded-md shadow-xl w-96 bg-gray-800">
        <h2 className="text-4xl font-bold text-center text-white">Signup</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter your name"
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-sm border-b-[2px] border-b-indigo-500 outline-none"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-sm border-b-[2px] border-b-indigo-500 outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-sm border-b-[2px] border-b-indigo-500 outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              id="gender"
              name="gender"
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-sm border-b-[2px] border-b-indigo-500 outline-none"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>Select your gender for gravatar</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <button
          className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out mt-16"
          onClick={signupHandler}
          disabled={loading}
        >
          {loading ? <LoadingButton></LoadingButton> :"Signup"}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-400 bg-gray-800">OR</span>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400">
          <p>
            Already have an account?{' '}
            <span
              className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

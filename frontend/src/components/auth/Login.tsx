import React,{ useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';


interface FormData {
  email: string;
  password: string; 
}

const Login: React.FC = () => {
  const{ setUser , showToast} = useAppContext()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const navigate = useNavigate()
  const isValidEmail =/ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loginHandler = () => {
    const { email, password } = formData;
    if (!email || !password) {
      showToast("All Fields Required")
      return;
    }
  //   if(isValidEmail.test(email)){
  //   void login(email, password);
  // } else{
  //   showToast("Valid Email Required")
  // }
    login(email , password)

    
  };

  async function login(email: string, password: string) {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL as string + "auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const resp = await response.json();

      if (resp.success) {
        localStorage.setItem('token', resp.data.token);
        setUser(resp.data.user)
        showToast("Login Successfull")

        navigate("/") 
      } else {
        showToast(resp.message)
      }
    } catch (err) {
      showToast("Error Occured")
     
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#000000] to-[#434343]">
      <div className="p-8 space-y-8  rounded-md shadow-xl w-96  bg-gray-800">
        <h2 className="text-4xl font-bold text-center text-white">Login</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
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
        </div>

        <button
          className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out mt-16"
          onClick={loginHandler}
        >
          Login
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
            Don't have an account?{' '}
            <span className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer" onClick={()=>{navigate("/signup")}}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const useFetchUser = () => {
  const { user, setUser } = useAppContext();

  const getUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}auth/get-user`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      setUser(data.data); 
    } catch (error) {
    }
  };

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      getUser();
    }
  }, []);
};

export default useFetchUser;

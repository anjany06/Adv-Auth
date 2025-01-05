import axios from "axios";
import { useState, useEffect } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  //so we have to execute this function whenever page loads
  useEffect(() => {
    getAuthState();
  }, []);
  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    getUserData,
    userData, // Provide the entire user data object to the context
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

import axios from "axios";
import { useState, useEffect } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // const backendUrl = "https://adv-auth-backend.onrender.com";
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth", {
        withCredentials: true, // Include cookies in the request
      });
      if (data.success) {
        setIsLoggedin(true);
        console.log(isLoggedin);
        const userData = await getUserData();
        setUserData(userData);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      if (data.success) {
        setUserData(data.userData);
        console.log(userData);
      } else {
        console.log(data);
      }
    } catch (error) {
      return null; // Return null in case of an error
    }
  };

  //so we have to execute this function whenever page loads
  useEffect(() => {
    if (isLoggedin) {
      getAuthState();
    }
  }, []);
  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    getUserData,
    getAuthState,
    setUserData,
    userData, // Provide the entire user data object to the context
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

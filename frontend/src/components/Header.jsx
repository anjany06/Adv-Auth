import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";

const Header = () => {
  const { getUserData, isLoggedin, userData } = useContext(AppContext);
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedin) {
        const data = await getUserData();
        setLocalUser(data);
      } else {
        setLocalUser(null);
      }
    };
    fetchUserData();
  }, [isLoggedin, getUserData]);
  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {localUser ? localUser.name : "Developer"}!
        <img src={assets.hand_wave} alt="" className="w-8 aspect-square" />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our app
      </h2>
      <p className="mb-8 max-w-md">
        You can test this app by signing up or logging in using your original
        email ID.
      </p>
      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;

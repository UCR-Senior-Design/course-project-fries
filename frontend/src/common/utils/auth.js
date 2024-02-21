import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios";

const AuthContext = createContext(undefined, undefined);

export const AuthProvider = ({children}) => {
  const userToken = localStorage.getItem('userToken');
  const [isLoggedIn, setIsLoggedIn] = useState(!!userToken);
  const [userId, setUserId] = useState(null);
  const [firstname, setFirstName] = useState(null);
  const [lastname, setLastName] = useState(null);
  const [isDoctor, setIsDoctor] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!userToken) return; // If there's no token, we shouldn't try to get the user ID
      try {
        const response = await axios.get("http://localhost:5001/api/verify", {
          headers: {
            'Authorization': userToken,
          }
        });
        setUserId(response.data.user.id); // Update the state with the user ID
        setFirstName(response.data.user.firstname);
        setLastName(response.data.user.lastname);
        setIsDoctor(response.data.user.isDoctor);
      } catch (err) {
        console.error(err);
      }
    };

    getUserInfo();
  }, [userToken]);

  const login = (token) => {
    localStorage.setItem('userToken', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, userId, firstname, lastname, isDoctor, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

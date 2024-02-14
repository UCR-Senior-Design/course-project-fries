import React, {createContext, useState} from 'react';

export const AuthContext = createContext(undefined, undefined);

export const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

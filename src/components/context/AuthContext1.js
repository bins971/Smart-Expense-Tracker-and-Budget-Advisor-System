import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(); 

export const useAuth = () => {
  return useContext(AuthContext); 
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, email, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

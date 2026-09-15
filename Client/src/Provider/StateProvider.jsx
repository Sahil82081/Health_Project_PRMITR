import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [darktheme, setDarkTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    setDarkTheme((prev) => !prev);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darktheme);

    localStorage.setItem("theme", darktheme ? "dark" : "light");
  }, [darktheme]);

  return (
    <StateContext.Provider value={{ darktheme, toggleTheme }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error("useStateContext must be used inside StateProvider");
  }

  return context;
};
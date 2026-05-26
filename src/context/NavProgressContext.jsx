import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const NavProgressContext = createContext(null);

export function NavProgressProvider({ children }) {
  const [pending, setPending] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setPending(false);
  }, [location.pathname]);

  const startNav = useCallback(() => setPending(true), []);

  return (
    <NavProgressContext.Provider value={{ pending, startNav }}>
      {children}
    </NavProgressContext.Provider>
  );
}

export function useNavProgress() {
  const ctx = useContext(NavProgressContext);
  if (!ctx) {
    return { pending: false, startNav: () => {} };
  }
  return ctx;
}

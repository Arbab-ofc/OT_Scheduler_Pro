import { createContext, useContext, useState } from "react";

const UserContext = createContext({
  profile: null,
  setProfile: () => {}
});

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  return <UserContext.Provider value={{ profile, setProfile }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);

"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";

//create context
const GlobalContext = createContext();
// Create provider
export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  //check if user is logged in
  const { data: session } = useSession();
  //if logged in, get unread message count and then set that number in state
  useEffect(() => {
    if (session && session.user) {
      getUnreadMessageCount().then((res) => {
        if (res.count) setUnreadCount(res.count);
      });
    }
  }, [getUnreadMessageCount, session]);
  return (
    <GlobalContext.Provider
      value={{
        unreadCount,
        //setUndreadCount is what updates the number in navbar
        setUnreadCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}

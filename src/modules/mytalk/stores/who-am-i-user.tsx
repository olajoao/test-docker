import { useWhoAmI } from "@/hooks/mytalk/use-who-am-i";
import { useAppToken } from "@/hooks/use-app-token";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { WhoAmIUser } from "../interfaces/who-am-i";

interface WhoAmIUserContextType {
  user?: WhoAmIUser;
  userIdFromStorage?: string | null;
  isPendingWhoAmIUser?: boolean
}

const WhoAmIUserContext = createContext<WhoAmIUserContextType | undefined>(
  undefined,
);

interface WhoAmIUserContextProps {
  children: ReactNode;
}

export const WhoAmIUserContextProvider: React.FC<WhoAmIUserContextProps> = ({
  children,
}) => {
  const { appToken } = useAppToken()
  const { user, isLoadingWhoAmIUser } = useWhoAmI();
  const userId = appToken?.user;

  return (
    <WhoAmIUserContext.Provider 
      value={
        { 
          user, 
          userIdFromStorage: userId, 
          isPendingWhoAmIUser: isLoadingWhoAmIUser 
        }
      }
    >
      {children}
    </WhoAmIUserContext.Provider>
  );
};

export const useWhoAmIUserContext = (): WhoAmIUserContextType => {
  const context = useContext(WhoAmIUserContext);

  if (!context) {
    throw new Error(
      "useMyContext must be used within a WhoAmIUserContextProvider",
    );
  }

  return context;
};

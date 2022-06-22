import { Preloader } from "@src/ui/progress/Preloader";
import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import { LoggedInIdentity, useInternetIdentity } from "./InternetIdentity";

const LoggedInIdentityContext = createContext<LoggedInIdentity>(
  undefined as any
);

export const LoggedInIdentityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const internetIdentity = useInternetIdentity();

  if (internetIdentity.loading) return <Preloader />;

  if (!internetIdentity.isLoggedIn) {
    router.push("/");
    return <Preloader />;
  }

  return (
    <LoggedInIdentityContext.Provider value={internetIdentity}>
      {children}
    </LoggedInIdentityContext.Provider>
  );
};

export function useLoggedInIdentity() {
  return useContext(LoggedInIdentityContext);
}

import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";

const nullPromise: Promise<void> = new Promise(() => {});

export interface LoggedInIdentity {
  logout: () => Promise<void>;
  identity: ReturnType<AuthClient["getIdentity"]>;
  isLoggedIn: true;
}

export interface LoggedOutIdentity {
  login: () => Promise<void>;
  isLoggedIn: false;
}

export type InternetIdentityUser = LoggedInIdentity | LoggedOutIdentity;

const InternetIdentityContext = createContext<InternetIdentityUser>(
  undefined as any
);

export const InternetIdentityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | undefined>();
  const [value, setValue] = useState<InternetIdentityUser>({
    isLoggedIn: false,
    login: () => nullPromise,
  });

  useEffect(() => {
    AuthClient.create().then((client) => {
      setAuthClient(client);
    });
  }, []);

  useEffect(() => {
    async function exec() {
      if (authClient) {
        if (await authClient.isAuthenticated()) {
          const identity = authClient.getIdentity();

          setValue({
            isLoggedIn: true,
            identity,
            logout: () =>
              authClient.logout().then(() => window.location.reload()),
          });
        } else {
          setValue({
            isLoggedIn: false,
            login: () =>
              authClient
                .login({
                  // identityProvider: `http://127.0.0.1:8000/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`,
                  identityProvider: `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:8000/#authorize`,
                  onSuccess: () => {
                    console.log("ON SUCCESS");
                  },
                  onError: () => {
                    console.log("ON ERROR");
                  },
                })
                .then(() => window.location.reload()),
          });
        }
      }
    }

    exec();
  }, [authClient]);

  return (
    <InternetIdentityContext.Provider value={value}>
      {children}
    </InternetIdentityContext.Provider>
  );
};

export function useInternetIdentity() {
  return useContext(InternetIdentityContext);
}

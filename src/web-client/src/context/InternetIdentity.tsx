import { AuthClient } from "@dfinity/auth-client";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

const nullPromise: Promise<void> = new Promise(() => {});

export interface LoggedInIdentity {
  logout: () => Promise<void>;
  loading: boolean;
  identity: ReturnType<AuthClient["getIdentity"]>;
  isLoggedIn: true;
}

export interface LoggedOutIdentity {
  login: () => Promise<void>;
  loading: boolean;
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
    loading: true,
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
            loading: false,
            logout: () =>
              authClient.logout().then(() => window.location.reload()),
          });
        } else {
          setValue({
            loading: false,
            isLoggedIn: false,
            login: () =>
              authClient.login({
                ...(process.env.DFX_NETWORK === "ic"
                  ? {}
                  : {
                      identityProvider: `http://localhost:8000/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`,
                    }),
                onSuccess: () => {
                  window.location.reload();
                },
                onError: (e) => {
                  console.error("Error while trying to authenticate", e);
                },
              }),
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

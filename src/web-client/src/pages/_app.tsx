import "../globals.css";
import type { AppProps } from "next/app";
import { AppPage } from "../types";
import { applyDefaultLayout } from "../layouts/DefaultLayout";
import { InternetIdentityProvider } from "@src/context/InternetIdentity";
import { HonestProvider } from "@src/context/HonestActor";
import { LoggedInIdentityProvider } from "@src/context/LoggedInIdentity";
import { ICPLedgerProvider } from "@src/context/ICPLedger";

function MyApp({ Component, pageProps }: AppProps) {
  const applyLayout = (Component as AppPage).applyLayout || applyDefaultLayout;

  return (
    <InternetIdentityProvider>
      <ICPLedgerProvider>
        <HonestProvider>
          {applyLayout(<Component {...pageProps} />)}
        </HonestProvider>
      </ICPLedgerProvider>
    </InternetIdentityProvider>
  );
}

export default MyApp;

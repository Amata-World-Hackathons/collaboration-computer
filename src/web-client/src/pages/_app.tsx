import "../globals.css";
import type { AppProps } from "next/app";
import { AppPage } from "../types";
import { applyDefaultLayout } from "../layouts/DefaultLayout";
import { InternetIdentityProvider } from "@src/context/InternetIdentity";
import { HonestProvider } from "@src/context/HonestActor";

function MyApp({ Component, pageProps }: AppProps) {
  const applyLayout = (Component as AppPage).applyLayout || applyDefaultLayout;

  return (
    <InternetIdentityProvider>
      <HonestProvider>
        {applyLayout(<Component {...pageProps} />)}
      </HonestProvider>
    </InternetIdentityProvider>
  );
}

export default MyApp;

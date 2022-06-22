import { LoggedInIdentityProvider } from "@src/context/LoggedInIdentity";
import React from "react";
import { applyDefaultLayout } from "./DefaultLayout";

export default function applyPrivatePageLayout(page: React.ReactNode) {
  return applyDefaultLayout(
    <LoggedInIdentityProvider>{page}</LoggedInIdentityProvider>
  );
}

import { HttpAgent } from "@dfinity/agent";
import { LedgerCanister } from "@dfinity/nns";
import { Principal } from "@dfinity/principal";
import { createContext, useContext, useMemo } from "react";
import { useInternetIdentity } from "./InternetIdentity";

const ICPLedgerContext = createContext<LedgerCanister>(undefined as any);

export const ICPLedgerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const internetIdentity = useInternetIdentity();

  const ledger = useMemo(() => {
    const identity = internetIdentity.isLoggedIn
      ? internetIdentity.identity
      : undefined;

    if (process.env.DFX_NETWORK === "ic") {
      return LedgerCanister.create();
    } else {
      const agent = new HttpAgent({
        identity,
        host: "http://localhost:8000",
      });

      // required as per https://forum.dfinity.org/t/fail-to-verify-certificate-in-development-update-calls/4078/12
      agent.fetchRootKey();

      return LedgerCanister.create({
        agent,
        canisterId: Principal.fromText(process.env.LEDGER_CANISTER_ID!),
      });
    }
  }, [internetIdentity]);

  return (
    <ICPLedgerContext.Provider value={ledger}>
      {children}
    </ICPLedgerContext.Provider>
  );
};

export function useICPLedger() {
  return useContext(ICPLedgerContext);
}

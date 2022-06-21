import type { Actor, ActorConfig, HttpAgentOptions } from "@dfinity/agent";
import { createContext, useContext, useEffect, useState } from "react";
import { useInternetIdentity } from "./InternetIdentity";

import type { Event, _SERVICE } from "../../../declarations/honest/honest.did";

interface HonestModule {
  canisterId: string;
  createActor: (
    canisterId: string,
    options?: {
      agentOptions?: HttpAgentOptions;
      actorOptions?: ActorConfig;
    }
  ) => _SERVICE & Actor;
  honest: _SERVICE & Actor;
}

const honestModule: HonestModule =
  typeof window !== "undefined"
    ? require("../../../declarations/honest")
    : ({} as HonestModule);

const HonestActorContext = createContext<_SERVICE & Actor>(undefined as any);

export const HonestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const internetIdentity = useInternetIdentity();
  const [value, setValue] = useState(honestModule.honest);

  useEffect(() => {
    if (internetIdentity.isLoggedIn) {
      setValue(
        honestModule.createActor(honestModule.canisterId, {
          agentOptions: {
            identity: internetIdentity.identity,
          },
        })
      );
    } else {
      setValue(honestModule.honest);
    }
  }, [internetIdentity]);

  return (
    <HonestActorContext.Provider value={value}>
      {children}
    </HonestActorContext.Provider>
  );
};

export function useHonestActor() {
  return useContext(HonestActorContext);
}

export function eventHasLimitedAvailability(event: Event) {
  return Math.max(event.remainingTickets, 0.1 * event.totalSupply) <= 100;
}

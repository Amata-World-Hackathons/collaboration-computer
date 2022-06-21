import type { Actor } from "@dfinity/agent";
import { useEffect, useState } from "react";

export interface ActorQueryResult<T> {
  data?: T;
  error?: string;
  loading: boolean;
}

export function useActorQuery<T = any>(input: {
  actor: Actor;
  method: string;
  args?: any[];
  skip?: boolean;
}) {
  const [result, setResult] = useState<ActorQueryResult<T>>({ loading: true });
  const { actor, method, args = [], skip = false } = input;

  const normalizedArgs = JSON.stringify(input);

  useEffect(() => {
    if (skip) return;

    (actor as any)[method].apply(actor, args).then(
      (res: T) => {
        setResult({ loading: false, data: res });
      },
      (err: Error) => {
        setResult({
          loading: false,
          error: err.message,
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedArgs]);

  return result;
}

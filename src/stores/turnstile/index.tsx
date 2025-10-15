import { Turnstile } from "@marsidev/react-turnstile";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { reportCaptchaSolve } from "@/backend/helpers/report";
import { conf } from "@/setup/config";

export interface TurnstileStore {
  cbs: ((token: string | null) => void)[];
  getToken(): Promise<string>;
  processToken(token: string | null): void;
}

export const useTurnstileStore = create(
  immer<TurnstileStore>((set, get) => ({
    cbs: [],
    processToken(token) {
      const cbs = get().cbs;
      cbs.forEach((fn) => fn(token));
      set((s) => {
        s.cbs = [];
      });
    },
    getToken() {
      return new Promise((resolve, reject) => {
        set((s) => {
          s.cbs = [
            ...s.cbs,
            (token) => {
              if (!token) reject(new Error("Failed to get token"));
              else resolve(token);
            },
          ];
        });
      });
    },
  })),
);

export async function getTurnstileToken() {
  try {
    const token = await useTurnstileStore.getState().getToken();

    reportCaptchaSolve(true);
    return token;
  } catch (err) {
    reportCaptchaSolve(false);
    throw err;
  }
}

export function TurnstileProvider() {
  const siteKey = conf().TURNSTILE_KEY;
  const processToken = useTurnstileStore((s) => s.processToken);
  if (!siteKey) return null;
  return (
    <Turnstile
      siteKey={siteKey}
      options={{
        refreshExpired: "auto",
        theme: "dark",
      }}
      onError={() => {
        processToken(null);
      }}
      onSuccess={(token) => {
        processToken(token);
      }}
    />
  );
}

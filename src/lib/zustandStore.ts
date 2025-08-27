"use client";

import React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Locality = {
  id: number;
  category: string;
  latitude: number;
  longitude: number;
  location: string;
  postcode: string;
  state: string;
};

export type ValidationResult = {
  valid: boolean;
  error?: string | null;
  match?: Locality | null;
};

type ActiveTab = "verifier" | "source" | "logs";

type Store = {
  activeTab: ActiveTab;
  setActiveTab: (t: ActiveTab) => void;

  // Verifier
  vPostcode: string;
  vSuburb: string;
  vState: string;
  vResult?: ValidationResult;
  setVPostcode: (v: string) => void;
  setVSuburb: (v: string) => void;
  setVState: (v: string) => void;
  setVResult: (r?: ValidationResult) => void;

  // Source
  sourceQuery: string;
  sourceState: string;
  sourceResults?: Locality[];
  selectedLocation?: Locality | null;
  setSourceQuery: (v: string) => void;
  setSourceState: (v: string) => void;
  setSourceResults: (v?: Locality[]) => void;
  setSelectedLocation: (v?: Locality | null) => void;
};


export const useAppStore = create<Store>()(
  persist(
    (set) => ({
      activeTab: "verifier",
      setActiveTab: (t) => set({ activeTab: t }),

      vPostcode: "",
      vSuburb: "",
      vState: "",
      vResult: undefined,
      setVPostcode: (v) => set({ vPostcode: v }),
      setVSuburb: (v) => set({ vSuburb: v }),
      setVState: (v) => set({ vState: v }),
      setVResult: (r) => set({ vResult: r }),

      sourceQuery: "",
      sourceState: "",
      sourceResults: undefined,
      selectedLocation: null,
      setSourceQuery: (v) => set({ sourceQuery: v }),
      setSourceState: (v) => set({ sourceState: v }),
      setSourceResults: (v) => set({ sourceResults: v }),
      setSelectedLocation: (v) => set({ selectedLocation: v ?? null }),
    }),
    {
      name: "lawpath-address-app",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

// Small wrapper to ensure children render after hydration (avoids mismatch)
export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => setReady(true), []);
  if (!ready) return null;
  return { children };
}
import type React from "react";
import { createContext, useContext, useState } from "react";

export type SelectedProvider = null | "AWS" | "Azure" | "GCP";

interface ProviderFilterContextValue {
  selectedProvider: SelectedProvider;
  setSelectedProvider: (p: SelectedProvider) => void;
}

export const ProviderFilterContext = createContext<ProviderFilterContextValue>({
  selectedProvider: null,
  setSelectedProvider: () => {},
});

export function ProviderFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedProvider, setSelectedProvider] =
    useState<SelectedProvider>(null);

  return (
    <ProviderFilterContext.Provider
      value={{ selectedProvider, setSelectedProvider }}
    >
      {children}
    </ProviderFilterContext.Provider>
  );
}

export function useProviderFilter(): ProviderFilterContextValue {
  return useContext(ProviderFilterContext);
}

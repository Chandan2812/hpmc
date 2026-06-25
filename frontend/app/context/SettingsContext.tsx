"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { LeadFormSettings } from "../types/leadForm";

interface AppSettings {
  branding?: {
    companyName?: string;
    logo?: string;
  };
  modules?: Record<string, boolean>;
  leadForm?: LeadFormSettings;
}

interface SettingsContextType {
  settings: AppSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
